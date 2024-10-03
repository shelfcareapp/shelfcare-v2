import { randomBytes } from 'crypto';
import { hash } from 'bcryptjs';
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  const body = await req.json();
  const { email } = body;

  if (!email) {
    return NextResponse.json({ message: 'Email is required' }, { status: 400 });
  }

  try {
    const { db } = await connectToDatabase();

    const user = await db.collection('users').findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: 'User with this email does not exist' },
        { status: 400 }
      );
    }

    const resetToken = randomBytes(32).toString('hex');
    const hashedToken = await hash(resetToken, 10);
    const resetTokenExpiry = Date.now() + 3600000;

    await db.collection('users').updateOne(
      { email },
      {
        $set: {
          passwordResetToken: hashedToken,
          passwordResetExpires: resetTokenExpiry
        }
      }
    );

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}&email=${email}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_FROM,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });

    const mailOptions = {
      from: process.env.GMAIL_FROM,
      to: email,
      subject: 'Password Reset Request',
      text: `You have requested to reset your password. Click on the link below to reset it:
      
      ${resetUrl}
      
      If you did not request this, please ignore this email.`
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: 'Password reset link sent successfully!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { message: 'Failed to send email.' },
      { status: 500 }
    );
  }
}

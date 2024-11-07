import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';
import { config } from '../../../../config';

export async function POST(req) {
  const body = await req.json();

  const { firstName, lastName, email, phone, message } = body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_FROM,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });

  const mailOptions = {
    from: email,
    to: config.mailing.from,
    subject: `Tiedusteluja verkkosivustolta: ${firstName} ${lastName}`,
    text: `Nimi: ${firstName} ${lastName}\nSähköposti: ${email}\nPuhelin: ${phone}\nViesti: ${message}`
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json(
      { message: 'Email sent successfully!' },
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

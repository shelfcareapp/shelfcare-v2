import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';
import { config } from '../../../config';

const formatDate = (formDate) => {
  const formattedDate = new Date(formDate.date);
  const formattedTime = formDate.time;

  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const formattedDateString = dateFormatter.format(formattedDate);

  return `${formattedDateString}. ${formattedTime}`;
};

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      name,
      phone,
      email,
      address,
      zip,
      city,
      orderDetails,
      pickupDate,
      returnDate
      // orderImages
    } = body;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_FROM,
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });

    const mailOptions = {
      from: `"ShelfCare Orders" <${process.env.GMAIL_FROM}>`,
      to: config.mailing.from,
      subject: `🎉 Uusi tilaus vastaanotettu! 📦`,
      html: `
        <h3>Uusi tilaus vastaanotettu!:</h3>
        <p><strong>Nimi:</strong> ${name}</p>
        <p><strong>Puhelin:</strong> ${phone}</p>
        <p><strong>Sähköposti:</strong> ${email}</p>
        <p><strong>Katuosoite:</strong> ${address}</p>
        <p><strong>Kaupunki:</strong> ${city}</p>
        <p><strong>Postinumero:</strong> ${zip}</p>
        <p><strong>Tilauksen tiedot:</strong> ${orderDetails}</p>
        <p><strong>Hakupäiva:</strong> ${formatDate(pickupDate)}</p>
        <p><strong>Palautuspäiva:</strong> ${formatDate(returnDate)}</p>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      return NextResponse.json(
        { message: 'Order email sent successfully!' },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        { message: 'Failed to send order email.' },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to parse request body.' },
      { status: 400 }
    );
  }
}

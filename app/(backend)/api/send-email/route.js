import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export const POST = async (req) => {
  try {
    const { email, subject, message, link } = await req.json();

    if (!email || !subject || !message) {
      return NextResponse.json({ message: 'Email, subject, and message are required' }, { status: 400 });
    }

    // Create the email transporter using Gmail's SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    // Email options
    const mailOptions = {
      from: `"Fresh Grocery" <${process.env.GMAIL_USER}>`,
      to: email, // recipient email address
      subject: subject,
      text: `${message}\n\nConfirm your email by clicking this link: ${link}`, // plain text body
      html: `<p>${message}</p><p><a href="${link}">Confirm your email</a></p>`, // HTML body
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ message: 'Error sending email', error: error.message }, { status: 500 });
  }
};

import nodemailer from 'nodemailer';
import config from '../app/config';

export const sendEmail = async (to : string, html : string) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: config.NODE_ENV === 'production' ? true  : false,
      auth: {
        user: 'web.mohosin@gmail.com',
        pass: 'apzk vjwi ywpo jieg',
      },
      tls: {
        rejectUnauthorized: false // Disable certificate verification
      }
    });
  
    await transporter.sendMail({
      from: 'web.mohosin@gmail.com', // sender address
      to,
      subject: 'Reset your password within 10 mins!', // Subject line
      text: '', // plain text body
      html
    });
  } catch (error) {
    console.log(error);
  }
};

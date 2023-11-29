import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'mail.superdolphins.com',
  port: 465,
  secure: true, 
  auth: {
    user: 'super_dolphins@superdolphins.com', 
    pass: '' 
  }
});

export default transporter;
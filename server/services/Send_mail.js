import transporter from '../config/smtpConfig.js';

const sendEmail = (email, subject, content, attachment, cc, bcc) =>{

  return new Promise((resolve, reject) => {
      let obj = {
          from: 'DigitalIpsum super_dolphins@superdolphins.com',
          to: email, // list of receivers
          subject: subject, 
          html: content
      };
      if(attachment)
          obj.attachments = attachment;
      if(cc)
          obj.cc= cc
      if(bcc)
          obj.bcc= bcc
      transporter.sendMail(obj, (err, info)=>{
        if (err) {
          console.error(err);
        } else {
          resolve('Email sent: ' + info.response);
        }
      });
  })
};

export default sendEmail

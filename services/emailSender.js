const nodemailer = require('nodemailer');
const { EMAIL, PASS } = require('../context/env');
const mailer = (recipientMail, code) => {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL,
        pass: PASS,
      },
    });
    const mailOptions = {
      from: EMAIL,
      to: recipientMail,
      subject: 'Peer Code',
      html: `<p>Hello  your Peer Code is <b>${code}</b></p></br>`,
    };
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        reject({ err: err });
      } else {
        resolve(info);
      }
    });
  });
};

module.exports = mailer;

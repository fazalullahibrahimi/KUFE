// const nodemailer = require('nodemailer');

// class Email {
//   constructor(user, url) {
//     this.to = user.email;
//     this.firstName = user.firstName;
//     this.url = url;
//     this.from = `Kandahar Univercity Faculty of Ecconomic <${process.env.EMAIL_FROM}>`;
//   }

//   newTransport() {
//     return nodemailer.createTransport({
//       host: process.env.EMAIL_HOST,
//       port: process.env.EMAIL_PORT,
//       auth: {
//         user: process.env.EMAIL_USERNAME,
//         pass: process.env.EMAIL_PASSWORD,
//       },
//     });
//   }

//   async send(template, subject) {
//     // Define email options
//     const mailOptions = {
//       from: this.from,
//       to: this.to,
//       subject,
//       text: `Please click on the following link to reset your password: ${this.url}`,
//     };

//     // Create a transport and send email
//     await this.newTransport().sendMail(mailOptions);
//   }

//   async sendPasswordReset() {
//     await this.send(
//       'passwordReset',
//       'Your password reset token (valid for only 10 minutes)'
//     );
//   }
// }

// module.exports = Email;


const nodemailer = require("nodemailer")

class Email {
  constructor(user, url) {
    this.to = user.email
    this.firstName = user.fullName ? user.fullName.split(" ")[0] : ""
    this.url = url
    this.from = `Kandahar University Faculty of Economic <${process.env.EMAIL_FROM}>`
  }

  newTransport() {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    })
  }

  async send(template, subject, content) {
    // Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html: content || `Please click on the following link: ${this.url}`,
    }

    // Create a transport and send email
    await this.newTransport().sendMail(mailOptions)
  }

  async sendPasswordReset() {
    await this.send("passwordReset", "Your password reset token (valid for only 10 minutes)")
  }

  // New method for sending verification OTP
  async sendVerificationOTP(otp) {
    const content = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h1 style="color: #333; text-align: center;">Email Verification</h1>
        <p>Dear ${this.firstName || "User"},</p>
        <p>Thank you for registering with Kandahar University Faculty of Economic. Please use the following OTP to verify your email address:</p>
        <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
          ${otp}
        </div>
        <p>This OTP will expire in 10 minutes.</p>
        <p>Alternatively, you can click on the following link to verify your email:</p>
        <p style="text-align: center;">
          <a href="${this.url}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
        </p>
        <p>If you did not create an account, please ignore this email.</p>
        <p>Best regards,<br>Kandahar University Faculty of Economic</p>
      </div>
    `

    await this.send("emailVerification", "Email Verification OTP", content)
  }
}

module.exports = Email

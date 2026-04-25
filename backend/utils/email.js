import nodemailer from 'nodemailer';
import pug from 'pug';
import { htmlToText } from 'html-to-text';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class Email {
  constructor(toEmail, firstName, url) {
    this.to = toEmail;
    this.firstName = firstName;
    this.url = url;
    this.from = `Your App <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    // Production (SendGrid)
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    }

    // Development (Mailtrap)
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template, subject, locals = {}) {
    // Render pug template
    // let html;
    // try {
    //   html = pug.renderFile(
    //     `${process.cwd()}/views/email/${templateName}.pug`,
    //     {
    //       firstName: this.firstName,
    //       url: this.url,
    //       subject,
    //       ...locals,
    //     }
    //   );
    // } catch (err) {
    //   // fallback HTML
    //   // ensures system never crashes because of a missing template
    //   html = `
    //     <p>Hello ${this.firstName},</p>
    //     <p>${subject}</p>
    //     <p><a href="${this.url}">${this.url}</a></p>
    //   `;
    // }
    // const mailOptions = {
    //   from: this.from,
    //   to: this.to,
    //   subject,
    //   html,
    //   text: htmlToText(html),
    // };
    // await this.newTransport().sendMail(mailOptions);
    const html = pug.renderFile(
      path.join(__dirname, '../views', `${template}.pug`),
      {
        firstName: this.firstName,
        url: this.url,
        subject,
      }
    );

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText(html),
    };

    await this.newTransport().sendMail(mailOptions);
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 minutes)'
    );
  }
}

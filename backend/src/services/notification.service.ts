import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NotificationService {
  private transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  async sendEmail(to: string, subject: string, text: string) {
    if (!process.env.SMTP_HOST) return;
    await this.transporter.sendMail({ from: process.env.SMTP_USER, to, subject, text });
  }

  async sendReservationConfirmation(to: string) {
    await this.sendEmail(to, 'Reservation Confirmed', 'Your reservation is confirmed');
  }

  async sendReservationUpdate(to: string) {
    await this.sendEmail(to, 'Reservation Updated', 'Your reservation was updated');
  }

  async sendReservationCancellation(to: string) {
    await this.sendEmail(to, 'Reservation Cancelled', 'Your reservation was cancelled');
  }
}

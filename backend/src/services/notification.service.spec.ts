import { NotificationService } from './notification.service';
import * as nodemailer from 'nodemailer';

jest.mock('nodemailer');

describe('NotificationService', () => {
  const sendMailMock = jest.fn();

  beforeEach(() => {
    (nodemailer.createTransport as jest.Mock).mockReturnValue({ sendMail: sendMailMock });
    sendMailMock.mockReset();
    process.env.SMTP_HOST = 'smtp';
    process.env.SMTP_USER = 'user';
    process.env.SMTP_PASS = 'pass';
  });

  afterEach(() => {
    delete process.env.SMTP_HOST;
    delete process.env.SMTP_USER;
    delete process.env.SMTP_PASS;
  });

  it('does not send email when SMTP_HOST missing', async () => {
    delete process.env.SMTP_HOST;
    const service = new NotificationService();
    await service.sendEmail('to@test', 'sub', 'body');
    expect(sendMailMock).not.toHaveBeenCalled();
  });

  it('sends email using transporter', async () => {
    const service = new NotificationService();
    await service.sendEmail('to@test', 'sub', 'text');
    expect(sendMailMock).toHaveBeenCalledWith({
      from: 'user',
      to: 'to@test',
      subject: 'sub',
      text: 'text',
    });
  });

  it('sends reservation confirmation', async () => {
    const service = new NotificationService();
    await service.sendReservationConfirmation('to@test');
    expect(sendMailMock).toHaveBeenCalledWith({
      from: 'user',
      to: 'to@test',
      subject: 'Reservation Confirmed',
      text: 'Your reservation is confirmed',
    });
  });

  it('sends reservation update', async () => {
    const service = new NotificationService();
    await service.sendReservationUpdate('to@test');
    expect(sendMailMock).toHaveBeenCalledWith({
      from: 'user',
      to: 'to@test',
      subject: 'Reservation Updated',
      text: 'Your reservation was updated',
    });
  });

  it('sends reservation cancellation', async () => {
    const service = new NotificationService();
    await service.sendReservationCancellation('to@test');
    expect(sendMailMock).toHaveBeenCalledWith({
      from: 'user',
      to: 'to@test',
      subject: 'Reservation Cancelled',
      text: 'Your reservation was cancelled',
    });
  });
});

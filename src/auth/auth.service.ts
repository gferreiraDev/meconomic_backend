import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { SendgridService } from '../services/sendgrid/sendgrid.service';
import { TwilioService } from '../services/twilio/twilio.service';
import { formatPhoneNumber } from '../utils/formatter';
const crypto = require('crypto');

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwt: JwtService,
    private emailService: SendgridService,
    private smsService: TwilioService,
  ) {}

  async validate(email: string, password: string): Promise<any> {
    const user = await this.userService.find({ email });

    if (!user) return null;

    const { password: hash, ...rest } = user;
    if (!bcrypt.compareSync(password, hash)) return null;

    return { user: rest, access_token: this.jwt.sign({ sub: rest.id }) };
  }

  async register(data: any): Promise<User | null> {
    const { confirmPassword, acceptTerms, ...userData } = data;

    if (confirmPassword !== data.password || !acceptTerms) return null;

    const user = await this.userService.create(userData);

    if (!user) return null;

    await this.emailService.sendEmail({
      to: { name: `${user.firstName} ${user.lastName}`, email: user.email },
      from: process.env.SENDGRID_ACCOUNT,
      subject: 'Sending with SendGrid is Fun',
      text: 'and easy to do anywhere, even with Node.js',
      html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    });

    return user;
  }

  async updatePassword(user: User, data: any): Promise<User | null> {
    if (!bcrypt.compareSync(data.currentPassword, user.password)) return null;

    const hash: string = bcrypt.hashSync(data.password, 10);

    const userData = await this.userService.update(user.id, {
      password: hash,
    });

    delete userData.password;
    delete userData.isValidated;

    return userData;
  }

  async forgotPassword({
    email,
    document,
  }: {
    email: string;
    document: string;
  }): Promise<any> {
    const user = await this.userService.find({ email, document });
    if (!user) return null;

    const recoveryCode: string = crypto.randomBytes(8).toString('hex');
    const resetToken: string = await bcrypt.hash(recoveryCode, 10);

    await this.userService.update(user.id, { resetToken });

    // TODO: create a template to send either a code or a link
    await this.emailService.sendEmail({
      to: { name: `${user.firstName} ${user.lastName}`, email: user.email },
      from: process.env.SENDGRID_ACCOUNT,
      subject: 'Account Recovery',
      text: `We received a request for password reset from your accout. 
        If you recognize this request, please access the link: http://localhost:5173/reset-password/${resetToken}.  
        If you didn't make the request, please discart this message, no action is required.`,
      html: `
        <h4>We received a request for password reset from your accout.</h4> 
        <p>If you recognize this request, please access the link <a href='http://localhost:5173/reset-password/${resetToken}'>here</a></p>.
        <p>If you didn't make the request, please discart this message, no action is required.</p>`,
    });

    await this.smsService.sendSMS({
      to: formatPhoneNumber(user.phone),
      body: `We received a request for password reset from your accout. 
        If you recognize this request, please access the link: http://localhost:5173/reset-password/${resetToken}.  
        If you didn't make the request, please discart this message, no action is required.`,
    });

    return recoveryCode;
  }

  async resetPassword(data: any): Promise<any> {
    const user = await this.userService.find({ id: data.id });
    if (!user) return null;

    const isResetTokenValid = await bcrypt.compare(
      data.resetToken,
      user.resetToken,
    );
    if (!isResetTokenValid) return null;

    const hash = await bcrypt.hash(data.password, 10);

    return await this.userService.update(user.id, {
      password: hash,
      resetToken: null,
    });
  }
}

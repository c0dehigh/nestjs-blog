import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from 'src/users/user.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  public async sendUserWelcome(user: User): Promise<void> {
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Welcome to our service!',
      template: './welcome', // The name of the template file (without extension)
      context: {
        name: user.firstName,
        email: user.email,
        loginUrl: 'http://localhost:3000',
      },
    });
  }
}

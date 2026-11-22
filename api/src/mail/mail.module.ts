import { Module } from '@nestjs/common';
import { MailService } from './mail.service';

// To send emails from another module (for example auth):
// imports: [MailModule] in that module, and inject MailService in the service.
@Module({
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}

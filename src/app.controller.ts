import { Controller } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
}

// ID :  1098575675933-bput1j2oiqs56ch6kovq7a8b10kbdgbo.apps.googleusercontent.com

// Client s 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

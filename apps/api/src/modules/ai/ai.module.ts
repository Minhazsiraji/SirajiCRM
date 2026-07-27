import { Module } from '@nestjs/common';
import { ExtractionService } from './extraction.service.js';
import { KbService } from './kb.service.js';

@Module({
  providers: [ExtractionService, KbService],
  exports: [ExtractionService, KbService],
})
export class AiModule {}

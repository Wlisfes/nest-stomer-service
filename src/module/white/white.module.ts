import { Module } from '@nestjs/common';
import { WhiteController } from './white.controller';
import { WhiteService } from './white.service';

@Module({
  controllers: [WhiteController],
  providers: [WhiteService]
})
export class WhiteModule {}

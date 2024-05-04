import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { LocalLlamaModelController } from './local-llama-model.controller';
import { LocalLlamaModelService } from './local-llama-model.service';

@Module({
  imports: [HttpModule],
  controllers: [LocalLlamaModelController],
  providers: [LocalLlamaModelService]
})
export class LocalLlamaModelModule {}

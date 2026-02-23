import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StorageController } from './storage/storage.controller';
import { StorageService } from './storage/storage.service';
import { ComputeController } from './compute/compute.controller';
import { ComputeService } from './compute/compute.service';
import { ConfigModule } from '@nestjs/config';
import { StorageModule } from './storage/storage.module';
import { ComputeModule } from './compute/compute.module';
import contractConfig from './config/contract.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [contractConfig],
    }),
    StorageModule,
    ComputeModule,
  ],
  controllers: [AppController, StorageController, ComputeController],
  providers: [AppService, StorageService, ComputeService],
})
export class AppModule {}

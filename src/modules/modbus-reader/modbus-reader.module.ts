import { Module } from '@nestjs/common';
import { ModbusReaderService } from './modbus-reader.service';
import { ModbusReaderController } from './modbus-reader.controller';

@Module({
  imports: [], // Add any imported modules here
  controllers: [ModbusReaderController], // Add any controllers here
  providers: [ModbusReaderService],
  exports: [ModbusReaderService], // Add any providers (services) here
})
export class ModbusReaderModule {}

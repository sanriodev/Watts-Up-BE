import {
  Controller,
  Get,
  Inject,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReS } from '../../common/res.model';
import { ModbusReaderService } from './modbus-reader.service';

@Controller('modbus-reader')
@ApiTags('modbus-reader')
export class ModbusReaderController {
  constructor(
    @Inject(ModbusReaderService)
    private readonly modbusReaderService: ModbusReaderService,
  ) {}

  @Get('/')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @ApiOperation({
    summary: 'read data',
    description: 'read data manual',
  })
  async getAll() {
    return ReS.FromData(await this.modbusReaderService.getModbusData());
  }
}

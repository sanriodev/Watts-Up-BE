import { Injectable, Logger } from '@nestjs/common';
import ModbusRTU from 'modbus-serial';
import { ReadRegisterResult } from 'modbus-serial/ModbusRTU';

@Injectable()
export class ModbusReaderService {
  private client: ModbusRTU;

  constructor() {
    this.client = new ModbusRTU();
  }

  async getModbusData(): Promise<ReadRegisterResult> {
    await this.connect();

    const res = await this.readHoldingRegisters();
    await this.disconnect();
    return res;
  }

  private async connect(
    ip: string = '192.168.188.67',
    port: number = 5743,
  ): Promise<void> {
    try {
      // Open the serial port
      await this.client.connectTcpRTUBuffered(ip, { port: port });
      // Set the slave ID (usually the address of the device)
      Logger.log('Connected to Modbus device');

      this.client.setID(251);
      // Set a timeout for the connection
      Logger.log('set the device id');
    } catch (error) {
      Logger.error('Failed to connect to Modbus device', error);
    }
  }

  private async readHoldingRegisters(): Promise<ReadRegisterResult> {
    try {
      Logger.log('reading registers');

      const res: any = await this.client.readHoldingRegisters(0, 1);
      Logger.log('reading registers successful');
      return res;
    } catch (error) {
      Logger.error('Failed to read holding registers', error);
      throw error;
    }
  }

  private async disconnect(): Promise<void> {
    try {
      await this.client.close(() => {});
      Logger.log('Disconnected from Modbus device');
    } catch (error) {
      Logger.error('Failed to disconnect from Modbus device', error);
    }
  }
}

export class ModbusReadParams {
  register: number;
  length: number;
  key: string;
}
export class ModbusReadResult {
  key: string;
  readResult: ReadRegisterResult;
}

import { Injectable, Logger } from '@nestjs/common';
import ModbusRTU from 'modbus-serial';
import { ReadRegisterResult } from 'modbus-serial/ModbusRTU';

@Injectable()
export class ModbusReaderService {
  private client: ModbusRTU;

  constructor() {
    this.client = new ModbusRTU();
  }

  async getModbusData(): Promise<ModbusReadResult[]> {
    await this.connect();
    const addresses: ModbusReadParams[] = [
      {
        register: 33000,
        length: 1,
        key: 'SOC', //state of charge
      },
      {
        register: 30254,
        length: 1,
        key: 'voltage',
      },
      {
        register: 4,
        length: 2,
        key: 'power',
      },
    ];
    const res = await this.readHoldingRegisters(addresses);
    await this.disconnect();
    return res;
  }

  private async connect(
    ip: string = 'espressif.fritz.box',
    port: number = 502,
  ): Promise<void> {
    try {
      // Open the serial port
      await this.client.connectTcpRTUBuffered(ip, { port });
      // Set the slave ID (usually the address of the device)
      this.client.setID(1);
      // Set a timeout for the connection
      this.client.setTimeout(1000);
      Logger.log('Connected to Modbus device');
    } catch (error) {
      Logger.error('Failed to connect to Modbus device', error);
    }
  }

  private async readHoldingRegisters(
    addresses: ModbusReadParams[],
  ): Promise<ModbusReadResult[]> {
    try {
      const res: ModbusReadResult[] = [];
      for (const address of addresses) {
        res.push({
          key: address.key,
          readResult: await this.client.readHoldingRegisters(
            address.register,
            address.length,
          ),
        });
      }
      return res;
    } catch (error) {
      Logger.error('Failed to read holding registers', error);
      throw error;
    }
  }

  private async disconnect(): Promise<void> {
    try {
      await this.client.close(() => { });
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

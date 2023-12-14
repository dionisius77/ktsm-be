import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Repository } from "typeorm";
import { CreateVehicleDto } from "./parking.dto";
import { Vehicle } from "@app/entities";

@Injectable()
export class UserVehicleService {
  @InjectRepository(Vehicle)
  private readonly vehicleRepository: Repository<Vehicle>;

  public async createVehicle(
    userId: string,
    payload: CreateVehicleDto,
  ): Promise<void> {
    const { name, licensePlate, brand } = payload;
    const vehicle = new Vehicle();
    vehicle.userId = userId;
    vehicle.name = name;
    vehicle.brand = brand;
    vehicle.licensePlate = licensePlate;
    vehicle.createdAt = new Date();
    await this.vehicleRepository.save(vehicle);
  }

  public async getVehicle(userId: string): Promise<Vehicle[]> {
    return await this.vehicleRepository.find({
      where: { userId, deletedAt: IsNull() },
      order: { name: "ASC" },
    });
  }

  public async udpateVehicle(
    userId: string,
    id: string,
    payload: CreateVehicleDto,
  ): Promise<void> {
    const vehicle = await this.vehicleRepository.findOne({
      where: { id, userId },
    });
    if (!vehicle) {
      throw new HttpException(`No vehicle found`, HttpStatus.NOT_FOUND);
    }
    await this.vehicleRepository.update({ id, userId }, payload);
  }

  public async deleteVehicle(id: string): Promise<void> {
    await this.vehicleRepository.update(id, { deletedAt: new Date() });
  }
}

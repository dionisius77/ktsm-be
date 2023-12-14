import { Gate } from "@app/entities/gate.entity";
import { Parking } from "@app/entities/operating-area.entity";
import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateParkingDto, UpdateParkingDto } from "./parking.dto";
import { AuthServiceClient } from "@app/entities";
import { ClientGrpc } from "@nestjs/microservices";

@Injectable()
export class SuperAdminParkingService {
  @InjectRepository(Parking)
  private readonly parkingRepository: Repository<Parking>;
  @InjectRepository(Gate)
  private readonly gateRepository: Repository<Gate>;

  private authService: AuthServiceClient;

  onModuleInit() {
    this.authService = this.client.getService<AuthServiceClient>("AuthService");
  }

  constructor(@Inject("AUTH_PACKAGE") private client: ClientGrpc) {}

  public async createParkingAndAdmin(payload: CreateParkingDto): Promise<void> {
    const {
      name,
      needPayment,
      adminEmail,
      adminUsername,
      lat,
      lng,
      address,
      capacity,
    } = payload;
    const parking = new Parking();
    parking.name = name;
    parking.needPayment = needPayment;
    parking.lat = lat;
    parking.lng = lng;
    parking.address = address;
    parking.capacity = capacity;
    parking.createdAt = new Date();
    const saved = await this.parkingRepository.save(parking);
    if (saved) {
      const admin = await this.authService
        .createAdmin({
          email: adminEmail,
          username: adminUsername,
          parkingId: saved.id,
        })
        .toPromise();
      if (!admin) {
        throw new HttpException(
          "Failed create user admin",
          HttpStatus.CONFLICT,
        );
      }
    }
  }

  public async updateParking(
    id: string,
    payload: UpdateParkingDto,
  ): Promise<void> {
    const parking: Parking = await this.parkingRepository.findOne({
      where: { id },
    });
    if (!parking) {
      throw new HttpException("Invalid parking id", HttpStatus.BAD_REQUEST);
    }
    await this.parkingRepository.update(
      { id },
      {
        ...payload,
      },
    );
  }

  public async getParkingDetail(id: string): Promise<Parking | never> {
    const parking: Parking = await this.parkingRepository.findOne({
      where: { id },
    });
    if (!parking) {
      throw new HttpException("Parking Place Not Found", HttpStatus.NOT_FOUND);
    }
    return parking;
  }

  public async getParkingList(): Promise<Parking[] | never> {
    const parking: Parking[] = await this.parkingRepository.find();
    return parking;
  }
}

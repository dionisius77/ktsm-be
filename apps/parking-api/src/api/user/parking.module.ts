import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserParkingController } from "./parking.controller";
import { UserVehicleService } from "./vehicle.service";
import { MailModule, UserAuthHelper, UserJwtStrategy } from "@app/helpers";
import { Gate, Parking, ParkingLogs, Vehicle } from "@app/entities";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { UserParkingService } from "./parking.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Parking, Gate, Vehicle, ParkingLogs]),
    PassportModule.register({
      defaultStrategy: "user",
      property: "user",
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get("JWT_KEY_OPS_AREA"),
        signOptions: { expiresIn: config.get("JWT_EXPIRES") },
      }),
    }),
    ClientsModule.registerAsync([
      {
        inject: [ConfigService],
        name: "AUTH_PACKAGE",
        useFactory: (config: ConfigService) => {
          return {
            transport: Transport.GRPC,
            options: {
              package: "auth",
              protoPath: "contract/auth-api.proto",
              // url: `0.0.0.0:21000`,
              url: config.get<string>("AUTH_SERVICE"),
            },
          };
        },
      },
    ]),
    MailModule,
  ],
  controllers: [UserParkingController],
  providers: [
    UserVehicleService,
    UserParkingService,
    UserJwtStrategy,
    UserAuthHelper,
  ],
})
export class UserParkingModule {}

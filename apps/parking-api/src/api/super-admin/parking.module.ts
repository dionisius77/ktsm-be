import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SuperAdminParkingController } from "./parking.controller";
import { SuperAdminParkingService } from "./parking.service";
import {
  MailModule,
  SuperAdminAuthHelper,
  SuperAdminJwtStrategy,
} from "@app/helpers";
import { Gate, Parking } from "@app/entities";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { SuperAdminGateService } from "./gate.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Parking, Gate]),
    PassportModule.register({
      defaultStrategy: "superadmin",
      property: "superadmin",
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
  controllers: [SuperAdminParkingController],
  providers: [
    SuperAdminParkingService,
    SuperAdminGateService,
    SuperAdminJwtStrategy,
    SuperAdminAuthHelper,
  ],
})
export class SuperAdminParkingModule {}

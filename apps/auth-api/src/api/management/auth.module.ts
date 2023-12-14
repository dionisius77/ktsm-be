import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Branch, Management, OperatingArea } from "@app/entities";
import { ManagementAuthController } from "./auth.controller";
import { ManagementAuthService } from "./auth.service";
import { ConfigService } from "@nestjs/config";
import {
  ManagementAuthHelper,
  ManagementJwtStrategy,
  MailModule,
} from "@app/helpers";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { AuthRedisService } from "../redis.service";

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: "management",
      property: "management",
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get("JWT_KEY_MANAGEMENT"),
        signOptions: { expiresIn: config.get("JWT_EXPIRES") },
      }),
    }),
    TypeOrmModule.forFeature([Management, OperatingArea, Branch]),
    MailModule,
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
  ],
  controllers: [ManagementAuthController],
  providers: [
    ManagementAuthService,
    ManagementAuthHelper,
    ManagementJwtStrategy,
    AuthRedisService,
  ],
})
export class ManagementAuthModule {}

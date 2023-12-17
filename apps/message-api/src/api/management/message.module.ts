import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ManagementMessageController } from "./message.controller";
import { ManagementMessageService } from "./message.service";
import {
  MailModule,
  ManagementAuthHelper,
  ManagementJwtStrategy,
} from "@app/helpers";
import { Branch, Message, MessageLogs, OperatingArea } from "@app/entities";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, MessageLogs, Branch, OperatingArea]),
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
  controllers: [ManagementMessageController],
  providers: [
    ManagementMessageService,
    ManagementJwtStrategy,
    ManagementAuthHelper,
  ],
})
export class ManagementMessageModule {}

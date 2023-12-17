import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Branch, MessageLogs, OperatingArea } from "@app/entities";
import { BranchMessageController } from "./message.controller";
import { BranchMessageService } from "./message.service";
import { ConfigService } from "@nestjs/config";
import { BranchAuthHelper, BranchJwtStrategy, MailModule } from "@app/helpers";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "branch", property: "branch" }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get("JWT_KEY_BRANCH"),
        signOptions: { expiresIn: config.get("JWT_EXPIRES") },
      }),
    }),
    TypeOrmModule.forFeature([MessageLogs]),
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
  controllers: [BranchMessageController],
  providers: [
    BranchMessageService,
    BranchAuthHelper,
    BranchJwtStrategy,
  ],
})
export class BranchMessageModule {}

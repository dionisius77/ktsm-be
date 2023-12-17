import { Module } from "@nestjs/common";
import { SocketGateway } from "./socket.gateway";
import { SocketService } from "./socket.service";
import { BranchAuthService } from "../branch/auth.service";
import { AuthRedisService } from "../redis.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Branch, OperatingArea } from "@app/entities";
import { BranchAuthHelper, MailModule } from "@app/helpers";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";

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
    TypeOrmModule.forFeature([Branch, OperatingArea]),
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
  providers: [
    SocketGateway,
    SocketService,
    BranchAuthService,
    BranchAuthHelper,
    AuthRedisService,
  ],
})
export class SocketModule {}

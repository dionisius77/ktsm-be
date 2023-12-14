import { Injectable, Inject } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Management } from "@app/entities";
import { ManagementAuthHelper } from "./auth.helper";

@Injectable()
export class ManagementJwtStrategy extends PassportStrategy(Strategy, "management") {
  @Inject(ManagementAuthHelper)
  private readonly helper: ManagementAuthHelper;

  constructor(@Inject(ConfigService) config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get("JWT_KEY_MANAGEMENT"),
      ignoreExpiration: true,
    });
  }

  public validate(payload: string): Promise<Management | never> {
    return this.helper.validateUser(payload);
  }
}

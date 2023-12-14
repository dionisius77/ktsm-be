import { Injectable, Inject } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Branch } from "@app/entities";
import { BranchAuthHelper } from "./auth.helper";

@Injectable()
export class BranchJwtStrategy extends PassportStrategy(Strategy, "branch") {
  @Inject(BranchAuthHelper)
  private readonly helper: BranchAuthHelper;

  constructor(@Inject(ConfigService) config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get("JWT_KEY_BRANCH"),
      ignoreExpiration: true,
    });
  }

  public validate(payload: string): Promise<Branch | never> {
    return this.helper.validateBranch(payload);
  }
}

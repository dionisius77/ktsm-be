import { Injectable, ExecutionContext } from "@nestjs/common";
import { AuthGuard as Guard, IAuthGuard } from "@nestjs/passport";
import { Branch } from "@app/entities";

@Injectable()
export class JwtAuthGuardBranch extends Guard("branch") implements IAuthGuard {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public handleRequest(err: unknown, user: Branch): any {
    return user;
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return user ? true : false;
  }
}

import { Injectable, ExecutionContext } from "@nestjs/common";
import { AuthGuard as Guard, IAuthGuard } from "@nestjs/passport";
import { Management } from "@app/entities";

@Injectable()
export class JwtAuthGuardUser extends Guard("user") implements IAuthGuard {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public handleRequest(err: unknown, user: Management): any {
    return user;
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return user ? true : false;
  }
}

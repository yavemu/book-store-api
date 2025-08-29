import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserRole } from "../../modules/users/enums/user-role.enum";
import { ERROR_MESSAGES } from "../constants/error-messages";

const ROLES_KEY = "roles";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new ForbiddenException(ERROR_MESSAGES.AUTH.USER_NOT_FOUND);
    }

    const hasRole = requiredRoles.includes(user.role.name);

    if (hasRole) {
      console.log("✅ Usuario autorizado con rol:", user.role.name);
    } else {
      console.log("❌ Usuario NO autorizado con rol:", requiredRoles, user.role.name);
      throw new ForbiddenException(ERROR_MESSAGES.AUTH.FORBIDDEN);
    }

    return hasRole;
  }
}

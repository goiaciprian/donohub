import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { PERMISSION_METADATA_KEY } from '../Decorators/checkPermissoon.decorator';
import { UserType } from '@/Auth/clerk.strategy';
import { PermissionsType } from '@donohub/shared';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    if (!request.user) {
      return false;
    }

    const permissions = this.reflector.get<PermissionsType[]>(
      PERMISSION_METADATA_KEY,
      context.getHandler(),
    );

    // if we don't have any specific permission then no need to check
    if (!permissions.length) {
      return true;
    }

    const user = request.user as UserType;

    return permissions.every((permission) =>
      user.publicMetadata.permissions.includes(permission),
    );
  }
}

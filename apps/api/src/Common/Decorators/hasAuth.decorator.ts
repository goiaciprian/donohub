import { applyDecorators, UseGuards } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { ClerkAuthGuard } from "../Guards/auth.guard";
import { PermissionGuard } from "../Guards/permission.guard";
import { CheckPermission } from "./checkPermissoon.decorator";

export const HasAuth = (...permissions: string[]) => applyDecorators(
  UseGuards(ClerkAuthGuard, PermissionGuard),
  ApiBearerAuth(),
  CheckPermission(...permissions)
)
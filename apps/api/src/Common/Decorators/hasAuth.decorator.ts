import { applyDecorators, UseGuards } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { ClerkAuthGuard } from "../Guards/auth.guard";

export const HasAuth = () => applyDecorators(
  UseGuards(ClerkAuthGuard),
  ApiBearerAuth()
)
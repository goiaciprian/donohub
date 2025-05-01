import { PermissionsType } from '@donohub/shared';
import { SetMetadata } from '@nestjs/common';

export const PERMISSION_METADATA_KEY = 'permissons';

export const CheckPermission = (...permissons: PermissionsType[]) =>
  SetMetadata(PERMISSION_METADATA_KEY, permissons);

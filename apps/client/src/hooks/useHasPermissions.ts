import { useUser } from '@clerk/clerk-react';
import { PermissionsType } from '@donohub/shared';
import React from 'react';

export type PublicMetadata = {
  permissions?: PermissionsType[];
};

export const useHasPermissions = () => {
  const userStatus = useUser();

  const hasPermissionsCb = React.useCallback(() => {
    const { isLoaded, isSignedIn, user } = userStatus;
    if (!isLoaded || !isSignedIn) {
      return {
        isLoggedIn: false,
        hasPermissions: false,
        permissions: [] as PermissionsType[],
      };
    }

    const rawPermissions = (user.publicMetadata as PublicMetadata).permissions;
    const permissions = rawPermissions ?? [];

    return {
      isLoggedIn: isSignedIn,
      hasPermissions: permissions.length !== 0,
      permissions: permissions,
    };
  }, [userStatus]);

  return hasPermissionsCb();
};

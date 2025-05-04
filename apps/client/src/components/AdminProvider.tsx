import { useHasPermissions } from '@/hooks/useHasPermissions';
import { PermissionsType } from '@donohub/shared';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface AdminProviderProps {
  permission?: PermissionsType;
  children: React.ReactNode | React.ReactNode[];
}

export const AdminProvider = ({ permission, children }: AdminProviderProps) => {
  const { permissions, isLoggedIn } = useHasPermissions();
  const { lang } = useParams();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isLoggedIn || (permission && !permissions.includes(permission))) {
      navigate(`/${lang}`, { viewTransition: true });
    }
  }, [permissions, isLoggedIn, permission, navigate, lang]);

  return children;
};

import { ClerkLoaded, useUser } from '@clerk/clerk-react';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface ProtectProps {
  children: React.ReactNode | React.ReactNode[];
}

export const Protect = ({ children }: ProtectProps) => {
  const { lang } = useParams();
  const navigate = useNavigate();
  const { isSignedIn, isLoaded } = useUser();

  React.useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate(`/${lang}`, { viewTransition: true });
    }
  }, [isSignedIn, navigate, isLoaded, lang]);

  return <ClerkLoaded>{children}</ClerkLoaded>;
};

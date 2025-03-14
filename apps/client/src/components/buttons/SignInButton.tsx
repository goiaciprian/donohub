import { useTranslation } from 'react-i18next';
import { SignInButton as ClerkSignInButton } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';

export const SignInButton = () => {
  const { t } = useTranslation();

  return (
    <ClerkSignInButton mode="modal">
      <Button
        className="font-bold text-xl hover:underline px-5"
        variant={'ghost'}
      >
        {t('internal.signInButton')}
      </Button>
    </ClerkSignInButton>
  );
};

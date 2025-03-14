import { useTranslation } from 'react-i18next';
import { Button } from './Button';
import { SignInButton as ClerkSignInButton } from '@clerk/clerk-react';

export const SignInButton = () => {
    const { t } = useTranslation();

    return (
    <ClerkSignInButton mode="modal">
      <Button
        display={t('internal.signInButton')}
        className="font-bold text-xl hover:underline px-5"
      ></Button>
    </ClerkSignInButton>
  );
};

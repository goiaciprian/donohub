import { useTranslation } from 'react-i18next';
import { Button } from './Button';
import { SignUpButton as ClerkSignUpButton } from '@clerk/clerk-react';

export const SignUpButton = () => {
  const { t } = useTranslation();
  return (
    <ClerkSignUpButton mode="modal">
      <Button
        display={t('internal.signUpButton')}
        className="font-bold text-xl hover:underline px-5"
      ></Button>
    </ClerkSignUpButton>
  );
};

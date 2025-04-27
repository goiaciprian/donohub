import { useTranslation } from 'react-i18next';
import { SignUpButton as ClerkSignUpButton } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';

export const SignUpButton = ({ className = '' }: { className?: string }) => {
  const { t } = useTranslation();
  return (
    <ClerkSignUpButton mode="modal">
      <Button
        className={'font-bold text-xl hover:underline px-5 ' + className}
        variant={'link'}
      >
        {t('internal.signUpButton')}
      </Button>
    </ClerkSignUpButton>
  );
};

import { useTranslation } from 'react-i18next';
import { getErrorMessage } from '@/utils';
import React from 'react';

export const ErrorPage = ({ status }: { status: number }) => {
  const { t } = useTranslation();
  const message = getErrorMessage(status, t);

  React.useEffect(() => {
    document.title = t('appTitle.error');
  }, [t]);

  return (
    <div className="flex items-center justify-center min-h-max my-[15%] select-none">
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-5xl font-bold">{status}</h1>
        <h2 className="text-3xl font-semibold">{message}</h2>
      </div>
    </div>
  );
};

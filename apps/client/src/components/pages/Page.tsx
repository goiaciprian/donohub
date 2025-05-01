import React from 'react';
import { Spinner } from '../spinner/Spinner';

interface PageProps {
  staticFirst?: React.ReactNode;
  staticSecond?: React.ReactNode;
  dynamicComponent?: React.ReactNode;
  className?: string;
}

export const Page = ({
  staticFirst,
  staticSecond,
  dynamicComponent,
  className = '',
}: PageProps) => {
  const spinnerContainer = () => {
    return (
      <div className="w-full p-20">
        <div className="ml-auto mr-auto w-[100px]">
          <Spinner size={80} />
        </div>
      </div>
    );
  };

  return (
    <main className={'h-full ' + className}>
      {staticFirst}
      <React.Suspense fallback={spinnerContainer()}>
        {dynamicComponent}
      </React.Suspense>
      {staticSecond}
    </main>
  );
};

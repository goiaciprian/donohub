import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { SignUpButton } from '@/components/buttons/SignUpButton';
import { SignInButton } from '@/components/buttons/SignInButton';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const Navigation = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation().pathname;
  return (
    <nav className="w-full">
      <div className=" flex w-full py-5 px-7 justify-end items-center bg-gray-800 text-white flex-row">
        <div className="mr-auto">
          <h1
            onClick={() => navigate('', { viewTransition: true })}
            className="text-3xl font-bold cursor-pointer select-none"
          >
            DonoHUB
          </h1>
        </div>
        {location !== '/en' && location !== '/ro' && (
          <SignedOut>
            <div>
              <SignInButton className="text-white" />
              <SignUpButton className="text-white" />
            </div>
          </SignedOut>
        )}
        <SignedIn>
          <div className="flex flex-row gap-5 items-center">
            <NavLink
              to={'donations'}
              className={'font-bold hover:underline'}
              viewTransition
            >
              {t('navigation.donations')}
            </NavLink>
            <NavLink
              to={'donor'}
              className={'font-bold hover:underline'}
              viewTransition
            >
              {t('navigation.create')}
            </NavLink>
            <UserButton
              showName
              appearance={{
                elements: {
                  userButtonOuterIdentifier: {
                    fontSize: 15,
                  },
                  userButtonAvatarBox: {
                    width: 40,
                    height: 40,
                  },
                },
              }}
            />
          </div>
        </SignedIn>
      </div>
    </nav>
  );
};

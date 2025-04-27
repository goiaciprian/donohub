import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { SignUpButton } from '@/components/buttons/SignUpButton';
import { SignInButton } from '@/components/buttons/SignInButton';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

export const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation().pathname;
  return (
    <nav className="w-full">
      <div className=" flex w-full py-5 px-7 justify-end items-center bg-gray-800 text-white flex-row">
        <div className="mr-auto">
          <h1
            onClick={() => navigate('')}
            className="text-3xl font-bold cursor-pointer select-none"
          >
            DonoHUB
          </h1>
        </div>
        {location !== '/en' && location !== '/ro' && (
          <SignedOut>
            <div>
              <SignInButton />
              <SignUpButton />
            </div>
          </SignedOut>
        )}
        <SignedIn>
          <div className="flex flex-row gap-5 items-center">
            <NavLink
              to={'donor'}
              className={'font-bold hover:underline'}
              viewTransition
            >
              Donor
            </NavLink>
            <NavLink
              to={'donations'}
              className={'font-bold hover:underline'}
              viewTransition
            >
              Donations
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

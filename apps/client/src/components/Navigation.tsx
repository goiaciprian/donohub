import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { SignUpButton } from '@/components/buttons/SignUpButton';
import { SignInButton } from '@/components/buttons/SignInButton';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSidebar } from './ui/sidebar';
import { Button } from './ui/button';
import {
  Layers,
  MessagesSquare,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { useHasPermissions } from '@/hooks/useHasPermissions';

export const Navigation = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toggleSidebar, open, isMobile } = useSidebar();
  const { hasPermissions } = useHasPermissions();
  const { lang } = useParams();

  return (
    <>
      <header className="pt-7 px-7 mr-auto bg-gray-800 text-white w-full">
        <h1
          onClick={() => navigate('', { viewTransition: true })}
          className="text-3xl font-bold cursor-pointer select-none"
        >
          DonoHUB
        </h1>
      </header>
      <nav className="w-full select-none sticky top-0 z-10">
        <div className="flex w-full h-max py-4 px-5 justify-end items-center bg-gray-800 text-white flex-row">
          <div className="mr-auto">
            {hasPermissions && !isMobile && (
              <Button
                size={'icon'}
                variant="ghost"
                onClick={toggleSidebar}
                className="text-lg"
              >
                {open ? <PanelLeftClose /> : <PanelLeftOpen />}
              </Button>
            )}
          </div>

          <div className="flex flex-row gap-5 items-center">
            <NavLink
              to={'donations'}
              className={'text-sm md:text-md font-bold hover:underline'}
              viewTransition
            >
              {t('navigation.donations')}
            </NavLink>
            <SignedIn>
              <NavLink
                to={'donor'}
                className={'text-sm md:text-md font-bold hover:underline'}
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
                      fontWeight: 'bold',
                    },
                    userButtonAvatarBox: {
                      width: 30,
                      height: 30,
                    },
                  },
                }}
              >
                <UserButton.MenuItems>
                  <UserButton.Action
                    label={'Donations'}
                    labelIcon={<Layers size={14} color="#c4c4c5" />}
                    onClick={() =>
                      navigate(`/${lang}/user/donations`, {
                        viewTransition: true,
                      })
                    }
                  />
                </UserButton.MenuItems>
                <UserButton.MenuItems>
                  <UserButton.Action
                    label={'Comments'}
                    labelIcon={<MessagesSquare size={14} color="#c4c4c5" />}
                    onClick={() =>
                      navigate(`/${lang}/user/comments`, {
                        viewTransition: true,
                      })
                    }
                  />
                </UserButton.MenuItems>

                <UserButton.MenuItems>
                  <UserButton.Action label={'manageAccount'} />
                </UserButton.MenuItems>
              </UserButton>
            </SignedIn>
            <SignedOut>
              <div>
                <SignInButton className="text-white text-sm md:text-md cursor-pointer" />
                <SignUpButton className="text-white text-sm md:text-md cursor-pointer" />
              </div>
            </SignedOut>
          </div>
        </div>
      </nav>
    </>
  );
};

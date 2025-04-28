import { useAuth, useUser } from '@clerk/clerk-react';
import { usePostHog } from 'posthog-js/react';
import React from 'react';
import { useLocation } from 'react-router-dom';

export const PostHogPageView = (): null => {
  const location = useLocation();
  const posthog = usePostHog();

  const user = useUser();
  const { isSignedIn, userId } = useAuth();

  React.useEffect(() => {
    if (posthog) {
      posthog.capture('$pageview', {
        $current_url: window.location.href,
      });
    }
  }, [location, posthog]);

  React.useEffect(() => {
    if (isSignedIn && userId && user && !posthog._isIdentified()) {
      posthog.identify(userId, {
        email: user.user?.primaryEmailAddress?.emailAddress,
        username: user.user?.username,
      });
    }

    if (!isSignedIn && posthog._isIdentified()) {
      posthog.reset();
    }
  }, [posthog, user, isSignedIn, userId]);

  return null;
};

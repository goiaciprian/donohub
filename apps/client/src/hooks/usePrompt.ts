import { useCallback, useEffect, useState } from 'react';
import { Location, useBlocker, useNavigate } from 'react-router-dom';

export const usePrompt = (
  when: () => boolean,
): [boolean, () => void, () => void] => {
  const navigate = useNavigate();
  const [lastLocation, setLastLocation] = useState<Location | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [confirmedNavigation, setConfirmedNavigation] = useState(false);

  const cancelNavigation = useCallback(() => {
    setShowPrompt(false);
  }, []);

  const handleBlockedNavigation = useCallback(
    (currentLocation: Location, nextLocation: Location) => {
      if (
        !confirmedNavigation &&
        nextLocation.pathname !== currentLocation.pathname &&
        when()
      ) {
        setShowPrompt(true);
        setLastLocation(nextLocation);
        return true;
      }

      return false;
    },
    [confirmedNavigation, when],
  );

  const confirmNavigation = useCallback(() => {
    setShowPrompt(false);
    setConfirmedNavigation(true);
  }, []);

  useEffect(() => {
    if (confirmedNavigation && lastLocation) {
      navigate(lastLocation.pathname, { viewTransition: true });
    }
  }, [confirmedNavigation, navigate, lastLocation]);

  useBlocker((n) => handleBlockedNavigation(n.currentLocation, n.nextLocation));

  return [showPrompt, confirmNavigation, cancelNavigation];
};

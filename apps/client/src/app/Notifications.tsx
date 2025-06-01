import { Button } from '@/components/ui/button';
import { useAuthRequest } from '@/hooks/useAuthRequest';
import { urlBase64ToUint8Array } from '@/lib/utils';
import { subscribeRequest } from '@/support';
import { useUser } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export function PushNotificationManager() {
  const { t } = useTranslation();
  const { isLoaded, isSignedIn } = useUser();

  const alreadyRequested =
    localStorage.getItem('notificationsRequest') === 'never';

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  const subscribeRequestFn = useAuthRequest(subscribeRequest);

  useEffect(() => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      setIsSupported(false);
      return;
    }

    checkSubscription();
  }, []);

  const checkSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const existingSubscription =
        await registration.pushManager.getSubscription();

      if (existingSubscription) {
        setIsSubscribed(true);
      }
    } catch (error) {
      console.error('Eroare la verificarea abonamentului:', error);
    }
  };

  const subscribe = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        return;
      }

      const registration = await navigator.serviceWorker.ready;

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          import.meta.env.VITE_VAPID_PUBLIC_KEY,
        ),
      });

      await subscribeRequestFn({ body: JSON.stringify(subscription) });
      localStorage.setItem('notificationsRequest', 'approved');
      setIsSubscribed(true);
    } catch (error) {
      console.error('Eroare la abonare:', error);
    }
  };

  const setNeverShow = () => {
    localStorage.setItem('notificationsRequest', 'never');
  };

  if (
    !isSupported ||
    isSubscribed ||
    !isLoaded ||
    !isSignedIn ||
    alreadyRequested
  ) {
    return null;
  }

  return (
    <div className="md:flex items-center text-white px-6 py-2 bg-clerk-page">
      <div className="flex-1 ">
        <p className="font-semibold text-sm text-center md:text-left ">
          {t('subscription.message')}
        </p>
      </div>
      <div className="flex flex-wrap justify-center py-3 md:py-0 md:justify-end gap-4">
        <Button
          variant="secondary"
          onClick={setNeverShow}
          className="cursor-pointer"
        >
          {t('subscription.dontAsk')}
        </Button>
        <Button onClick={subscribe} className="cursor-pointer">
          {t('subscription.subscribe')}
        </Button>
      </div>
    </div>
  );
}

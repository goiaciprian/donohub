import { useEffect, useState } from 'react';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { useAuthRequest } from '@/hooks/useAuthRequest';
import { subscribeRequest, unsubscribeRequest } from '@/support';
import { urlBase64ToUint8Array } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import { Spinner } from '../spinner/Spinner';

export const NotificationsProfile = () => {
  const [loading, setLoading] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null,
  );

  const unsubscribeRequestFn = useAuthRequest(unsubscribeRequest);
  const subscribeRequestFn = useAuthRequest(subscribeRequest);

  const unsubscribeMutation = useMutation({ mutationFn: unsubscribeRequestFn });
  const subscribeMutation = useMutation({
    mutationFn: subscribeRequestFn,
    onSuccess: () => setLoading(false),
  });

  const subscribe = async () => {
    try {
      setLoading(true);
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

      subscribeMutation.mutate({
        body: JSON.stringify(subscription),
      });

      setSubscription(subscription);
    } catch (error) {
      console.error('Eroare la abonare:', error);
    }
  };

  const unsubscribe = async () => {
    try {
      if (subscription) {
        unsubscribeMutation.mutate({});
        await subscription.unsubscribe();
        setSubscription(null);
      }
    } catch (error) {
      console.error('Eroare la dezabonare:', error);
    }
  };

  useEffect(() => {
    const checkSubscription = async () => {
      const register = await navigator.serviceWorker.ready;
      const subscription = await register.pushManager.getSubscription();
      if (subscription) {
        setSubscription(subscription);
      }
    };
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      return;
    }

    checkSubscription();
  }, []);

  const isSubscribed = subscription !== null;
  const isLoading =
    subscribeMutation.isPending || unsubscribeMutation.isPending || loading;

  return (
    <div className="cl-profilePage cl-profilePage__security 🔒️ cl-internal-1ugvctd">
      <div className="cl-header 🔒️ cl-internal-qo3qk7">
        <div className="cl-internal-1pr5xvn">
          <h2 className="cl-headerTitle 🔒️ cl-internal-10mwlbn">
            Notifications
          </h2>
        </div>
        <div className="grid grid-cols-2">
          <Label className="mb-2">
            Allow notifications
            {isLoading && (
              <span className="align-middle">
                <Spinner size={12} />
              </span>
            )}
          </Label>
          <Switch
            disabled={isLoading}
            className="dark cursor-pointer data-[state=unchecked]:bg-clerk-page"
            checked={isSubscribed}
            onCheckedChange={isSubscribed ? unsubscribe : subscribe}
          />
        </div>
      </div>
    </div>
  );
};

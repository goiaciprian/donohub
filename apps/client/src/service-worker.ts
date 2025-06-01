/// <reference lib="webworker" />

// Default type of `self` is `WorkerGlobalScope & typeof globalThis`
// https://github.com/microsoft/TypeScript/issues/14877
// eslint-disable-next-line no-restricted-globals, @typescript-eslint/no-explicit-any
const t: ServiceWorkerGlobalScope = self as any as ServiceWorkerGlobalScope;

// @ts-expect-error for vite
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
t.__WB_MANIFEST;


t.addEventListener('install', () => {
  t.skipWaiting();
});

const handleUrl = (type: string, donationId?: string, requestId?: string) => {
  switch (type) {
    case 'comment':
      return `${t.location.origin}/en/donations/${donationId}`;
    case 'evaluation':
      return `${t.location.origin}/en/user/donations?t=myDonations&i=${donationId}`;
    case 'createRequest':
      return `${t.location.origin}/en/user/donations?t=donationRequests&i=${donationId}`;
    case 'requestResolved':
      return `${t.location.origin}/en/user/donations?t=userRequests&i=${requestId}`;

    default:
      return undefined;
  }
};

t.addEventListener('push', (event) => {
  if (!event.data) {
    return;
  }
  const { message, title, donationId, type, requestId } = event.data.json() as unknown as { message: string, title: string, donationId?: string, requestId?: string, type: string };

  t.registration.showNotification(title, {
    body: message,
    icon: './favicon.ico',
    data: {
      url: handleUrl(type, donationId, requestId),
    },
  });
});

t.addEventListener('notificationclick', (e) => {
  e.notification.close();
  // Get all the Window clients
  e.waitUntil(
    t.clients.matchAll({ type: 'window' }).then((clientsArr) => {
      // If a Window tab matching the targeted URL already exists, focus that;
      const hadWindowToFocus = clientsArr.some((windowClient) =>
        windowClient.url === e.notification.data.url
          ? (windowClient.focus(), true)
          : false,
      );
      // Otherwise, open a new tab to the applicable URL and focus it.
      if (!hadWindowToFocus)
        t.clients
          .openWindow(e.notification.data.url)
          .then((windowClient) => (windowClient ? windowClient.focus() : null));
    }),
  );
});
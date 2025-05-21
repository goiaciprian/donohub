/* eslint-disable no-restricted-globals */
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
self.__WB_MANIFEST;

/**
 * @typedef {Object} SETUP_PAYLOAD
 * @property {string} url
 * @property {string} userId
 *
 * @typedef {object} SSEObject
 * @property {string} message
 */

const PAYLOAD_TYPE = /** @type {const} */ (['SETUP', 'TERMINATE']);

/**
 * @type {EventSource | null}
 */
let eventSource = null;

/**
 * @param {SETUP_PAYLOAD} payload
 */
const handleSetup = ({ url, userId }) => {
  if (eventSource === null) {
    eventSource = new EventSource(`${url}/api/sse/${userId}`);
  }

  eventSource.onmessage = (event) => {
    const { message, title, donationId, type, requestId } = JSON.parse(event.data);
    if (message === 'ping') {
      return;
    }
    registration.showNotification(title, {
      body: message,
      icon: '/favicon.ico',
      data: {
        url: handleUrl(type, donationId, requestId)
      }
    });
  };
};

const handleTerminate = () => {
  if (eventSource != null) {
    eventSource?.close();
    eventSource = null;
  }
};

oninstall = () => {
  skipWaiting();
};

/**
 * 
 * @param {string} type 
 * @param {string} donationId
 * @param {string} requestId
 * @returns {string | null}
 */
const handleUrl = (type, donationId, requestId) => {
  switch(type) {
    case 'comment':
      return `${location.origin}/en/donations/${donationId}`
    case 'evaluation':
      return `${location.origin}/en/user/donations?t=myDonations&i=${donationId}`
    case 'createRequest':
      return `${location.origin}/en/user/donations?t=donationRequests&i=${requestId}`
    case 'requestResolved':
      return `${location.origin}/en/user/donations?t=userRequests&i=${requestId}`

    default:
      return null;
  }

}

onpush = (event) => {
  registration.showNotification('Notification', {
    body: event.data.text(),
    icon: './favicon.ico',
    data: {
      url: `${location.origin}/en/donations`,
    },
  });
};

onnotificationclick = (e) => {
  e.notification.close();
  // Get all the Window clients
  e.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientsArr) => {
      // If a Window tab matching the targeted URL already exists, focus that;
      const hadWindowToFocus = clientsArr.some((windowClient) =>
        windowClient.url === e.notification.data.url
          ? (windowClient.focus(), true)
          : false,
      );
      // Otherwise, open a new tab to the applicable URL and focus it.
      if (!hadWindowToFocus)
        clients
          .openWindow(e.notification.data.url)
          .then((windowClient) => (windowClient ? windowClient.focus() : null));
    }),
  );
};

/**
 *
 * @param {MessageEvent<SSEObject>} ev
 */
onmessage = (event) => {
  const { type, payload } = event.data;
  switch (type) {
    case PAYLOAD_TYPE[0]:
      handleSetup(payload);
      break;
    case PAYLOAD_TYPE[1]:
      handleTerminate();
      break;
    default:
      console.log(`unknow payload ${type}`);
  }
};

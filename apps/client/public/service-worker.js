// eslint-disable-next-line no-restricted-globals, @typescript-eslint/no-unused-expressions
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
    const { message, title } = JSON.parse(event.data);
    if (message === 'ping') {
      return;
    }
    registration.showNotification(title, {
      body: message,
      icon: '/favicon.ico',
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

onpush = (event) => {
  registration.showNotification('Notification', {
    body: event.data.text(),
    icon: './favicon.ico',
  });
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

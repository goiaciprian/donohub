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

  /**
   *
   * @param {MessageEvent<SSEObject>} ev
   */
  eventSource.onmessage = (ev) => {
    console.log(ev.data);
    const { message } = JSON.parse(ev.data);
    console.log(`worker`, message);
    if (message === 'ping') {
      return;
    }

    new Notification(message);
  };
};

const handleTerminate = () => {
  eventSource.close();
};

/**
 * @typedef {Object} PAYLOAD
 * @property {typeof PAYLOAD_TYPE[number]} type
 * @property {SETUP_PAYLOAD | null} payload - when type us terminat the setup is null
 *
 * @param {MessageEvent<PAYLOAD>} event MessageEvent
 */
onmessage = (event) => {
  const { payload, type } = event.data;
  console.log(event.data);
  switch (type) {
    case PAYLOAD_TYPE[0]:
      handleSetup(payload);
      break;
    case PAYLOAD_TYPE[1]:
      handleTerminate();
      break;
    default:
      console.warn('received unknow payload', event.data);
      return;
  }

  postMessage('OK');
};

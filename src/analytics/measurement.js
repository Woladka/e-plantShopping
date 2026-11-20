export const ALLOWED_EVENTS = Object.freeze(['view_item', 'add_to_cart', 'begin_checkout']);
const FIELDS = new Set(['event', 'event_id', 'item_id', 'value', 'currency']);

export function validateEvent(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new TypeError('Event must be a plain object');
  }
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== Object.prototype && prototype !== null) {
    throw new TypeError('Event must be a plain object');
  }
  const event = { ...value };
  for (const field of Reflect.ownKeys(event)) {
    if (!FIELDS.has(field)) throw new Error(`Disallowed field: ${String(field)}`);
  }
  if (!ALLOWED_EVENTS.includes(event.event)) throw new Error('Unsupported event');
  if (typeof event.event_id !== 'string' || !/^[a-zA-Z0-9_-]{8,64}$/.test(event.event_id)) {
    throw new Error('Invalid event_id');
  }
  if (typeof event.item_id !== 'string' || !/^[a-zA-Z0-9_-]{1,64}$/.test(event.item_id)) {
    throw new Error('Invalid item_id');
  }
  if (typeof event.value !== 'number' || !Number.isFinite(event.value) || event.value < 0) {
    throw new Error('Invalid value');
  }
  if (event.currency !== 'EUR') throw new Error('Currency must be EUR');
  return Object.freeze(event);
}

export function createTracker({ emit } = {}) {
  if (typeof emit !== 'function') throw new TypeError('emit callback is required');
  let consent = 'denied';
  const seen = new Set();
  return {
    get consent() { return consent; },
    setConsent(next) {
      if (next !== 'denied' && next !== 'granted') throw new Error('Invalid consent');
      consent = next;
    },
    track(raw) {
      if (consent !== 'granted') return { sent: false, reason: 'consent_denied' };
      const event = validateEvent(raw);
      if (seen.has(event.event_id)) return { sent: false, reason: 'duplicate_event' };
      emit(event);
      seen.add(event.event_id);
      return { sent: true };
    },
  };
}

export function makeEvent({ event, item_id, value }) {
  if (typeof globalThis.crypto?.randomUUID !== 'function') {
    throw new Error('Secure random event IDs require crypto.randomUUID');
  }
  return validateEvent({
    event,
    event_id: `evt_${globalThis.crypto.randomUUID().replaceAll('-', '')}`,
    item_id,
    value: Number(value),
    currency: 'EUR',
  });
}

export function dataLayerEmitter(event) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(event);
}

import test from 'node:test';
import assert from 'node:assert/strict';
import { createTracker, makeEvent, validateEvent, dataLayerEmitter } from '../src/analytics/measurement.js';

function sampleEvent(id = 'evt_abcdefgh') {
  return {
    event: 'add_to_cart',
    event_id: id,
    item_id: 'plant_monstera',
    value: 24.5,
    currency: 'EUR',
  };
}

test('tracking is off by default', () => {
  const events = [];
  const tracker = createTracker({ emit: (event) => events.push(event) });

  assert.deepEqual(tracker.track(sampleEvent()), { sent: false, reason: 'consent_denied' });
  assert.equal(events.length, 0);
});

test('one event is recorded after consent', () => {
  const events = [];
  const tracker = createTracker({ emit: (event) => events.push(event) });
  tracker.setConsent('granted');

  assert.equal(tracker.track(sampleEvent()).sent, true);
  assert.equal(tracker.track(sampleEvent()).reason, 'duplicate_event');
  assert.equal(events.length, 1);
});

test('turning off consent blocks later events', () => {
  const events = [];
  const tracker = createTracker({ emit: (event) => events.push(event) });
  tracker.setConsent('granted');
  tracker.track(sampleEvent());
  tracker.setConsent('denied');

  assert.equal(tracker.track(sampleEvent('evt_ijklmnop')).sent, false);
  assert.equal(events.length, 1);
});

test('unexpected fields and invalid values are rejected', () => {
  assert.throws(() => validateEvent({ ...sampleEvent(), email: 'private@example.com' }), /Disallowed/);
  const extraField = Symbol('extra');
  assert.throws(() => validateEvent({ ...sampleEvent(), [extraField]: 'extra' }), /Disallowed/);
  assert.throws(() => validateEvent({ ...sampleEvent(), event: 'purchase' }), /Unsupported/);
  assert.throws(() => validateEvent({ ...sampleEvent(), value: -2 }), /Invalid/);
});

test('consent and emitter configuration must be valid', () => {
  assert.throws(() => createTracker(), /emit/);
  const tracker = createTracker({ emit: () => {} });
  assert.throws(() => tracker.setConsent('maybe'), /Invalid consent/);
});

test('failed emission can be retried', () => {
  let calls = 0;
  const tracker = createTracker({
    emit: () => {
      calls += 1;
      if (calls === 1) throw new Error('emission failed');
    },
  });
  tracker.setConsent('granted');

  assert.throws(() => tracker.track(sampleEvent()), /emission failed/);
  assert.equal(tracker.track(sampleEvent()).sent, true);
});

test('new events have unique-looking IDs', () => {
  const event = makeEvent({ event: 'view_item', item_id: 'plant_monstera', value: 12.5 });
  assert.match(event.event_id, /^evt_[a-f0-9]{32}$/);
  assert.equal(event.currency, 'EUR');
});

test('dataLayer only queues events in memory', () => {
  const oldWindow = globalThis.window;
  globalThis.window = { dataLayer: [] };

  try {
    dataLayerEmitter(sampleEvent());
    assert.equal(globalThis.window.dataLayer.length, 1);
  } finally {
    if (oldWindow === undefined) delete globalThis.window;
    else globalThis.window = oldWindow;
  }
});

test('inherited fields cannot satisfy event validation', () => {
  assert.throws(() => validateEvent(Object.create(sampleEvent())), /plain object/);
});

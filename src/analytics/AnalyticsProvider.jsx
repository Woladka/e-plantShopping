import PropTypes from 'prop-types';
import { useState } from 'react';
import { AnalyticsContext } from './AnalyticsContext';
import { createTracker, dataLayerEmitter, makeEvent } from './measurement';
import './ConsentNotice.css';

export function AnalyticsProvider({ children }) {
  const [tracker] = useState(() => createTracker({ emit: dataLayerEmitter }));
  const [allowed, setAllowed] = useState(false);

  function setTracking(nextAllowed) {
    tracker.setConsent(nextAllowed ? 'granted' : 'denied');
    setAllowed(nextAllowed);
  }

  function record(event, itemId, value) {
    if (tracker.consent !== 'granted') return;
    try {
      tracker.track(makeEvent({ event, item_id: itemId, value }));
    } catch (error) {
      console.warn('Could not queue demo analytics event.', error);
    }
  }

  return (
    <AnalyticsContext.Provider value={{ record }}>
      {children}
      <aside className="mrl-consent" aria-label="Analytics consent">
        <div>
          <strong>Optional demo analytics</strong>
          <p role="status">
            {allowed
              ? 'Tracking is on. Events stay in this page.'
              : 'Tracking is off. You can allow it for this page.'}
          </p>
        </div>
        <button type="button" onClick={() => setTracking(!allowed)}>
          {allowed ? 'Turn off tracking' : 'Allow tracking'}
        </button>
      </aside>
    </AnalyticsContext.Provider>
  );
}

AnalyticsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

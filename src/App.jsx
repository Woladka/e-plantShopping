import { useState } from 'react';
import AboutUs from './AboutUs';
import ProductList from './ProductList';
import { AnalyticsProvider } from './analytics/AnalyticsProvider';
import './App.css';

export default function App() {
  const [showStore, setShowStore] = useState(false);

  return (
    <AnalyticsProvider>
      {showStore ? (
        <ProductList />
      ) : (
        <main className="mrl-landing">
          <section className="mrl-landing-content">
            <h1>Can we trust our tracking?</h1>
            <p>A demo plant shop for testing event tracking, consent and what happens when data goes missing.</p>
            <button type="button" onClick={() => setShowStore(true)}>Explore the demo store</button>
            <details className="mrl-about">
              <summary>About Paradise Nursery</summary>
              <AboutUs />
            </details>
          </section>
        </main>
      )}
    </AnalyticsProvider>
  );
}

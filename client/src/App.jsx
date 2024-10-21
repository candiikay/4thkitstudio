import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import Home from './pages/Home';
import Customizer from './pages/Customizer';
import Canvas from './canvas';

function ErrorFallback({ error }) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: 'red' }}>{error.message}</pre>
    </div>
  );
}

function App() {
  return (
    <main className="app transition-all ease-in">
      <Home />
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Canvas />
        <Customizer />
      </ErrorBoundary>
    </main>
  );
}

export default App;

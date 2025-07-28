import React from 'react';

export default function Hydrate({ client, children }) {
  // grab the internal object if it exists
  const internal = client && client._internal;

  // if there’s no internal, skip hydrate and render children
  if (!internal) {
    console.warn('Skipping hydration: no internal client available');
    return <>{children}</>;
  }

  // otherwise perform the hydrate call
  return internal.hydrate({ children });
}
import React from "react";
import ReactDOM from "react-dom/client";

const App = () => {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>🔥 HFV DApp UI Loaded</h1>
      <p>No wallet connection. This confirms UI is rendering properly.</p>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);

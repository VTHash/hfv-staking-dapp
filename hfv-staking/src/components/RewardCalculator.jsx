import React, { useState } from "react";

export default function RewardCalculator() {
  const [input, setInput] = useState("");

  const reward = () => {
    const staked = parseFloat(input);
    if (isNaN(staked)) return 0;
    return (staked * 0.4 * 17.38).toFixed(2);
  };

  return (
    <div className="bg-green-950 p-4 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-2">Reward Calculator</h2>
      <input
        type="number"
        className="w-full p-2 rounded text-black"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter staked HFV"
      />
      <p className="mt-2">
        Estimated Reward (after 21 days): <strong>{reward()}</strong> HFV
      </p>
    </div>
  );
}

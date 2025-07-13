export default function RewardCalculator() {
  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>Estimate Your HFV Rewards</h2>
      <iframe
        src="https://hfvprotocol.org/main.html"
        title="HFV Reward Calculator"
        style={{
          width: '100%',
          height: '700px',
          border: 'none',
          borderRadius: '12px',
          overflow: 'hidden'
        }}
      />
    </div>
  );
}
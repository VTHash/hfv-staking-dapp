export default function ClaimButton() {
  const handleClaim = () => {
    alert('Claim rewards triggered!');
    // call claim function on staking contract here
  };

  return (
    <button onClick={handleClaim}>Claim Rewards</button>
  );
}
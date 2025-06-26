import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import stakingAbi from "../contracts/HFVStaking.json";
import tokenAbi from "../contracts/HFVToken.json";

const stakingAddress = import.meta.env.VITE_HFV_STAKING;
const tokenAddress = import.meta.env.VITE_HFV_TOKEN;
const psfAddress = import.meta.env.VITE_HFV_PSF;
const mfAddress = import.meta.env.VITE_HFV_MF;

export default function AnalyticsDashboard() {
  const [psfBalance, setPsfBalance] = useState("0");
  const [mfBalance, setMfBalance] = useState("0");
  const [totalStaked, setTotalStaked] = useState("0");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const token = new ethers.Contract(tokenAddress, tokenAbi, provider);
        const staking = new ethers.Contract(stakingAddress, stakingAbi, provider);

        const psfBal = await token.balanceOf(psfAddress);
        const mfBal = await token.balanceOf(mfAddress);
        const staked = await staking.totalStaked();

        setPsfBalance(ethers.formatUnits(psfBal, 18));
        setMfBalance(ethers.formatUnits(mfBal, 18));
        setTotalStaked(ethers.formatUnits(staked, 18));
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-green-950 p-4 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-2">📊 HFV Staking Dashboard</h2>
      <p><strong>Total Staked:</strong> {totalStaked} HFV</p>
      <p><strong>PSF Balance:</strong> {psfBalance} HFV</p>
      <p><strong>MF Balance:</strong> {mfBalance} HFV</p>
    </div>
  );
}

import React, { useState } from 'react';
import { useAppKit } from 'reown/appkit/react';
import { useNavigate } from 'react-router-dom';

const LaunchDapp = () => {
  const { connect } = useAppKit();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    setLoading(true);
    try {
      await connect();
      navigate('/staking');
    } catch (error) {
      console.error("Connection failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex justify-center items-center">
      {loading && (
        <div className="absolute w-[180px] h-[60px] rounded-full bg-lime-400 blur-xl animate-ping z-0"></div>
      )}
      <button
        onClick={handleConnect}
        disabled={loading}
        className={`relative z-10 flex items-center justify-center px-6 py-3 text-black font-semibold rounded-full shadow-xl transition duration-300
          ${loading ? 'bg-lime-400 cursor-not-allowed' : 'bg-lime-500 hover:bg-lime-600'}`}
      >
        {loading ? (
          <>
            <span className="w-3 h-3 mr-2 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
            Connecting...
          </>
        ) : (
          'Launch DApp'
        )}
      </button>
    </div>
  );
};

export default LaunchDapp;
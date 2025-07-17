console.log("APP RENDERED");

import { createAppKit } from '@reown/appkit/react'; 
import { wagmiAdapter, networks } from './wagmiConfig'; 
import { WagmiProvider } from 'wagmi'; 
import { QueryClient, QueryClientProvider } 
from '@tanstack/react-query'; 
import StakingDashboard 
from './components/StakingDashboard'; 
import './index.css';

const metadata = { name: 'HFV Protocol', description: 'Staking Protocol',
   url: window.location.origin, icons: ['/icon.png'] };

const appKitModal = createAppKit({ adapters: [wagmiAdapter],
   networks, projectId: import.meta.env.VITE_PROJECT_ID, metadata });

function App() { const queryClient = new QueryClient();

return ( <WagmiProvider config={appKitModal.wagmiConfig}>
   <QueryClientProvider client={queryClient}> <appKitModal.ConnectButton />
    <div className="app-container"> <StakingDashboard />
     </div>
      </QueryClientProvider> </WagmiProvider> ); }

export default App;
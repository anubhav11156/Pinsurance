import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { store } from './app/store';
import { Provider } from 'react-redux';

import { createClient, configureChains, WagmiConfig } from 'wagmi'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { ConnectKitProvider } from 'connectkit';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { fantomTestnet} from 'wagmi/chains'



const { chains, provider} = configureChains(
  [fantomTestnet],
  [
    jsonRpcProvider({
      rpc: (chain) => ({
        http: `https://endpoints.omniatech.io/v1/fantom/testnet/public`,
      }),
    }),
  ],
)


const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'Pinsurnace',
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
  ],
  provider,
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <WagmiConfig client={client}>
      <Provider store={store}>
        <ConnectKitProvider>
          <App />
        </ConnectKitProvider>
      </Provider>
    </WagmiConfig>

  </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

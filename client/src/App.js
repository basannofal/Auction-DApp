import { useState, useEffect } from 'react';
import {  ethers } from 'ethers';
import AuctionAbi from './contracts/e_auction.sol/e_auction.json';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './component/HomePage';
import AuctionDetailsPage from './component/AuctionDetailsPage';
import CreateAuctionPage from './component/CreateAuctionPage';
import UserDashboard from './component/UserDashboard';
import TransactionConfirmationPage from './component/TransactionConfirmationPage';
import './App.css';
import Home from './component/Home';

function App() {
  
  
  const [account, setAccount] = useState("");
  const [auction, setAuction] = useState({
    provider: null,
    signer: null,
    contract: null,
  });
  
  
  // Load Smart Contract 
  useEffect(() => {
    const connectWallet = async () => {
      const contractAddress = '0x06f8de8fb6a65f5c9bee9632c14475c05fe5011e';
      try {
        const { ethereum } = window;
        if (ethereum) {
          await ethereum.request({ method: 'eth_requestAccounts' });

          window.ethereum.on('chainChanged', (chainId) => {
            window.location.reload();
          });

          window.ethereum.on('accountsChanged', () => {
            window.location.reload();
          });

          const provider = new ethers.BrowserProvider(ethereum);
          const signer = await provider.getSigner();
          const address = await signer.getAddress();
          setAccount(address);
          const contract = new ethers.Contract(contractAddress, AuctionAbi.abi, signer);
          setAuction({
            provider: provider,
            signer: signer,
            contract: contract,
          });
        } else {
          console.log('Please install MetaMask');
        }
      } catch (err) {
        console.log(err);
      }
    };
    connectWallet();
  }, []);


  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage account={account} contract={auction} />} />
        <Route path="/home" element={<Home account={account} contract={auction} />} />
        <Route path="/auction/:id" element={<AuctionDetailsPage account={account} contract={auction} />} />
        <Route path="/create-auction" element={<CreateAuctionPage account={account} contract={auction} />} />
        <Route path="/user-dashboard" element={<UserDashboard account={account} contract={auction} />} />
        <Route path="/confirm-transaction/:id" element={<TransactionConfirmationPage account={account} contract={auction} />} />
      </Routes>
    </Router>
  );
}

export default App;
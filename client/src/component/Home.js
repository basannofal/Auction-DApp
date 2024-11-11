import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const mockAuctionData = {
  id: 1,
  name: "Vintage Watch",
  description: "A beautiful vintage watch from the 1950s",
  highestBid: {
    amount: 250,
    bidder: "0x8765...4321"
  }
};

export default function TransactionConfirmationPage({account, contract}) {
  const navigate = useNavigate();
  const [auction, setAuction] = useState();
  const [isConfirming, setIsConfirming] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [error, setError] = useState('');
  setAuction(mockAuctionData);
  const handleConfirmTransaction = async () => {
    setIsConfirming(true);
    setError('');

    try {
      // Simulate API call or blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // If successful
      setIsConfirmed(true);
      setTimeout(() => {
        navigate('/user-dashboard');  // Redirect to dashboard after confirmation
      }, 3000);
    } catch (err) {
      setError('An error occurred while confirming the transaction. Please try again.');
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <div className="container">
      <h1 className="page-title">Confirm Transaction</h1>
      <div className="transaction-confirmation">
        <div className="confirmation-details">
          <h2>Auction Details</h2>
          <p>{auction.name}</p>
          <p className="description">{auction.description}</p>
        </div>
        <div className="confirmation-details">
          <h2>Highest Bid</h2>
          <p className="bid-info">${auction.highestBid.amount}</p>
          <p className="bidder-info">Bidder: {auction.highestBid.bidder}</p>
        </div>
        {error && <div className="error-message">{error}</div>}
        {isConfirmed ? (
          <div className="success-message">
            Transaction confirmed successfully! Redirecting to dashboard...
          </div>
        ) : (
          <div className="confirmation-actions">
            <button className="button secondary" onClick={() => navigate(-1)}>Cancel</button>
            <button 
              className="button" 
              onClick={handleConfirmTransaction} 
              disabled={isConfirming}
            >
              {isConfirming ? 'Confirming...' : 'Confirm and Transfer'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
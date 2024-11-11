import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const mockAuctionData = {
  id: 1,
  name: "Vintage Watch",
  description: "A beautiful vintage watch from the 1950s",
  highestBid: {
    amount: 250,
    bidder: "0x8765...4321"
  }
};

export default function TransactionConfirmationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [auction, setAuction] = useState(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // In a real application, fetch the auction details from an API
    setAuction(mockAuctionData);
  }, [id]);

  const handleConfirmTransaction = async () => {
    setIsConfirming(true);
    setError('');

    try {
      // Simulate API call or blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // If successful
      setSuccess('Transaction confirmed successfully!');
      setTimeout(() => {
        navigate('/user-dashboard');
      }, 3000);
    } catch (err) {
      setError('An error occurred while confirming the transaction. Please try again.');
    } finally {
      setIsConfirming(false);
    }
  };

  if (!auction) return <div>Loading...</div>;

  return (
    <div className="container mt-2">
      <h1>Confirm Transaction</h1>
      <div className="card">
        <h2>Auction Details</h2>
        <p>{auction.name}</p>
        <p>{auction.description}</p>
      </div>
      <div className="card">
        <h2>Highest Bid</h2>
        <p>${auction.highestBid.amount}</p>
        <p>Bidder: {auction.highestBid.bidder}</p>
      </div>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      {!success && (
        <div className="card-actions">
          <button className="button" onClick={() => navigate(-1)}>Cancel</button>
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
  );
}
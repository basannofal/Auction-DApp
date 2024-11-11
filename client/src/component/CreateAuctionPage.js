import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreateAuctionPage({ account, contract }) {
  const navigate = useNavigate();
  const [auctionContract, setAuctionContract] = useState(null);
  const [auctionData, setAuctionData] = useState({
    name: '',
    description: '',
    minBid: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAuctionData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!auctionData.name || !auctionData.description || !auctionData.minBid) {
      setError('Please fill in all fields');
      return;
    }

    if (isNaN(auctionData.minBid) || Number(auctionData.minBid) <= 0) {
      setError('Please enter a valid minimum bid amount');
      return;
    }

    try {
      const tx = await auctionContract?.createAuction(
        auctionData.name,
        auctionData.description,
        auctionData.minBid
      );
      setSuccess('Transaction Processing!');
      await tx.wait();
      setSuccess('Auction created successfully!');
    } catch (error) {
      setError('Error creating auction. Please try again.');
    }
    // In a real application, send the auction data to the smart contract
    console.log('Creating auction:', auctionData);
  };

  useEffect(() => {
    setAuctionContract(contract.contract);
  }, [contract]);

  return (
    <div className="container mt-2">
      <h1>Create New Auction</h1>
      <div className="card">
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Auction Name</label>
                               <input type="text" id="name" name="name" value={auctionData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={auctionData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="minBid">Minimum Bid ($)</label>
            <input
              type="number"
              id="minBid"
              name="minBid"
              value={auctionData.minBid}
              onChange={handleChange}
              min="1"
              required
            />
          </div>
          <button type="submit" className="button">
            Create Auction
          </button>
        </form>
      </div>
      {success && (
        <button className="button" onClick={() => navigate('/user-dashboard')}>
          Back To DashBoard
        </button>
      )}
    </div>
  );
}

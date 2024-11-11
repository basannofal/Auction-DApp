import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatUnits, getBigInt } from 'ethers';

export default function UserDashboard({ account, contract }) {
  const [activeTab, setActiveTab] = useState('auctions');
  const [userAuctions, setUserAuctions] = useState([]);
  const [userOffers, setUserOffers] = useState([]);
  const [auctionContract, setAuctionContract] = useState(null);

  const handleConfirmSale = async (auctionId) => {
    try {
      const tx = await auctionContract.closeAuction(auctionId);
      alert('Transaction Processing!');
      await tx.wait();
      alert('Sale confirmed successfully!');
    } catch (error) {
      alert('Error confirming sale. Please try again.');
      console.error('Error confirming sale:', error);
    }
  };

  const handleFinalizeTransaction = async (auctionId) => {
    try {
      const tx = await auctionContract.transaction(auctionId);
      alert('Transaction Processing!');
      await tx.wait();
      alert('Auction finalized successfully!');
    } catch (error) {
      alert('Error finalizing auction. Please try again.');
      console.error('Error finalizing auction:', error);
    }
  };

  useEffect(() => {
    setAuctionContract(contract.contract);
    const getUserAuctions = async () => {
      try {
        const auctions = await contract?.contract.getUserAuctions(account);
        setUserAuctions(auctions);
      } catch (error) {
        console.error('Error fetching auctions:', error);
      }
    };

    const getUserOffers = async () => {
      try {
        const auctionOffers = await contract?.contract.getUserOffers(account);
        setUserOffers(auctionOffers);
      } catch (error) {
        console.error('Error fetching auction:', error);
      }
    };

    getUserAuctions();
    getUserOffers();
  }, [contract, account]);

  return (
    <div className="container mt-2">
      <h1>My Dashboard</h1>
      <div className="tabs">
        <button className={`tab ${activeTab === 'auctions' ? 'active' : ''}`} onClick={() => setActiveTab('auctions')}>
          My Auctions
        </button>
        <button className={`tab ${activeTab === 'offers' ? 'active' : ''}`} onClick={() => setActiveTab('offers')}>
          My Offers
        </button>
      </div>
      <div className="tab-content">
        {activeTab === 'auctions' && (
          <div className="auction-list">
            {userAuctions.length > 0 ? (
              userAuctions.map((auction) => {
                let status = 'active';
                if (parseInt(auction.status) === parseInt(2)) {
                  status = 'highest';
                }
                if (parseInt(auction.status) === parseInt(3)) {
                  status = 'ended';
                }
                return (
                  <div key={auction.id} className="card">
                    <h2>{auction.name} </h2>
                    <p>Starting Bid: ${auction.min + ''}</p>
                    <p>
                      Current Best Offer:{' '}
                      {formatUnits(auction.bestOfferPrice ? getBigInt(auction.bestOfferPrice + '') : 0, 'gwei') + ''}
                    </p>
                    {parseInt(auction.status) === 3 && <p>Winner: {auction.winner}</p>}
                    <p className={`status ${status}`}>{status}</p>
                    <div className="card-actions-container">
                      <div className="card-actions">
                        <Link to={`/auction/${auction.id}`} className="button">
                          View Details
                        </Link>
                      </div>
                      {parseInt(auction.status) === parseInt(1) && (
                        <button className="secondary button" onClick={() => handleConfirmSale(auction.id)}>
                          Confirm Sale
                        </button>
                      )}
                      {parseInt(auction.status) === parseInt(2) && (
                        <button className="secondary button" onClick={() => handleFinalizeTransaction(auction.id)}>
                          Proceed to Transfer
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="card">
                <p>No auctions found.</p>
              </div>
            )}
          </div>
        )}
        {activeTab === 'offers' && (
          <div className="offer-list">
            {userOffers.length > 0 ? (
              userOffers.map((offer) => {
                const weiAmount = offer?.price ? getBigInt(offer.price + '') : null;
                return (
                  <div key={offer.id} className="card">
                    <h2>{offer.auctionName}</h2>
                    <p>Your Bid: ${weiAmount ? formatUnits(weiAmount, 'gwei') : 'N/A'}</p>
                    <p className={`status ${offer.status}`}>{offer.status}</p>

                    {offer.isWin === true && (
                      <p className={`status active`} style={{ marginBottom: '1rem', marginTop: '1rem' }}>
                        Winner
                      </p>
                    )}
                    <br />
                    <Link to={`/auction/${offer.id}`} className="button">
                      View Auction
                    </Link>
                  </div>
                );
              })
            ) : (
              <div className="card">
                <p>No offers found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

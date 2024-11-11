import { formatUnits, getBigInt } from 'ethers';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function HomePage({ account, contract }) {
  const [allAuctions, setAllAuctions] = useState([]);
  const [auctions, setAuctions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (term === '') {
      // Show all auctions if search term is cleared
      setAuctions(allAuctions);
    } else {
      const filteredAuctions = allAuctions.filter(
        (auction) => auction.name.toLowerCase().includes(term) || auction.seller.toLowerCase().includes(term)
      );
      setAuctions(filteredAuctions);
    }
  };

  useEffect(() => {
    const getAuctions = async () => {
      try {
        const auctions = await contract?.contract.getAuctions();
        setAllAuctions(auctions);
        setAuctions(auctions);
        console.log(auctions);
      } catch (error) {
        console.error('Error fetching auctions:', error);
      }
    };

    getAuctions();
  }, [contract]);

  return (
    <div>
      <header className="header">
        <div className="container header-content">
          <div className="logo">E-Auction Platform Decentralized Application</div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link to="/create-auction" className="button">
              Create Auction
            </Link>
            <Link to="/user-dashboard" className="button">
              My Dashboard
            </Link>
          </div>
        </div>
      </header>
      <main className="container mt-2">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search auctions by name or seller address"
            value={searchTerm}
            onChange={handleSearch}
            className="form-group input search"
          />
        </div>
        <div className="grid mt-2">
          {auctions.map((auction) => {
            let status = 'active';
            if (parseInt(auction.status) === parseInt(2)) {
              status = 'highest';
            }
            if (parseInt(auction.status) === parseInt(3)) {
              status = 'ended';
            }
            return (
              <div key={auction.id} className="card">
                <h2>{auction.name}</h2>
                <p>
                  {auction.description.length > 100
                    ? `${auction.description.substring(0, 100)}...`
                    : auction.description}
                </p>
                <p>Minimum Bid: ${auction.min + ''}</p>
                <p>
                  Current Best Offer:{' '}
                  {formatUnits(auction.bestOfferPrice ? getBigInt(auction.bestOfferPrice + '') : 0, 'gwei') + ''}
                </p>
                <p>Seller: {auction.seller.slice(0, 4) + '.....' + auction.seller.slice(-4)}</p>
                {parseInt(auction.status) === 3 && (
                  <p>Winner: {auction.winner.slice(0, 4) + '.....' + auction.winner.slice(-4)}</p>
                )}
                <p className={`status ${status}`} style={{ marginBottom: '1rem', marginTop: '1rem' }}>
                  {status}
                </p>{' '}
                <br />
                <Link to={`/auction/${auction.id}`} className="button">
                  View Auction
                </Link>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { parseUnits, formatUnits, getBigInt } from 'ethers';

export default function AuctionDetailsPage({ account, contract }) {
  const { id } = useParams();

  const [auction, setAuction] = useState(null);
  const [auctionOffers, setAuctionOffers] = useState([]);
  const [auctionContract, setAuctionContract] = useState(null);
  const [offerAmount, setOfferAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    setAuctionContract(contract.contract);
    // setAuction(mockAuction);

    const getAuctionDetails = async () => {
      try {
        const auction = await contract?.contract.getAuctions();
        setAuction(auction?.find((a) => parseInt(a.id) === parseInt(id)));
      } catch (error) {
        console.error('Error fetching auction:', error);
      }
    };

    const getOffers = async () => {
      try {
        const auctionOffers = await contract?.contract.getOffers();
        setAuctionOffers(
          auctionOffers?.filter((o) => {
            return parseInt(o.auctionId) === parseInt(id) && o;
          })
        );
      } catch (error) {
        console.error('Error fetching auction:', error);
      }
    };

    getAuctionDetails();
    getOffers();
  }, [contract, id]);

  const handleOffer = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!offerAmount || isNaN(offerAmount) || offerAmount <= auction.min) {
      setError('Please enter a valid amount');
      return;
    }

    const bestOfferAmountInGwei =
      auctionOffers.length > 0 && auction.bestOfferPrice
        ? getBigInt(auctionOffers[auctionOffers.length - 1].price + '')
        : null; // Fallback to null if price is undefined

    if (bestOfferAmountInGwei && Number(offerAmount) <= formatUnits(bestOfferAmountInGwei, 'gwei')) {
      setError('Your offer must be higher than the current best offer');
      return;
    }

    try {
      const amountInGwei = parseUnits(offerAmount, 'gwei');
      const tx = await auctionContract?.createOffer(id, {
        value: amountInGwei,
      });
      setSuccess('Transaction Processing!');
      await tx.wait();
      setSuccess('Your offer has been placed successfully!');
    } catch (error) {
      setError('Error placing offer. Please try again.');
    }
    setOfferAmount('');
  };

  if (!auction) return <div>Loading...</div>;

  return (
    <div className="container mt-2">
      <h1>{auction.name}</h1>
      <div className="card">
        <h2>Auction Details</h2>
        <p>{auction.description}</p>
        <p>Minimum Bid: ${auction.min + ''}</p>
        <p>
          Current Best Offer: $
          {formatUnits(
            auction.bestOfferPrice
              ? getBigInt(auction.bestOfferPrice + '')
              : 0,
            'gwei'
          ) + ''}
        </p>
        <p>Seller: {auction.seller}</p>
        {parseInt(auction.status) === 3 && <p>Winner: {auction.winner}</p>}

      </div>
      <div className="card">
        {parseInt(auction.status) === parseInt(1) ? (
          <>
            <h2>Place an Offer</h2>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
            <form onSubmit={handleOffer}>
              <div className="form-group">
                <label htmlFor="offerAmount">Your Offer Amount ($)</label>
                <input
                  type="number"
                  id="offerAmount"
                  value={offerAmount}
                  onChange={(e) => setOfferAmount(e.target.value)}
                  min={auction.currentBid + 1}
                  required
                />
              </div>
              <button type="submit" className="button">
                Place Offer
              </button>
            </form>
          </>
        ) : (
          <h2>Auction Closed</h2>
        )}
      </div>
      <div className="card">
        <h2>Current Offers</h2>
        <ul>
          {auctionOffers.length > 0 ? (
            auctionOffers?.map((offer) => {
              const weiAmount = offer?.price ? getBigInt(offer.price + '') : null;
              return (
                <li key={offer?.id}>
                  Buyer: {offer?.buyer} - Amount: ${weiAmount ? formatUnits(weiAmount, 'gwei') : 'N/A'}
                </li>
              );
            })
          ) : (
            <p>No offers yet.</p>
          )}
        </ul>
      </div>
      <div className="mb-2">
        <Link to="/" className="button">
          Back to Home
        </Link>
      </div>
    </div>
  );
}

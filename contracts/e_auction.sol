// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.2 <0.9.0;

contract e_auction {
    struct Auction {
        uint id;
        address payable seller;
        string name;
        string description;
        uint min;
        uint bestOfferId;
        uint bestOfferPrice;
        address winner;
        uint[] offerIds;
        uint status; // 1 = Active, 2 = Closed, 3 = Completed
    }

    struct Offer{
        uint id;
        uint auctionId;
        address payable buyer;
        bool isWin;
        uint price;
    }

    mapping(uint => Auction) public auctions;
    mapping(uint => Offer) public offers;
    mapping(address => uint[]) private auctionList;
    mapping(address => uint[]) private offerList;

    uint private newAuctionId = 1;
    uint private newOfferId = 1;

    function createAuction(string calldata _name, string calldata _desc, uint _min) external {
        require(_min > 0, "Minimum Amount Should be Greater Than 0");
        uint[] memory offerIds = new uint[](0);

        auctions[newAuctionId] = Auction(newAuctionId, payable(msg.sender), _name, _desc, _min, 0, 0, msg.sender,offerIds, 1); // status = 1 (Active)

        auctionList[msg.sender].push(newAuctionId);
        newAuctionId++;
    }

    function createOffer(uint _auctionId) external payable auctionExists(_auctionId) {
        Auction storage auction = auctions[_auctionId];
        require(auction.status == 1, "Auction is not active"); // Check if auction is active
        Offer storage bestOffer = offers[auction.bestOfferId];

        require(msg.value >= auction.min && msg.value > bestOffer.price, "Bid must be higher than current best offer");

        auction.bestOfferId = newOfferId;
        auction.bestOfferPrice = msg.value;
        auction.offerIds.push(newOfferId);

        offers[newOfferId] = Offer(newOfferId, _auctionId, payable(msg.sender), false, msg.value);
        offerList[msg.sender].push(newOfferId);
        newOfferId++;
    }

    // Seller closes the auction if satisfied with the current best offer
    function closeAuction(uint _auctionId) external auctionExists(_auctionId) {
        Auction storage auction = auctions[_auctionId];
        require(msg.sender == auction.seller, "Only the seller can close the auction");
        require(auction.status == 1, "Auction is already closed or completed");

        auction.status = 2; // Set status to Closed
    }

    function transaction(uint _auctionId) external auctionExists(_auctionId) {
        Auction storage auction = auctions[_auctionId];
        require(auction.status == 2, "Auction is not ready for transfer");

        Offer storage bestOffer = offers[auction.bestOfferId];

        bestOffer.isWin = true;

        for (uint i = 0; i < auction.offerIds.length; i++) {
            uint offerID = auction.offerIds[i];
            if (offerID != auction.bestOfferId) {
                Offer storage offer = offers[offerID];
                offer.buyer.transfer(offer.price);
            }
        }

        auction.seller.transfer(bestOffer.price);
        auction.status = 3; // Set status to Completed
        auction.winner = bestOffer.buyer;
    }

    function getAuctions() external view returns (Auction[] memory) {
        Auction[] memory _auctions = new Auction[](newAuctionId - 1);
        for (uint i = 1; i < newAuctionId; i++) {
            _auctions[i - 1] = auctions[i];
        }
        return _auctions;
    }

    function getUserAuctions(address _user) external view returns (Auction[] memory) {
        uint[] storage auctionIds = auctionList[_user];
        Auction[] memory _auctions = new Auction[](auctionIds.length);
        for (uint i = 0; i < auctionIds.length; i++) {
            uint id = auctionIds[i];
            _auctions[i] = auctions[id];
        }
        return _auctions;
    }

    function getUserOffers(address _user) external view returns (Offer[] memory) {
        uint[] storage userOfferIds = offerList[_user];
        Offer[] memory _offers = new Offer[](userOfferIds.length);
        for (uint i = 0; i < userOfferIds.length; i++) {
            uint id = userOfferIds[i];
            _offers[i] = offers[id];
        }
        return _offers;
    }

    modifier auctionExists(uint _auctionId) {
        require(_auctionId > 0 && _auctionId < newAuctionId, "Auction does not exist");
        _;
    }

    function getOffers() external view returns (Offer[] memory) {
        Offer[] memory _offers = new Offer[](newOfferId - 1);
        for (uint i = 1; i < newOfferId; i++) {
            _offers[i - 1] = offers[i];
        }
        return _offers;
    }
}

const hre = require("hardhat");




async function main() {

    const Eauction = await hre.ethers.getContractFactory("e_auction");
    const EauctionContract = await Eauction.deploy();

    await EauctionContract.deployed();

    console.log("Eauction deployed to:", EauctionContract.address);

}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
})

//0x40657afc03b78f4f836cb5cedb40158d7085bd06
//0x8c80eab40cb6739ee9950a68564eb4f6896e54fb
//0x06f8de8fb6a65f5c9bee9632c14475c05fe5011e

// INFURA_SEPOLIA_URL=https://sepolia.infura.io/v3/bdecc158ccf7458e965fca5ebf11bb9b
// PRIVATE_KEY=89dcdaf4e4232e836c9aef610c9e164bf23bd0dde9d8a4e2b1cf1126b703d691

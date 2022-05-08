const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Decentratwitter", function () {
    let decentratwitter;
    let deployer,user1,user2,users;
    let URI = "SampleURI";
    let postHash = "SampleHash";
    beforeEach(async ()=>{
        [deployer,user1,user2,...users] = await ethers.getSigners();
        const twitterFactory = await ethers.getContractFactory("Decentratwitter");
        decentratwitter = await twitterFactory.deploy();
        await decentratwitter.connect(user1).mint(URI);
    })
    describe("Deployment", async ()=>{
        it("Should track name and symnbol", async function () {
          
            const nftName = "Web3 Twitter";
            const nftSymbol = "3itter"
            expect(await decentratwitter.name()).to.equal(nftName);
            expect(await decentratwitter.symbol()).to.equal(nftSymbol);
        });
    })
    describe('Minting NFTS', async ()=>{
        it("Should track each minted NFT", async function () {
            expect (await decentratwitter.tokenCount()).to.equal(1);
            expect (await decentratwitter.balanceOf(user1.address)).to.equal(1);
            expect (await decentratwitter.tokenURI(1)). to.equal(URI);

            await decentratwitter.connect(user2).mint(URI);
            expect(await decentratwitter.tokenCount ()).to.equal(2);
            expect(await decentratwitter.balanceOf(user2.address)).to.equal(1);
            expect(await decentratwitter.tokenURI(2)).to.equal(URI);
        });
    })
    describe('Setting Profile', async()=>{
        it("Should be able to set profile", async function() {
            // user1 mints another nft
            await decentratwitter.connect(user1).mint(URI);
            //By default the users profile is set to their last minted nft.
            expect(await decentratwitter.profiles(user1.address)).to.equal(2);
            // user1sets profile to first minted nft
            await decentratwitter.connect(user1).setProfile(1)
            expect(await decentratwitter.profiles(user1.address)).to.equal(1);
            //fail case
            await expect(decentratwitter.connect(user2).setProfile(2))
            .to.be.revertedWith("Only owners of the nft are allowed to set profile");
        });
    })

});




# Pinsurance

Pinsurance is a blockchain-based P2P defi platform for car insurance. In this model group of individuals, friends, family or known people who are like-minded and share common interest join together and pool their resources for mutal aid, introducing a sense of control, trust, and transparency. User can create or join an **Insurance Pool** with peers and pool their premium in it. After joining pool, user pools the premium amount for their vehicle to the pool. After all peers pools their amount, pool become active for one year then they can mint their **Policy NFT**.

Policy NFT is your immutable tamper-resistant representation that you own an insurance policy. An embedded **QR-Code** in the NFT provides all the necessary information about your insurance policy when scanned.

Any pool member can make a Claim Request from thier pool, for this they have to provide a support document for their claim request. Claim request along with support document is broadcast to all the pool members. Pool members verifies and vote for claim request. Vote > 50% approves claim request else request is declined. Once approved the claimer can witdhraw the requested amount from the pool. In-app Video call features enables pool members to easily discuss and resolve any claim request.

![Hero section](https://github.com/anubhav11156/Pinsurance/assets/86551390/d8709bbb-6058-4bfb-a75a-f76bc7828526)

### Working

![working](https://github.com/anubhav11156/Pinsurance/assets/86551390/44cd10e7-e1bc-4768-b338-7feb36d00ae7)

[Video Explanation](https://youtu.be/N8b7mintQho)

[Devpost Project Page](https://devpost.com/software/pinsurance)

### Built with
- Solidity
- Fantom Blockchain ( Testnet )
- Web3.storage ( IPFS )
- Javascript
- ReactJS
- Redux
- HTML, CSS
- Hudlle 01
- wagmi
- connect-kit
- Remix 
- EtherJS


### Installation

1. Clone the repisitory

```bash
git clone https://github.com/anubhav11156/Pinsurance.git
```
2. Install the packages

```bash
npm install --force
```
3. Start the application

```bash
npm start
```

### Environment Variables
To run this dapp, you will need to add the following environment variables to your .env file

`REACT_APP_WEB3_STORAGE= <web3.storage API key>`

`REACT_APP_PRIVATE_KEY= <Wallet private key>`

### Smart Contracts

- [Pinsurance.sol](https://testnet.ftmscan.com/address/0xb46c612f413cd70c770dee0ea6a3cf3f64e98d42)

- [Policy.sol](https://testnet.ftmscan.com/address/0x2cf8b13a21be699927c964f953a37871ebc8df8b)

- [MockUSDC.sol](https://testnet.ftmscan.com/address/0xF8E9F063228eb47137101eb863BF3976466AA31F)

- Pool.sol ( This is pool contract which is deployed by Pinsurance.sol, it deploys Pool contract everytime user make insurance pool on Pinsurnace. )

### Screenshots
![user section](https://github.com/anubhav11156/Pinsurance/assets/86551390/f29617c4-2f8b-4f33-90ca-b6309a7d5632)

![pool members](https://github.com/anubhav11156/Pinsurance/assets/86551390/28a8595a-a9da-4fec-b4c9-8b1c7d9f6425)

![policy-nft](https://github.com/anubhav11156/Pinsurance/assets/86551390/9be393a8-ae8b-42be-bc89-5e8d108aa6f1)

![claim requests](https://github.com/anubhav11156/Pinsurance/assets/86551390/7330e905-33ab-4a8d-8328-a7e209c19f71)

![request claim](https://github.com/anubhav11156/Pinsurance/assets/86551390/68bf499a-dc0f-4f55-bbdc-aa88d6066b62)

![meeting](https://github.com/anubhav11156/Pinsurance/assets/86551390/0920c4b9-e23f-44ad-b9cc-26c21e3f7dcf)

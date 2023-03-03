import { React, useState, useEffect } from 'react'
import styled from 'styled-components'
import { ethers } from "ethers"
import web3modal from "web3modal"
import { poolAbi, mockUsdcContractAddress, mockUsdcAbi, policyAbi, policyContractAddress } from "../../config";
import { useAccount } from 'wagmi'
import NFTCard from './NFTCard';


function PolicyNFTs() {

    const [policies, setPolicies] = useState([]);

    const { address } = useAccount();

    useEffect(() => {
        fetchPolicies();
    }, [address])

    const fetchPolicies = async () => {
        const provider = new ethers.providers.JsonRpcProvider('https://endpoints.omniatech.io/v1/fantom/testnet/public');
        const policyContract = new ethers.Contract(
            policyContractAddress,
            policyAbi.abi,
            provider
        )
        try {
            const data = await policyContract.fetchMyPolicies(address);
            const items = await Promise.all(
                data.map(async (i) => {
                    const tokenUri = await policyContract.tokenURI(i.tokenID.toString());
                    let item = {
                        tokenId: i.tokenID.toNumber(),
                        uri: tokenUri,
                    };
                    return item;
                })
            );
            console.log('policies : ', items);
            setPolicies(items);
        } catch (error) {
            console.log(error);
        }
    }

    console.log('Policies are : ', policies);

    return (
        <Container>
            <div className='label'>
                <div className='line-1'></div>
                <div className='text'>
                    <p>Policy NFTs</p>
                </div>
                <div className='line-2'></div>
            </div>
            <div className='nft-container'>
                <div className='nft-box'>
                    <NFTCard />
                </div>
                <div className='nft-box'>
                    <NFTCard />
                </div>
                <div className='nft-box'>
                    <NFTCard />
                </div>
            </div>
        </Container>
    )
}

export default PolicyNFTs

const Container = styled.div`
    width: 100%;
    height: 100%;
    overflow: hidden;

    display: flex;
    flex-direction: column;
    align-items: center;

    .label {
        margin-top: 1rem;
        width: 98%;
                height: 1rem;
                display: flex;
                justify-content: start;
                align-items: center;
                margin-bottom: 5px;

                .line-1 {
                    width: 2.5rem;
                    border-top: 1px solid  #0152b5b6;
                    margin-right: 8px;
                }

                .text {
                    p {
                        margin: 0;
                        color:  #0152b5e0;
                    }
                }

                .line-2 {
                    flex: 1;
                    margin-left: 8px;
                    border-top: 1px solid  #0152b5b6;
                }
        
    }

    .nft-container {
        flex: 1;
        width: 95%;
        margin-top: 1.8rem;
        padding-left: 0.5rem;
        display: grid;
        grid-template-columns: 15.7rem 15.7rem 15.7rem 15.7rem 15.7rem;
        column-gap: 2.8rem;
        row-gap: 1.3rem;
        .nft-box {
            height: 19.5rem;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 5px;
            overflow: hidden;
            border: 1px solid  #0152b5b6;
            /* border: 1px solid #141414f1; */
            box-sizing: border-box;
            /* box-shadow: 1px 1px 6px #0152b560; */
        }
    }   
`
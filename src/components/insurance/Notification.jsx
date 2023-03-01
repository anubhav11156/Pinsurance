import { React, useEffect, useState } from 'react'
import styled from 'styled-components'
import axios from "axios";
import { ethers } from "ethers"
import { pinsuranceContractAddress, mockUsdcContractAddress, pinsuranceAbi, mockUsdcAbi } from "../../config";
import { useAccount } from 'wagmi'
import fromExponential from 'from-exponential';
import RequestCard from './RequestCard';



function Notification() {

  const { address } = useAccount();

  const hexToDec = (hex) => parseInt(hex, 16);


  useEffect(() => {
    fetchAllClaims();
  }, [address])

  const fetchAllClaims = async () => {
    const provider = new ethers.providers.JsonRpcProvider('https://endpoints.omniatech.io/v1/fantom/testnet/public');
    const pinsuranceContract = new ethers.Contract(
      pinsuranceContractAddress,
      pinsuranceAbi.abi,
      provider
    )
    try {
      const data = await pinsuranceContract.getClaimRequests(address)
      const items = await Promise.all(
        data.map(async (i) => {
          let bal = hexToDec(i.claimAmount._hex);
          let claimAmount = Number(ethers.utils.formatEther(fromExponential(bal))).toFixed(2);
          let poolAddress = i.poolAddress;
          let poolName = i.poolName;
          let docURI = i.supportDocumentCID;
          let userDetail = {
            userAddress: `${i.userDetail.userAddress}`,
            userMetaData: `${i.userDetail.userMetadataURI}`,
          }

          let item = {
            claimAmount,
            poolAddress,
            poolName,
            docURI,
            userDetail
          };
          return item;
        })
      );
      console.log('claim notifications : ', items);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Container>
      <div className='label'>
        <div className='line-1'></div>
        <div className='text'>
          <p>Claim requests</p>
        </div>
        <div className='line-2'></div>
      </div>
      <div className='claim-container'>
        <RequestCard />
        <RequestCard />
        <RequestCard />
        <RequestCard />
        <RequestCard />
        <RequestCard />
        <RequestCard />
        <RequestCard />
        <RequestCard />
        <RequestCard />
        <RequestCard />
        <RequestCard />
        <RequestCard />
        <RequestCard />
        <RequestCard />
        <RequestCard />
      </div>
    </Container>
  )
}

export default Notification

const Container = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;

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

  .claim-container {
    height: 43.2rem;
    width: 97%;
    margin-top: 1.5rem;
    overflow: scroll;
    padding-bottom: 10px;
    padding-left: 5px;
    padding-right: 5px;
  }
`
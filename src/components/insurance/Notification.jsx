import { React, useEffect, useState } from 'react'
import styled from 'styled-components'
import axios from "axios";
import { ethers } from "ethers"
import { pinsuranceContractAddress, mockUsdcContractAddress, pinsuranceAbi, mockUsdcAbi } from "../../config";
import { useAccount } from 'wagmi'
import fromExponential from 'from-exponential';



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
          let claimAmount =  Number(ethers.utils.formatEther(fromExponential(bal))).toFixed(2);
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
      Notification
    </Container>
  )
}

export default Notification

const Container = styled.div`
    
`
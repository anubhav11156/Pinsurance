import { React, useEffect, useState } from 'react'
import styled from 'styled-components'
import axios from "axios";
import { ethers } from "ethers"
import { pinsuranceContractAddress, mockUsdcContractAddress, pinsuranceAbi, mockUsdcAbi } from "../../config";
import { useAccount } from 'wagmi'



function Notification() {

  const { address } = useAccount();

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
          let _claimAmount = i.claimAmount;
          let _poolAddress = i.poolAddress;
          let _poolName = i.poolName;
          let _docURI = i.supportDocumentCID;
          let _userDetail = {
            userAddress: `${i.userDetail.userAddress}`,
            userMetaData: `${i.userDetail.userMetadataURI}`,
          }

          let item = {
            _claimAmount,
            _poolAddress,
            _poolName,
            _docURI,
            _userDetail
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
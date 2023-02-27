import { useState, useEffect, React } from 'react'
import styled from 'styled-components'
import axios from "axios";
import { ethers } from "ethers"
import { pinsuranceContractAddress, mockUsdcContractAddress, pinsuranceAbi, mockUsdcAbi } from "../../config";


function Pool() {

  useEffect(() => {
    fetchPoolMembers();
  }, [])

  const poolAddress = "0xD36E1eaeFe3005845eb13B3FBFd5423C446bF53F";

  const fetchPoolMembers = async () => {
    const provider = new ethers.providers.JsonRpcProvider('https://endpoints.omniatech.io/v1/fantom/testnet/public');
    const pinsuranceContract = new ethers.Contract(
      pinsuranceContractAddress,
      pinsuranceAbi.abi,
      provider
    )
    try {
      const data = await pinsuranceContract.getPoolMembers(poolAddress)
      const items = await Promise.all(
        data.map(async (i) => {
          let userAddress = i.userAddress;
          let userURI = i.userMetadataURI;
          let item = {
            userAddress,
            userURI
          };
          return item;
        })
      );
      console.log('pool members : ', items);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Container>
      Pool Detail
    </Container>
  )
}

export default Pool

const Container = styled.div`
    
`
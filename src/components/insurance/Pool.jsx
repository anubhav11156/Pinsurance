import { useState, useEffect, React } from 'react'
import styled from 'styled-components'
import axios from "axios";
import { ethers } from "ethers"
import { pinsuranceContractAddress, mockUsdcContractAddress, pinsuranceAbi, mockUsdcAbi } from "../../config";


function Pool() {

  useEffect(() => {
    fetchPoolMembers();
  }, [])

  const poolAddress = "0x9d211d45e432c43b4F8b6Eb86c841A11cFc5AD90";

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
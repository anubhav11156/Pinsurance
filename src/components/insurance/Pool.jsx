import { useState, useEffect, React } from 'react'
import styled from 'styled-components'
import axios from "axios";
import { ethers } from "ethers"
import { pinsuranceContractAddress, mockUsdcContractAddress, pinsuranceAbi, poolAbi, mockUsdcAbi } from "../../config";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ClipLoader from "react-spinners/ClipLoader";
import fromExponential from 'from-exponential';


function Pool() {

  const [poolAddress, setPoolAddress] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [members, setMembers] = useState([]);
  const [poolBalance, setPoolBalance] = useState();
  const [poolName, setPoolName] = useState('');
  const [isPoolActive, setIsPoolActive] = useState(false);

  const hexToDec = (hex) => parseInt(hex, 16);


  /*-----------------------------------------get pool members------------------------------*/

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
      setMembers(items);
    } catch (error) {
      toast.error("No member in this pool!", {
        position: toast.POSITION.TOP_CENTER
      });
    }
  }

  /*-----------------------------------------------------------------------------------------*/

  /*-------------------------------------get pool balance------------------------------------*/

  const getPoolBalance = async () => {
    const provider = new ethers.providers.JsonRpcProvider('https://endpoints.omniatech.io/v1/fantom/testnet/public');
    const usdcContract = new ethers.Contract(
      mockUsdcContractAddress,
      mockUsdcAbi.abi,
      provider
    )
    try {
      await usdcContract.balanceOf(poolAddress)
        .then((response) => {
          let bal = hexToDec(response._hex);
          setPoolBalance(
            Number(ethers.utils.formatEther(fromExponential(bal))).toFixed(2)
          );
        })
    } catch (error) {
      console.log(error);
    }
  }

  /*----------------------------------------------------------------------------------------*/

  /*------------------------get Pool detail -------------------*/

  const getDetail = async () => {
    const provider = new ethers.providers.JsonRpcProvider('https://endpoints.omniatech.io/v1/fantom/testnet/public');
    const poolContract = new ethers.Contract(
      poolAddress,
      poolAbi.abi,
      provider
    )
    try {
      await poolContract.getPoolDetail()
        .then((response) => {
          console.log(response)
          setIsPoolActive(response.isActive);
          setPoolName(response.name);
          setIsSearching(false);
        })
    } catch (error) {
      console.log(error);
      setIsSearching(false);
    }
  }

  /*-----------------------------------------------------------*/

  const checkHandler = async () => {
    setIsSearching(true);
    fetchPoolMembers()
    getPoolBalance()
    getDetail();
  }

  console.log(poolBalance);
  console.log(members);
  console.log('pool active : ', isPoolActive);
  console.log('name : ', poolName);

  return (
    <Container>
      <div className='up'>
        <div className='input-box'>
          <input type="text" placeholder='Pool Address' onChange={(e) => {
            setPoolAddress(e.target.value);
          }} />
        </div>
        <div className='check' onClick={checkHandler}>
          {!isSearching &&
            <img src="/images/check.png" />
          }
          {isSearching &&
            <ClipLoader color="#ffffff" size={16} />
          }
        </div>
      </div>
      <div className='down'>
        for member card
      </div>
    </Container>
  )
}

export default Pool

const Container = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;

  .up {
    margin-top: 1.2rem;
    width: 96%;
    height: 2.7rem;
   

    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    border-radius: 5px;
    border: 1px solid #0152b565;

    .input-box {
      flex:1;
      background-color: orange;
      height: 100%;
      border: none;
      display: flex;
      justify-content: start;
      align-items: center;

      input {
        width: 100%;
        height: 100%;
        outline: none;
        padding-left: 10px;
        font-size: 18px;
        color: #202020f1;
        letter-spacing: 1px;
      }
    }

    .check {
      width: 3.8rem;
      height: 100%;
      background-color: #0152b5cc;

      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      transition: opacity 0.15s;

      &:hover {
        opacity: 0.9;
      }

      &:active {
        opacity: 0.8;
      }

      img {
        width: 40%;
      }
    }
  }

  .down {
    width: 96%;
    flex: 1;
    margin-bottom: 1.2rem;
    background-color: lightgreen;
  }
`
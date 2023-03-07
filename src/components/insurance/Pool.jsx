import { useState, useEffect, React } from 'react'
import styled from 'styled-components'
import { ethers } from "ethers"
import { pinsuranceContractAddress, mockUsdcContractAddress, pinsuranceAbi, poolAbi, mockUsdcAbi } from "../../config";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ClipLoader from "react-spinners/ClipLoader";
import fromExponential from 'from-exponential';
import MemberCard from './MemberCard';


function Pool() {

  const [poolAddress, setPoolAddress] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [members, setMembers] = useState([]);
  const [poolBalance, setPoolBalance] = useState();
  const [poolName, setPoolName] = useState('');
  const [isPoolActive, setIsPoolActive] = useState(false);
  const [isDataFetched, setIsDataFetched] = useState(false);

  const hexToDec = (hex) => parseInt(hex, 16);


  useEffect(() => {
    setIsDataFetched(false);
  }, [poolAddress]);

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
          setIsPoolActive(response.isActive);
          setPoolName(response.name);
          setIsSearching(false);
          setIsDataFetched(true);
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

  const memberCards = members.map(card => {
    return (
      <MemberCard 
          poolAddress={poolAddress}
          userAddress={card.userAddress}
          userURI={card.userURI}
      />
  )
  })
  
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

      {isDataFetched &&
        <div className='down'>
          <div className='pool-detail'>
            <div className='upper'>
              <div className='name-label'>
                <p>Pool Name</p>
              </div>
              <div className='name'>
                <p>{poolName}</p>
              </div>
            </div>
            <div className='lower'>
              <div className='balance-div'>
                <div className='label'>
                  <p>Pool Balance</p>
                </div>
                <div className='text'>
                  <p>{poolBalance}</p>
                </div>
              </div>
              <div className='members-div'>
                <div className='label'>
                  <p>Members</p>
                </div>
                <div className='text'>
                  <p>{members.length}/2</p>
                </div>
              </div>
              <div className='status-div'>
                <div className='label'>
                  <p>Status</p>
                </div>
                <div className='text'>
                  { isPoolActive &&
                    <p>Pool is active</p>
                  }
                  { !isPoolActive &&
                    <p>Pool is NOT yet active</p>
                  }
                </div>
              </div>
            </div>
          </div>
          <div className='members-container'>
            <div className='member-label'>
                <p>Pool members </p>
            </div>
            <div className='main'>
                  {memberCards}
            </div>
            
          </div>
        </div>
      }

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
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border-radius: 5px;
    border: 1px solid #0152b565;
    gap: 1rem;
    
    .pool-detail {
      width: 100%;
      height: 5rem;
      display: flex;
      flex-direction: column;

      .upper {
        flex: 1;
        display: flex;
        border-bottom: 1px solid #0152b565;

        .name-label {
          height: 100%;
          width: 10rem;
          background-color: #0152b5cc;
          display: flex;
          justify-content: center;
          align-items: center;

          p {
            margin: 0;
            color: white;
            font-size: 17px
          }
        }

        .name {
          flex:1;
          display: flex;
          justify-content: start;
          align-items: center;

          p {
           margin:0;
           font-size: 17px;
           margin-left: 15px;
           color: #202020f1;
          }

        }
       
      }

      .lower {
        flex:1;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #0152b565;


        .balance-div,
        .members-div,
        .status-div {
          flex: 1;
          height: 100%;
          display: flex;
          align-items: center;

          .label {
            width: 10rem;
            height: 100%;
            background-color: #0152b5cc;
            display: flex;
            justify-content: center;
            align-items: center;

            p {
              margin: 0;
              color: white;
              font-size: 17px
            }
          }

          .text {
            flex:1;
            display: flex;
            justify-content: start;
            align-items: center;

              p {
                margin:0;
                font-size: 17px;
                margin-left: 15px;
                color: #202020f1;
              }
            }
        }

       
      }
    }

    .members-container {
      flex:1;
      width: 100%;
      display:flex;
      flex-direction: column;
      align-items: center;

      .member-label {
        width: 98%;
        height: 2.5rem;

        p {
          margin:0;
          margin-left: 10px;
          font-size: 17px;
          color: #202020f1;
        }
      }

      .main {
        flex: 1;
        width: 97%;
        display: grid;
        grid-template-rows: 7.5rem 7.5rem 7.5rem;
        row-gap: 1.6rem;

        .member-box {
          height: 100%;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
  }
`
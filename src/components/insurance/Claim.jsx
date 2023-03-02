import { React, useState, useEffect } from 'react'
import styled from 'styled-components'
import ClipLoader from "react-spinners/ClipLoader";
import { Web3Storage } from 'web3.storage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAccount } from 'wagmi'
import { ethers } from "ethers"
import axios from "axios";
import web3modal from "web3modal"
import { poolAbi, pinsuranceContractAddress, pinsuranceAbi } from "../../config";
import fromExponential from 'from-exponential';
import MyClaimCard from './MyClaimCard';


function Claim() {

  const [isRequesting, setIsRequesting] = useState(false);
  const [poolAddress, setPoolAddress] = useState();
  const [documentURI, setDocumentURI] = useState("");
  const [amount, setAmount] = useState();
  const [isFetching, setIsFetching] = useState(false);
  const [claimData, getClaimData] = useState([]);
  const [myClaims, setMyClaims] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const { address } = useAccount();

  useEffect(() => {
    fetchMyClaims();
  }, [address]);

  useEffect(() => {
    filterClaims();
  }, [loaded])

  const hexToDec = (hex) => parseInt(hex, 16);


  /*-------------------IPFS code to upload support document -------------*/

  const storageKey = process.env.REACT_APP_WEB3_STORAGE;

  const storageClient = () => {
    return new Web3Storage({ token: `${storageKey}` })
  }

  const uploadDoc = async () => {
    const fileInput = document.getElementById('docs');
    const pathname = fileInput.files[0].name;

    const client = storageClient();
    const cid = await client.put(fileInput.files);
    if (cid.length) {
      toast.success("Uploaded to IPFS", {
        position: toast.POSITION.TOP_CENTER
      });
      const uri = `https://${cid}.ipfs.w3s.link/${pathname}`
      setDocumentURI(uri);
    } else {
      toast.error("IPFS upload failed!", {
        position: toast.POSITION.TOP_CENTER
      });
    }
  }

  /*------------------------------------------------------------------------*/

  /*-----------------------Ceate claim request ----------------------------*/

  const requestHandler = async () => {
    setIsRequesting(true);
    const modal = new web3modal({
      cacheProvider: true,
    });

    const connection = await modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const poolContract = new ethers.Contract(
      poolAddress,
      poolAbi.abi,
      signer
    )
    try {
      const requestedClaimAmount = ethers.utils.parseEther(amount);
      const create = await poolContract.createClaimRequest(
        address,
        documentURI,
        requestedClaimAmount, {
        gasLimit: 900000,
      }
      )

      await create.wait()
        .then(() => {
          setIsRequesting(false);
          toast.success("Claim requested.", {
            position: toast.POSITION.TOP_CENTER
          });
        }).catch((error) => {
          setIsRequesting(false);
          toast.error("Failed to request claim.", {
            position: toast.POSITION.TOP_CENTER
          });
          console.error(error);
        })
    } catch (e) {
      setIsRequesting(false);
      toast.error("Revert: Premium not staked!", {
        position: toast.POSITION.TOP_CENTER
      });
    }


  }

  /*-----------------------------------------------------------------------*/

  /*----------------------------Fetch user claim---------------------------*/

  const fetchMyClaims = async () => {
    setIsFetching(true);
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
      getClaimData(items);
      setIsFetching(false);
      setLoaded(true);
    } catch (error) {
      console.log(error);
      setIsFetching(false);
    }
  }

  const filterClaims = () => {
    if (loaded) {
      claimData.map((currentClaim) => {
        if (currentClaim.userDetail.userAddress == address) {
          setMyClaims(
            oldArray => [...oldArray, currentClaim]
          );
        }
      })
      setLoaded(false);
    }
  }
  /*-----------------------------------------------------------------------*/

  const claimsCard = myClaims.map(card => {
    return (
      <MyClaimCard
        poolName={card.poolName}
        poolAddress={card.poolAddress}
        amount={card.claimAmount}
        userAddress={card.userDetail.userAddress}
      />
    )
  })

  return (
    <Container>
      <div className='left'>
        <div className='main-container'>
          <div className='heading'>
            <p>Request for Claim</p>
          </div>
          <div className='pool-address'>
            <input type="text" placeholder='Pool Address' onChange={(props) => {
              let pool = props.target.value
              setPoolAddress(pool)
            }} />
          </div>
          <div className="upload-amount">
            <div className='amount-div'>
              <input type="text" placeholder='Claim amount' onChange={(props) => {
                let x = props.target.value;
                setAmount(x);
              }} />
            </div>
            <div className='upload-div'>
              <input type="file" id="docs" onChange={uploadDoc} />
            </div>
          </div>
          <div className='button' onClick={requestHandler}>
            {!isRequesting &&
              <p>Request</p>
            }
            {isRequesting &&
              <ClipLoader color="#ffffff" size={16} />
            }
          </div>
        </div>
      </div>
      <div className='right'>
        <div className="main-container">
          <div className='heading'>
            <p>My Claims</p>
          </div>
          {isFetching &&
            <div className='placeholder'>
              <p>Fetching your claims.....</p>
            </div>
          }
          {!isFetching &&
            <div className='claims-container'>
              {claimsCard}
            </div>
          }

        </div>
      </div>
    </Container>
  )
}

export default Claim

const Container = styled.div`
    width: 100%;
    height: 95%;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    padding-top: 1rem;

    .left {
      flex: 1;
      height: 100%;
      display: flex;
      justify-content: center;

      .main-container {
        margin-top: 6rem;
        height: 70%;
        width: 70%;
        background-color: #0152b515;
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow: hidden;
        border-radius: 8px;

        .heading {
          width: 99%;
          height: 2.3rem;
          display: flex;
          justify-content: center;
          align-items: center;

          p {
            margin: 0;
            margin-top: 10px;
            color: #0a458d;
          }
        }

        .pool-address {
          margin-top: 1.5rem;
          height: 2.4rem;
          width: 93%;
          display: flex;
          justify-content: center;
          align-items: center;
          
          input {
            width: 100%;
            height: 2rem;
            outline: none;
            border-radius: 6px;
            border: 1px solid #0152b565;

            padding-left: 10px;
            font-size: 15px;
          }
        }

        .upload-amount {
          height: 2.5rem;
          width: 92%;
          margin-top: 1.2rem;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 20px;

          .amount-div {
            flex: 1;
            height: 100%;
            border-radius: 6px;
            display: flex;
            justify-content: center;
            align-content: center;
            overflow: hidden;

            input {
              width: 100%;
              height: 90%;
              outline: none;
              border-radius: 6px;
              border: 1px solid #0152b565;

              padding-left: 10px;
              font-size: 15px;
            }
          }

          .upload-div {
            flex: 1;
            height: 100%;
            background-color:  #181717;
            border-radius: 6px;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: opacity 0.15s;

            input {
              width: 80%;
              color: white;
              background-color: #e3dddd2d;
              border-radius: 2px;
              cursor: pointer;
            }
          }

        }

        .button {
          margin-top: 1.2rem;
          height: 2.5rem;
          width: 92%;
          border-radius: 6px;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #0153b5;
          transition: opacity 0.15s;
            cursor: pointer;

            &:hover {
              opacity: 0.9;
            }

            &:active {
              opacity: 0.8;
            }
          p {
            color: white;
            font-size: 15px;
          }
        }
      }
    }

    .right {
      flex: 1;
      height: 100%;
      display: flex;
      justify-content: center;

      .main-container {
        margin-top: 6rem;
        height: 70%;
        width: 70%;
        background-color: #0152b515;
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow: hidden;
        border-radius: 8px;

        .heading {
          width: 99%;
          height: 2.3rem;
          display: flex;
          justify-content: center;
          align-items: center;

          p {
            margin: 0;
            margin-top: 10px;
            color: #0a458d;
          }
        }

        .claims-container {
          margin-top: 15px;
          height: 100%;
          width: 88%;
          overflow: scroll;
          padding-top: 10px;
        }

        .placeholder {
          margin-top: 15px;
          height: 100%;
          width: 88%;
          display: flex;
          justify-content: center;
          align-items: start;

          p {
            margin: 0;
            margin-top: 3rem;
          }
        }

      }
    }
`
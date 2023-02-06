import { React, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Web3Storage, File } from 'web3.storage/dist/bundle.esm.min.js';
import ClipLoader from "react-spinners/ClipLoader";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { pinsuranceContractAddress, mockUsdcContractAddress, pinsuranceAbi, mockUsdcAbi } from "../../config";
import web3modal from "web3modal"
import { ethers } from "ethers"
import { useAccount } from 'wagmi'

function JoinCreate() {

  const [formCreateActive, setCreateFormActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [formHavePoolActive, setFormHavePoolActive] = useState(false);
  const [poolAddress, setPoolAddress] = useState("");
  const [poolName, setPoolName] = useState("");
  const [checked, setChecked] = useState(false);
  const [formInput, setFormInput] = useState({
    vehicleModel: "",
    cubicCapacity: "",
    insurancePremium: "",
  })

  const { address } = useAccount();
  const ownerAddress = "0x22b6Dd4D6d818e2Ebce3D2E009A249F8FbF4e965";

  const createPoolHandler = () => {
    setCreateFormActive(true);
    setFormHavePoolActive(false);
  }

  const havePoolHandler = () => {
    setCreateFormActive(false);
    setFormHavePoolActive(true);
  }


  /*--------------------IPFS code to upload Pool Metadata-------------------*/

  const web3StorageApiKey = process.env.REACT_APP_WEB3_STORAGE;

  const makeStorageClient = () => {
    return new Web3Storage({ token: `${web3StorageApiKey}` })
  }

  const uploadToIPFS = async (files) => {
    const client = makeStorageClient()
    const cid = await client.put(files)
    return cid;
  }

  const metadata = async () => {
    const { vehicleModel, cubicCapacity, insurancePremium } = formInput;
    const data = JSON.stringify({ vehicleModel, cubicCapacity, insurancePremium });
    const files = [
      new File([data], 'poolMetadata.json')
    ]
    const metadataCID = await uploadToIPFS(files);
    // if (metadataCID.length) {
    //   toast.success("Pool Metadata Uploaded to IPFS", {
    //     position: toast.POSITION.TOP_CENTER
    //   });
    // } else {
    //   toast.error("Failed to upload Pool Metadata!", {
    //     position: toast.POSITION.TOP_CENTER
    //   });
    // }
    return `https://ipfs.io/ipfs/${metadataCID}/poolMetadata.json`
  }

  /*------------------------------------------------------*/

  useEffect(() => {
    if (formInput.cubicCapacity > 0 && formInput.cubicCapacity <= 1000) {
      setFormInput({
        ...formInput,
        insurancePremium: "2000"
      })
    } else if (formInput.cubicCapacity > 1000 && formInput.cubicCapacity <= 2000) {
      setFormInput({
        ...formInput,
        insurancePremium: "3500"
      })
    } else {
      setFormInput({
        ...formInput,
        insurancePremium: ""
      })
    }
  }, [formInput.cubicCapacity])

  // Will create insurance pool
  const createHandler = async () => {
    setIsUploading(true);
    // Upload Metadata to IPFS.
    const uri = await metadata();
    console.log('URI : ', uri);
    const modal = new web3modal({
      cacheProvider: true,
    });

    const connection = await modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const usdcContract = new ethers.Contract(
      mockUsdcContractAddress,
      mockUsdcAbi.abi,
      signer
    )
    const value = 1; // platform fee : 100 USDC
    const usdcValue = ethers.utils.parseEther(value.toString());

    const transaction = await usdcContract.transfer(
      ownerAddress,
      usdcValue
    )

    await transaction.wait()
      .then(() => {
        createInsurancePool(signer, uri)
      })
      .catch((error) => {
        console.log(error);
      })
  }

  const createInsurancePool = async (_signer, _uri) => {
    const pinsuranceContract = new ethers.Contract(
      pinsuranceContractAddress,
      pinsuranceAbi.abi,
      _signer
    )

    const create = await pinsuranceContract.createPool(
      poolName,
      _uri,
      address
    )

    await create.wait()
      .then(() => {
        setIsUploading(false);
        toast.success("Pool Created", {
          position: toast.POSITION.TOP_CENTER
        });
      }).catch((error) => {
        setIsUploading(false);
        toast.error("Failed to create pool.", {
          position: toast.POSITION.TOP_CENTER
        });
        console.error(error);
      })
  }


  const joinHandler = async () => {
    if(checked){
      setIsUploading(true);
    // Upload Metadata to IPFS.
    const uri = await metadata();
    console.log('URI : ', uri);

    const modal = new web3modal({
      cacheProvider: true,
    });

    const connection = await modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const usdcContract = new ethers.Contract(
      mockUsdcContractAddress,
      mockUsdcAbi.abi,
      signer
    )
    const value = 1; // platform fee : 100 USDC
    const usdcValue = ethers.utils.parseEther(value.toString());

    const transaction = await usdcContract.transfer(
      ownerAddress,
      usdcValue
    )

    await transaction.wait()
      .then(() => {
        joinInsurnacePool(uri)
      })
      .catch((error) => {
        console.log(error);
      })
    } else {
      toast.error("Check Pool Id first!", {
        position: toast.POSITION.TOP_CENTER
      });
    }
  }

  const joinInsurnacePool = async (_uri) => {

    const modal = new web3modal({
      cacheProvider: true,
    });

    const connection = await modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const pinsuranceContract = new ethers.Contract(
      pinsuranceContractAddress,
      pinsuranceAbi.abi,
      signer
    )

    const join = await pinsuranceContract.joinPool(
      poolAddress,
      address,
      _uri,
    )

    await join.wait()
      .then(() => {
        setIsUploading(false);
        toast.success("Pool Joined", {
          position: toast.POSITION.TOP_CENTER
        });
      }).catch((error) => {
        setIsUploading(false);
        toast.error("Failed to join pool.", {
          position: toast.POSITION.TOP_CENTER
        });
        console.error(error);
      })
  }

  // check if the given pool Id exists or not
  const checkPoolIdHandler = async () => {
    setIsChecking(true);
    const provider = new ethers.providers.JsonRpcProvider('https://filecoin-hyperspace.chainstacklabs.com/rpc/v1');
    const pinsuranceContract = new ethers.Contract(
      pinsuranceContractAddress,
      pinsuranceAbi.abi,
      provider
    )
    try {
      await pinsuranceContract.getPoolStatus(poolAddress)
        .then((response) => {
          console.log("pool status : ", response);
          if(response){
            toast.success("Pool Found!", {
              position: toast.POSITION.TOP_CENTER
            });
            setIsChecking(false);
            return response
          } else {
            toast.error("Pool not found!", {
              position: toast.POSITION.TOP_CENTER
            });
            setIsChecking(false);
            return response
          }
        })
    } catch (error) {
      console.log(error);
      setIsChecking(false);
    }
    setChecked(true);
  }

  return (
    <Container>
      <div className='left'>
        <div className='up'>
          <div className='create-pool-button' onClick={createPoolHandler}>
            <div className='text'>
              <p>Create Pool</p>
            </div>
            <div className='logo-div'>
              <img src='/images/add.png' />
            </div>
          </div>
        </div>
        <div className='down'>
          {formCreateActive &&
            <>
              <div className='pool-name-div'>
                <input type="text" placeholder='Pool Name' onChange={(prop) => {
                  setPoolName(prop.target.value)
                }} required />
              </div>
              <Form>
                <div className='vehicle-model-div'>
                  <input type="text" placeholder='Vehicle Model' onChange={(prop) => {
                    setFormInput({
                      ...formInput,
                      vehicleModel: prop.target.value
                    })
                  }} required />
                </div>
                <div className='cc-div'>
                  <input type="text" placeholder='Cubic Capacity' onChange={(prop) => {
                    setFormInput({
                      ...formInput,
                      cubicCapacity: prop.target.value
                    })
                  }} required />
                </div>
                <div className='premium-div'>
                  <div className='premium'>
                    <p>Premium</p>
                  </div>
                  <div className='text'>
                    <p className='name-text'>
                      $ {formInput.insurancePremium}
                    </p>
                  </div>
                </div>
                <div className='fee'>Fee: $100</div>
                <div className='create' onClick={createHandler}>
                  {!isUploading &&
                    <p>Create</p>
                  }
                  {isUploading &&
                    <ClipLoader color="#ffffff" size={16} />
                  }
                </div>
              </Form>
            </>
          }
        </div>
      </div>
      <div className='right'>
        <div className='up'>
          <div className='have-pool' onClick={havePoolHandler}>
            <div className='text'>
              <p>Have Pool Address ?</p>
            </div>
          </div>
        </div>
        <div className='down'>
          {formHavePoolActive &&
            <>
              <div className='pool-name-div'>
                <input type="text" placeholder='Pool Address' id="Pid" onChange={(prop) => {
                  setPoolAddress(prop.target.value)
                }} />
                <div className='ok-button' onClick={checkPoolIdHandler}>
                  {!isChecking &&
                    <img src="/images/check.png" />
                  }
                  {isChecking &&
                    <ClipLoader color="#ffffff" size={16} />
                  }
                </div>
              </div>
              <Form>
                <div className='vehicle-model-div'>
                  <input type="text" placeholder='Vehicle Model' onChange={(prop) => {
                    setFormInput({
                      ...formInput,
                      vehicleModel: prop.target.value
                    })
                  }} />
                </div>
                <div className='cc-div'>
                  <input type="text" placeholder='Cubic Capacity' onChange={(prop) => {
                    setFormInput({
                      ...formInput,
                      cubicCapacity: prop.target.value
                    })
                  }} />
                </div>
                <div className='premium-div'>
                  <div className='premium'>
                    <p>Premium</p>
                  </div>
                  <div className='text'>
                    <p className='name-text'>
                      $ {formInput.insurancePremium}
                    </p>
                  </div>
                </div>
                <div className='fee'>Fee: $100</div>
                <div className='create' onClick={joinHandler} style={{
                  backgroundColor: formHavePoolActive ? '#181717' : '#0153b5'
                }}>
                  {!isUploading &&
                    <p>Join</p>
                  }
                  {isUploading &&
                    <ClipLoader color="#ffffff" size={16} />
                  }
                </div>
              </Form>
            </>
          }
        </div>
      </div>
    </Container>
  )
}

export default JoinCreate

const Container = styled.div`
    width: 100%;
    height: 95%;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    padding-top: 1rem;

    .left {
      margin-left: 1rem;
      flex: 1;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .up {
        margin-top: 1rem;
        height: 13rem;
        width: 65%;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid #0152b565;
        border-radius: 6px;
        background-color: #0152b515;

        .create-pool-button {
          width: 9.4rem;
          height: 2.1rem;
          display: flex;
          align-items: center;
          overflow: hidden;
          border-radius: 8px;
          background-color:  #0153b5;
          cursor: pointer;
          transition: opacity 0.15s;

          &:hover {
            opacity: 0.9;
          }

          &:active {
            opacity: 0.8;
          }

          .text {
            flex: 1;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            
            p {
              margin: 0;
              color: white;
            }
          }

          .logo-div {
            width: 2rem;
            height: 2rem;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-right: 0.rem;

            img {
              width: 50%;
              margin-left: -20px;
            }
          }
        }
      }

      .down {
        flex: 1;
        width: 65%;
        margin-top: 2rem;
        display: flex;
        flex-direction: column;
        align-items: center;

        .pool-name-div {
          width: 100%;
          height: 2.8rem;
          display: flex;
          justify-content: center;

          input {
            width: 99%;
            height: 2.4rem;
            outline: none;
            border-radius: 6px;
            border: 1px solid #0152b565;

            padding-left: 10px;
            font-size: 15px;
          }
        }
      }
    }

    .right {
      margin-right: 1rem;
      flex: 1;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .up {
        margin-top: 1rem;
        height: 13rem;
        width: 65%;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid #0152b565;
        border-radius: 6px;
        background-color: #0152b515;


        .have-pool {
          width: 10.9rem;
          height: 2.1rem;
          display: flex;
          align-items: center;
          overflow: hidden;
          border-radius: 8px;
          background-color:  #181717;
          cursor: pointer;
          transition: opacity 0.15s;

          &:hover {
            opacity: 0.9;
          }

          &:active {
            opacity: 0.8;
          }

          .text {
            flex: 1;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            
            p {
              margin: 0;
              color: white;
            }
          }

          .logo-div {
            width: 2rem;
            height: 2rem;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-right: 0.rem;

            img {
              width: 50%;
              margin-left: -20px;
            }
          }
        }
      }

      .down {
        flex: 1;
        width: 65%;
        margin-top: 2rem;
        display: flex;
        flex-direction: column;
        align-items: center;

      .pool-name-div {
        width: 100%;
        height: 2.3rem;
        display: flex;


        input {
          width: 99%;
          height: 2.4rem;
          outline: none;
          border-top-left-radius: 6px;
          border-bottom-left-radius: 6px;
          border: 1px solid #0152b565;
          outline: none;
          padding-left: 10px;
          font-size: 15px;
        }

        .ok-button {
          height: 2.55rem;
          width: 10%;
          border: 1px solid #0152b565;
          border-top-right-radius: 6px;
          border-bottom-right-radius: 6px;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #181717;
          transition: opacity 0.15s;

          img {
            width: 50%;
            opacity: 0.9;
          }

          &:hover {
            opacity: 0.9;
          }

          &:active {
            opacity: 0.8;
          }
        }
      }
    }

    }
`
const Form = styled.div`
  margin-top: 1.1rem;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 14.5rem;

  .vehicle-model-div {
    width: 100%;
    height: 2.8rem;
    display: flex;
    justify-content: center;

    input {
    width: 99%;
    height: 2.4rem;
    outline: none;
    border-radius: 6px;
    border: 1px solid #0152b565;
    padding-left: 10px;
    font-size: 15px;
    }
  }

  .cc-div {
    margin-top: 0.7rem;
    width: 100%;
    height: 2.8rem;
    display: flex;
    justify-content: center;

    input {
    width: 99%;
    height: 2.4rem;
    outline: none;
    border-radius: 6px;
    border: 1px solid #0152b565;
    padding-left: 10px;
    font-size: 15px;
    }
  }

  .premium-div {
    margin-top: 0.6rem;
    height: 2.4rem;
    display: flex;
    justify-content: start;
    align-items: center;
    border-radius: 6px;
    overflow: hidden;
    border: 1px solid #0152b546;

    .premium {
    width: 5.1rem;
    height: 100%;
    background-color: #0152b539;
    display: flex;
    justify-content: center;
    align-items: center;
    border-right: 1px solid #0152b546;

      p {
      font-size: 15px;
      margin-left: 3px;
      }
    }

    .text {
    flex: 1;
    display: flex;
    justify-content: start;
    align-items: center;

      p {
      margin:0;
      margin-left: 10px;
      font-size: 15px;
      }
    }       
  }

  .fee {
    margin-top: 0.5rem;
    font-size: 13px;
    margin-left: 3px;
  }

  .create {
    margin-top: 0.4rem;
    height: 2.5rem;
    width: 100%;
    border-radius: 6px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color:  #0153b5;
    transition: opacity 0.15s;
    cursor: pointer;

    p {
      margin: 0;
      color: white;
    }

    &:hover {
      opacity: 0.9;
    }

    &:active {
      opacity: 0.8;
    }
  }

`
import { React, useState, useEffect } from 'react'
import styled from 'styled-components'
import ClipLoader from "react-spinners/ClipLoader";
import { Web3Storage, File } from 'web3.storage/dist/bundle.esm.min.js';


function Claim() {

  const [isRequesting, setIsRequesting] = useState(false);
  const [poolAddress, setPoolAddress] = useState();
  const [documentURI, setDocumentURI] = useState();
  const [amount, setAmount] = useState();

  const requestHandler = () => {
    setIsRequesting(true);
  }


  /*-------------------IPFS code to upload support document -------------*/

  const web3StorageApiKey = process.env.REACT_APP_WEB3_STORAGE;

  const makeStorageClient = async () => {
    return new Web3Storage({ token: `${web3StorageApiKey}` })
  }

  const uploadHandler = async () => {
    const fileInput = document.getElementById('docs');
    const pathname = fileInput.files[0].name;
    const cid = await toIPFS(fileInput.files);

    if (cid.length) {
      toast.success("Uploaded to IPFS", {
        position: toast.POSITION.TOP_CENTER
      });
    } else {
      toast.error("IPFS upload failed!", {
        position: toast.POSITION.TOP_CENTER
      });
    }
    let uri = `https://ipfs.io/ipfs/${cid}/${pathname}`;
    console.log('doc uri : ', uri);
    setDocumentURI(uri);
  }

  const toIPFS = async (files) => {
    const client = makeStorageClient()
    const cID = await client.put(files)
    return cID;
  }

  /*-----------------------------------------------------------------------*/

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
             <input type="file" id="docs" onChange={uploadHandler} />
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
      <div className='right'></div>
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
      background-color: lightpink;
    }
`
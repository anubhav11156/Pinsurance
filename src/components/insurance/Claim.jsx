import {React, useState, useEffect } from 'react'
import styled from 'styled-components'
import ClipLoader from "react-spinners/ClipLoader";


function Claim() {

  const [isRequesing, setIsRequesing] = useState(false);


  const requesHandler = () => {

  }

  return (
    <Container>
      <div className='left'>
        <div className='main-container'>
          <div className='heading'>
            <p>Request for Claim</p>
          </div>
          <div className='pool-address'>
            <input type="text" placeholder='Pool Address'/>
          </div>
          <div className="upload-amount">
            <div className='amount-div'>
              <input type="text" placeholder='Claim amount'/>
            </div>
            <div className='upload-div'>
              <p>Upload support document</p>
            </div>
          </div>
          <div className='button' onClick={requesHandler}>
            <p>Request</p>
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
        height: 34%;
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
          margin-top: 1rem;
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
            cursor: pointer;

            &:hover {
              opacity: 0.9;
            }

            &:active {
              opacity: 0.8;
            }

            p {
              margin: 0;
              color: white;
              font-size: 14px;
            }
          }

        }

        .button {
          margin-top: 1rem;
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
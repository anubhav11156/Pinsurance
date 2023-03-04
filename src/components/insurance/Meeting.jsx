import { React, useState } from 'react'
import styled from 'styled-components'
import { HuddleIframe } from "@huddle01/huddle01-iframe";
import { useAccount } from 'wagmi'

function Meeting() {

  const [meetingActive, setMeetingActive] = useState(false)
  const {address} = useAccount();

  const shortAddress = address.slice(0,10);
 
  const iframeConfig = {
    roomUrl: `https://iframe.huddle01.com/pinsurance-${shortAddress}`,
    height: "100%",
    width: "100%",
    noBorder: true,
  };

  return (
    <Container>
      <div className='huddle-container'>
        {meetingActive &&
          <HuddleIframe config={iframeConfig} />

        }
        {!meetingActive &&
          <div className='button' onClick={() => {
            setMeetingActive(true);
          }}>
            <p>Meeting</p>
          </div>
        }
      </div>
    </Container>
  )
}

export default Meeting

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  
  .huddle-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;

    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    overflow: hidden;

    .button {
      width: 8rem;
      height: 2rem;
      background-color: #0152b5cc;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 4px;
      cursor: pointer;
      transition: opacity 0.15s;

      &:hover {
        opacity: 0.9;
      }

      &:active {
        opacity: 0.8;
      }

      p {
        margin: 0;
        color: white;
        font-size: 18px;
      }
    }
  }
`
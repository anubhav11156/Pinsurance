import {React, useState} from 'react'
import styled from 'styled-components'
import { ConnectKitButton } from "connectkit";

function Header() {

  const [isConnected, setConnected] = useState(false);

  return (
    <Container>
      
        <ConnectKitButton.Custom>
          {
            ({ isConnected, show, ensName }) => {
              console.log("testing",isConnected);
              if(isConnected){
                setConnected(true);
              }else{
                setConnected(false);
              }

              return (
                <div className="login" onClick={show}>
                  {isConnected ? ensName ?? "SignOut" : "SignIn"}
                </div>
              );
            }
          }
        </ConnectKitButton.Custom>
    </Container>
  )
}

export default Header

const Container=styled.div`
    height: 4.5rem;
    border-bottom: 1px solid black;
    display: flex;
    justify-content: center;
    align-items: center;
    
    .login {
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid black;
    width: 100px;
    height: 2.4rem;
    cursor: pointer;
    position: relative;
    font-size: 17px;
    font-weight: 500;
  }
`
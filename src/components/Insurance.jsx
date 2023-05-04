import { React, useEffect, useState } from "react";
import styled from "styled-components";
import Claim from "./insurance/Claim";
import JoinCreate from "./insurance/JoinCreate";
import Pool from "./insurance/Pool";
import User from "./insurance/User";
import Notification from "./insurance/Notification";
import { useAccount } from "wagmi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PolicyNFTs from "./insurance/PolicyNFTs";
import Meeting from "./insurance/Meeting";

function Insurance() {
  const [userMenu, setUserMenu] = useState(false);
  const [joinMenu, setJoinMenu] = useState(false);
  const [poolMenu, setPoolMenu] = useState(false);
  const [claimMenu, setClaimMenu] = useState(false);
  const [notificationMenu, setNotificationMenu] = useState(false);
  const [meetingMenu, setMeetingMenu] = useState(false);
  const [nftMenu, setNftMenu] = useState(false);

  const { isConnected } = useAccount();

  useEffect(() => {
    if (!isConnected) {
      setUserMenu(false);
      setJoinMenu(false);
      setPoolMenu(false);
      setClaimMenu(false);
      setNotificationMenu(false);
      setMeetingMenu(false);
      setNftMenu(false);
    } else {
      setUserMenu(true);
    }
  }, [isConnected]);

  const userMenuButton = () => {
    if (isConnected) {
      setUserMenu(true);
      setJoinMenu(false);
      setPoolMenu(false);
      setClaimMenu(false);
      setNotificationMenu(false);
      setMeetingMenu(false);
      setNftMenu(false);
    }
  };

  const joinCreateButton = () => {
    if (isConnected) {
      setUserMenu(false);
      setJoinMenu(true);
      setPoolMenu(false);
      setClaimMenu(false);
      setNotificationMenu(false);
      setMeetingMenu(false);
      setNftMenu(false);
    }
  };

  const poolDetail = () => {
    if (isConnected) {
      setUserMenu(false);
      setJoinMenu(false);
      setPoolMenu(true);
      setClaimMenu(false);
      setNotificationMenu(false);
      setMeetingMenu(false);
      setNftMenu(false);
    }
  };

  const requestClaim = () => {
    if (isConnected) {
      setUserMenu(false);
      setJoinMenu(false);
      setPoolMenu(false);
      setClaimMenu(true);
      setNotificationMenu(false);
      setMeetingMenu(false);
      setNftMenu(false);
    }
  };

  const notifications = () => {
    if (isConnected) {
      setUserMenu(false);
      setJoinMenu(false);
      setPoolMenu(false);
      setClaimMenu(false);
      setNotificationMenu(true);
      setMeetingMenu(false);
      setNftMenu(false);
    }
  };

  const scheduleMeeting = () => {
    if (isConnected) {
      setUserMenu(false);
      setJoinMenu(false);
      setPoolMenu(false);
      setClaimMenu(false);
      setNotificationMenu(false);
      setMeetingMenu(true);
      setNftMenu(false);
    }
  };

  const nftButton = () => {
    if (isConnected) {
      setUserMenu(false);
      setJoinMenu(false);
      setPoolMenu(false);
      setClaimMenu(false);
      setNotificationMenu(false);
      setMeetingMenu(false);
      setNftMenu(true);
    }
  };

  const connectWalletHandle = () => {
    toast.info("Login to connect wallet", {
      position: toast.POSITION.TOP_CENTER,
    });
  };

  return (
    <Container>
      <Main>
        <Heading>
          <div className='menu'>
            <div className='user-menu'>
              <div className='image'>
                <img src='/images/user.png' onClick={userMenuButton} />
                <div className='account'>Account</div>
              </div>
              <div
                className='bar'
                style={{
                  backgroundColor: userMenu ? "#ffffffae" : "",
                }}
              ></div>
            </div>
            <div className='nft-menu'>
              <div className='image'>
                <img src='/images/policy-nft-1.png' onClick={nftButton} />
                <div className='nft'>Policy NFT</div>
              </div>
              <div
                className='bar'
                style={{
                  backgroundColor: nftMenu ? "#ffffffae" : "",
                }}
              ></div>
            </div>
            <div className='join-menu'>
              <div className='image'>
                <img src='/images/join.png' onClick={joinCreateButton} />
                <div className='join'>Join or Create Pool</div>
              </div>
              <div
                className='bar'
                style={{
                  backgroundColor: joinMenu ? "#ffffffae" : "",
                }}
              ></div>
            </div>
            <div className='pool-menu'>
              <div className='image'>
                <img src='/images/details.png' onClick={poolDetail} />
                <div className='pool'>Pool Detail</div>
              </div>
              <div
                className='bar'
                style={{
                  backgroundColor: poolMenu ? "#ffffffae" : "",
                }}
              ></div>
            </div>
            <div className='claim-menu'>
              <div className='image'>
                <img src='/images/claim.png' onClick={requestClaim} />
                <div className='claim'>Request Claim</div>
              </div>
              <div
                className='bar'
                style={{
                  backgroundColor: claimMenu ? "#ffffffae" : "",
                }}
              ></div>
            </div>
            <div className='notification-menu'>
              <div className='image'>
                <img src='/images/notification.png' onClick={notifications} />
                <div className='notification'>Notifications</div>
              </div>
              <div
                className='bar'
                style={{
                  backgroundColor: notificationMenu ? "#ffffffae" : "",
                }}
              ></div>
            </div>
            <div className='meeting-menu'>
              <div className='image'>
                <img src='/images/video.png' onClick={scheduleMeeting} />
                <div className='meeting'>Join or Create Meeting</div>
              </div>
              <div
                className='bar'
                style={{
                  backgroundColor: meetingMenu ? "#ffffffae" : "",
                }}
              ></div>
            </div>
          </div>
        </Heading>
        <Sections>
          {isConnected && (
            <>
              {userMenu && <User />}
              {nftMenu && <PolicyNFTs />}
              {poolMenu && <Pool />}
              {claimMenu && <Claim />}
              {joinMenu && <JoinCreate />}
              {notificationMenu && <Notification />}
              {meetingMenu && <Meeting />}
            </>
          )}
          {!isConnected && (
            <PlaceHolder>
              <div className='div-1'>
                <div className='text'>
                  <p>Create or Join Insurnace Pools with your Peers.</p>
                </div>
                <div className='for-button'>
                  <div className='connect' onClick={connectWalletHandle}>
                    Connect Wallet
                  </div>
                </div>
              </div>
            </PlaceHolder>
          )}
        </Sections>
      </Main>
      <ToastContainer autoClose={1000} hideProgressBar={true} />
    </Container>
  );
}

export default Insurance;

const Container = styled.div`
  flex: 1;
  padding-left: 13.2rem;
  padding-right: 12rem;
  display: flex;
  justify-content: center;
  margin-top: 10px;
  overflow: hidden;
  .Toastify__toast {
    border: 1px solid #0152b58e;
  }
`;

const Main = styled.div`
  height: 865px;
  width: 100%;
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Heading = styled.div`
  height: 5.2rem;
  width: 100%;
  border: 1px solid #0152b5cc;
  background-color: #0152b5cc;
  overflow: hidden;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;

  .menu {
    margin-top: 0px;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    overflow: hidden;

    .user-menu,
    .pool-menu,
    .join-menu,
    .notification-menu,
    .meeting-menu,
    .claim-menu,
    .nft-menu {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;

      .image {
        position: relative;
        flex: 1;
        width: 15%;
        display: flex;
        align-items: end;
        justify-content: center;
        cursor: pointer;
        transition: opacity 0.25s;

        .account {
          position: absolute;
          height: 1.5rem;
          width: 5rem;
          top: 2.2rem;
          background-color: #000000;
          font-size: 14px;
          color: white;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 5px;
          opacity: 0;
          z-index: 1000;
          transition: opacity 0.2s;
        }

        &:hover .account {
          opacity: 1;
        }

        &:hover {
          opacity: 0.8;
        }

        img {
          width: 100%;
          opacity: 0.9;
        }
      }

      .bar {
        margin-top: 3px;
        height: 0.2rem;
        width: 13%;
        border-radius: 10px;
      }
    }

    .join-menu {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;

      .image {
        position: relative;
        flex: 1;
        width: 15%;
        display: flex;
        align-items: end;
        justify-content: center;
        cursor: pointer;
        transition: opacity 0.25s;

        .join {
          position: absolute;
          height: 1.5rem;
          width: 9.3rem;
          top: 2.2rem;
          background-color: #000000;
          font-size: 14px;
          color: white;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 5px;
          opacity: 0;
          z-index: 1000;
          transition: opacity 0.2s;
        }

        &:hover .join {
          opacity: 1;
        }

        &:hover {
          opacity: 0.8;
        }

        img {
          width: 100%;
          opacity: 0.9;
        }
      }

      .bar {
        margin-top: 3px;
        height: 0.2rem;
        width: 13%;
        border-radius: 10px;
      }
    }

    .pool-menu {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 2px;

      .image {
        flex: 1;
        width: 12%;
        display: flex;
        align-items: end;
        justify-content: center;
        cursor: pointer;
        transition: opacity 0.25s;

        .pool {
          position: absolute;
          height: 1.5rem;
          width: 6.2rem;
          top: 2rem;
          background-color: #000000;
          font-size: 14px;
          color: white;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 5px;
          opacity: 0;
          z-index: 1000;
          transition: opacity 0.2s;
        }

        &:hover .pool {
          opacity: 1;
        }

        &:hover {
          opacity: 0.8;
        }

        img {
          width: 100%;
          opacity: 0.9;
        }
      }

      .bar {
        margin-top: 4px;
        height: 0.2rem;
        width: 13%;
        border-radius: 10px;
      }
    }

    .notification-menu {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;

      .image {
        margin-top: 5px;
        flex: 1;
        width: 12%;
        display: flex;
        align-items: end;
        justify-content: center;
        cursor: pointer;
        transition: opacity 0.25s;

        .notification {
          position: absolute;
          height: 1.5rem;
          width: 7rem;
          top: 2rem;
          background-color: #000000;
          font-size: 14px;
          color: white;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 5px;
          opacity: 0;
          z-index: 1000;
          transition: opacity 0.2s;
        }

        &:hover .notification {
          opacity: 1;
        }

        &:hover {
          opacity: 0.8;
        }

        img {
          width: 100%;
          opacity: 0.9;
        }
      }

      .bar {
        margin-top: 7px;
        height: 0.2rem;
        width: 13%;
        border-radius: 10px;
      }
    }

    .claim-menu {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 5px;

      .image {
        flex: 1;
        width: 12.5%;
        display: flex;
        align-items: end;
        justify-content: center;
        cursor: pointer;
        transition: opacity 0.25s;

        .claim {
          position: absolute;
          height: 1.5rem;
          width: 7.5rem;
          top: 2rem;
          background-color: #000000;
          font-size: 14px;
          color: white;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 5px;
          opacity: 0;
          z-index: 1000;
          transition: opacity 0.2s;
        }

        &:hover .claim {
          opacity: 1;
        }

        &:hover {
          opacity: 0.8;
        }

        img {
          width: 100%;
          opacity: 0.9;
        }
      }

      .bar {
        margin-top: 5px;
        height: 0.2rem;
        width: 13.5%;
        border-radius: 10px;
      }
    }

    .meeting-menu {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 2px;
      .image {
        margin-top: 5px;
        flex: 1;
        width: 12%;
        display: flex;
        align-items: end;
        justify-content: center;
        cursor: pointer;
        transition: opacity 0.25s;

        .meeting {
          position: absolute;
          height: 1.5rem;
          width: 11rem;
          top: 1.9rem;
          background-color: #000000;
          font-size: 14px;
          color: white;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 5px;
          opacity: 0;
          z-index: 1000;
          transition: opacity 0.2s;
        }

        &:hover .meeting {
          opacity: 1;
        }

        &:hover {
          opacity: 0.8;
        }

        img {
          width: 100%;
          opacity: 0.9;
        }
      }

      .bar {
        margin-top: 4px;
        height: 0.2rem;
        width: 13%;
        border-radius: 10px;
      }
    }

    .nft-menu {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 2px;

      .image {
        flex: 1;
        width: 14%;
        display: flex;
        align-items: end;
        justify-content: center;
        cursor: pointer;
        transition: opacity 0.25s;

        .nft {
          position: absolute;
          height: 1.5rem;
          width: 6.2rem;
          top: 2rem;
          background-color: #000000;
          font-size: 14px;
          color: white;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 5px;
          opacity: 0;
          z-index: 1000;
          transition: opacity 0.2s;
        }

        &:hover .nft {
          opacity: 1;
        }

        &:hover {
          opacity: 0.8;
        }

        img {
          width: 100%;
          opacity: 0.9;
        }
      }

      .bar {
        margin-top: 4px;
        height: 0.2rem;
        width: 13%;
        border-radius: 10px;
      }
    }
  }
`;

const PlaceHolder = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;

  .div-1 {
    /* border: 1px solid black; */
    margin-left: 26px;
    margin-right: 30px;
    width: 70%;
    height: 70%;
    /* background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='29' ry='29' stroke='%238347E5FF' stroke-width='3' stroke-dasharray='14' stroke-dashoffset='5' stroke-linecap='round'/%3e%3c/svg%3e"); */
    background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='29' ry='29' stroke='%230152B5CC' stroke-width='3' stroke-dasharray='6%2c 14' stroke-dashoffset='5' stroke-linecap='square'/%3e%3c/svg%3e");
    border-radius: 13px;
    border-radius: 29px;
    background-color: #0152b512;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;

    .text {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;

      p {
        margin-top: 8.3rem;
        height: 4rem;
        width: 20rem;
        font-weight: 400;
        font-size: 25px;
        text-align: center;
        color: #0152b5e4;
      }
    }

    .for-button {
      flex: 1;
      display: flex;
      align-items: start;

      .connect {
        margin-top: 10px;
        width: 9rem;
        height: 2.2rem;
        background-color: #0152b5cc;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 8px;
        cursor: pointer;
        color: white;
        font-size: 15px;

        &:hover {
          opacity: 0.9;
        }

        &:active {
          opacity: 0.85;
        }
      }
    }
  }
`;

const Sections = styled.div`
  flex: 1;
  border-bottom: 1px solid #0152b56e;
  border-right: 1px solid #0152b56e;
  border-left: 1px solid #0152b56e;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
`;

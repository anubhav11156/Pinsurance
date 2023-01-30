import { React, useState } from 'react'
import styled from 'styled-components'

function Insurance() {

  const [userMenu, setUserMenu] = useState(true);
  const [joinMenu, setJoinMenu] = useState(false);
  const [poolMenu, setPoolMenu] = useState(false);
  const [claimMenu, setClaimMenu] = useState(false);
  const [notificationMenu, setNotificationMenu] = useState(false);
  const [meetingMenu,setMeetingMenu] = useState(false);


  const userMenuButton = () => {
    setUserMenu(true);
    setJoinMenu(false);
    setPoolMenu(false);
    setClaimMenu(false);
    setNotificationMenu(false);
    setMeetingMenu(false);
  }

  const joinCreateButton = () => {
    setUserMenu(false);
    setJoinMenu(true);
    setPoolMenu(false);
    setClaimMenu(false);
    setNotificationMenu(false);
    setMeetingMenu(false);
  }

  const poolDetail = () => {
    setUserMenu(false);
    setJoinMenu(false);
    setPoolMenu(true);
    setClaimMenu(false);
    setNotificationMenu(false);
    setMeetingMenu(false);
  }

  const requestClaim = () => {
    setUserMenu(false);
    setJoinMenu(false);
    setPoolMenu(false);
    setClaimMenu(true);
    setNotificationMenu(false);
    setMeetingMenu(false);
  }

  const notifications = () => {
    setUserMenu(false);
    setJoinMenu(false);
    setPoolMenu(false);
    setClaimMenu(false);
    setNotificationMenu(true);
    setMeetingMenu(false);
  }

  const scheduleMeeting = () => {
    setUserMenu(false);
    setJoinMenu(false);
    setPoolMenu(false);
    setClaimMenu(false);
    setNotificationMenu(false);
    setMeetingMenu(true);
  }

  return (
    <Container>
      <Main>
        <Heading>
          <div className='menu'>
            <div className='user-menu'>
              <div className='image'>
                <img src="/images/user.png" onClick={userMenuButton} />
              </div>
              <div className='bar' style={{
                backgroundColor: userMenu ? "#ffffffae" : ""
              }}></div>
            </div>
            <div className='join-menu'>
              <div className='image'>
                <img src="/images/join.png" onClick={joinCreateButton} />
              </div>
              <div className='bar' style={{
                backgroundColor: joinMenu ? "#ffffffae" : ""
              }}></div>
            </div>
            <div className='pool-menu'>
              <div className='image'>
                <img src="/images/details.png" onClick={poolDetail} />
              </div>
              <div className='bar' style={{
                backgroundColor: poolMenu ? "#ffffffae" : ""
              }}></div>
            </div>
            <div className='claim-menu'>
              <div className='image'>
                <img src="/images/claim.png" onClick={requestClaim} />
              </div>
              <div className='bar' style={{
                backgroundColor: claimMenu ? "#ffffffae" : ""
              }}></div>
            </div>
            <div className='notification-menu'>
              <div className='image'>
                <img src="/images/notification.png" onClick={notifications} />
              </div>
              <div className='bar' style={{
                backgroundColor: notificationMenu ? "#ffffffae" : ""
              }}></div>
            </div>
            <div className='meeting-menu'>
              <div className='image'>
                <img src="/images/video.png" onClick={scheduleMeeting} />
              </div>
              <div className='bar' style={{
                backgroundColor: meetingMenu ? "#ffffffae" : ""
              }}></div>
            </div>
          </div>
        </Heading>
        <Sections>
          all section will be rendered here based on condition
        </Sections>
      </Main>
    </Container>
  )
}

export default Insurance

const Container = styled.div`
    flex: 1;
    border-bottom: 1px solid black;
    padding-left: 13.2rem;
    padding-right: 12rem;
    display: flex;
    justify-content: center;
    margin-top: 10px;
`

const Main = styled.div`
    height:865px;
    width: 100%;
    margin-top:40px ;
    display: flex;
    flex-direction: column;
    overflow: hidden;
`

const Heading = styled.div`
  height: 5.2rem;
  width: 100%;
  border: 1px solid #0152b5cc;
  background-color: #0152b5cc;
  overflow: hidden;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;

  .menu {
    margin-top: 3px;
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
    .claim-menu {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;

      .image {
        flex:1;
        width: 15%;
        display: flex;
        align-items: end;
        justify-content: center;
        cursor: pointer;
        transition: opacity 0.25s;

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
        flex:1;
        width: 12%;
        display: flex;
        align-items: end;
        justify-content: center;
        cursor: pointer;
        transition: opacity 0.25s;

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
        flex:1;
        width: 12%;
        display: flex;
        align-items: end;
        justify-content: center;
        cursor: pointer;
        transition: opacity 0.25s;

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
        flex:1;
        width: 12.5%;
        display: flex;
        align-items: end;
        justify-content: center;
        cursor: pointer;
        transition: opacity 0.25s;

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
        flex:1;
        width: 12%;
        display: flex;
        align-items: end;
        justify-content: center;
        cursor: pointer;
        transition: opacity 0.25s;

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
`

const Sections = styled.div`
  flex: 1;
  border-bottom: 1px solid #0152b56e;
  border-right: 1px solid #0152b56e;
  border-left: 1px solid #0152b56e;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
`
import {useState, useEffect, React} from 'react'
import styled from 'styled-components';
import { ethers } from 'ethers';
import axios from "axios";

function RequestCard(props) {

    const[userMetaData, setUserMetaData] = useState({
        name:"",
        profileURI:""
    });

    useEffect(() => {
        fetchUserMetaData()
    },[props.userAddress]);

    const fetchUserMetaData = async () => {
        const uriResponse = await axios.get(props.userMetaURI);
        setUserMetaData({
            ...userMetaData,
            name:uriResponse.data.name,
            profileURI:uriResponse.data.profileURI
        })
    }

    return (
        <Container>
            <div className='left'>
                <div className='profile-image'>
                    <img src={userMetaData.profileURI} />
                </div>
            </div>
            <div className='right'>
                <div className='detail-container'>
                    <div className='name-div'>
                        <p>{userMetaData.name}</p>
                        <div className='stake-div'>
                            <div className='staked'>
                                <p>{props.userAddress}</p>
                            </div>
                        </div>
                    </div>
                    <div className='pool-div'>
                        <div className='pool-label'>
                            <p>Pool</p>
                        </div>
                        <div className='pool-name'>
                            <p>{props.poolName}</p>
                        </div>
                        <div className='pool-address'>
                            <p>{props.poolAddress}</p>
                        </div>
                    </div>
                    <div className='meta-div'>
                        <div className='premium-div'>
                            <div className='logo-div'>
                                <img src='/images/usdc-logo.svg' />
                            </div>
                            <div className='email'>
                                <p>{props.claimAmount}</p>
                            </div>
                        </div>
                        <a href={props.docURI} target="_blank" className='doc-div'>
                           <p>Show support document</p>
                           <div className='logo-div'>
                                <img src="images/link.png"/>
                           </div>
                        </a>
                        <div className='buttons-div'>
                           <div className='approve-div'>
                                <p>Approve</p>
                           </div>
                           <div className='decline-div'>
                                <p>Decline</p>
                           </div>
                        </div>

                    </div>
                </div>
            </div>
        </Container>
    )
}

export default RequestCard

const Container = styled.div`
    height: 9rem;
    width: 100%;
    margin-bottom: 2rem;
 
    background-color: #0152b515;
    border-radius: 8px;
    border: 1px solid #0152b546;
    overflow: hidden;
    color: #202020fb;

    display: flex;
    justify-content: center;
    align-items: center;

    .left {
        width: 9rem;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;

        .profile-image {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 6.5rem;
            height: 6.5rem;
            border-radius: 3px;
            border: 1px solid black;
            overflow: hidden;
            
            img {
                width: 100%;
            }
        }
    }

    .right {
      flex: 1;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;

      .detail-container {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 7rem;
        gap: 7px;

        .pool-div {
            height: 1.8rem;
            width: 98.5%;
            display: flex;
            align-items: center;
            border: 1px solid white;
            background-color: #ffffff83;
            border-radius: 3px;
            overflow: hidden;

            .pool-label {
                height: 100%;
                width: 3rem;
                /* border: 1px solid #0152b546; */
                /* border-right: 2px solid white; */
                display: flex;
                justify-content: center;
                align-items: center;
                background-color:  #0152b546;

                p {
                    margin: 0;
                }
            }

            .pool-name {
                height: 100%;
                width: 53.5rem;
                display: flex;
                justify-content: start;
                align-items: center;

                p {
                    margin: 0;
                    margin-left: 10px;
                }
            }

            .pool-address {
                flex: 1;
                height: 90%;
                display: flex;
                justify-content: start;
                align-items: center;
                background-color: #0152b546 ;
                margin-right: 15px;
                border-radius: 3px;

                p {
                    margin: 0;
                    margin-left: 10px;
                    font-size: 15px;
                }
            }
        }

        .name-div {
            height: 2.5rem;
            width: 98.5%;
            display: flex;
            justify-content: start;
            align-items: center;
            border: 1px solid white;
            background-color: #ffffff83;
            border-radius: 3px;


            p {
                flex:1;
                margin: 0;
                margin-left: 10px;
                font-size: 25px;
            }

            .stake-div {
                width: 26rem;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;

                .staked {
                    width: 24rem;
                    height: 1.5rem;
                    border: 1px solid #0152b546;
                    border-radius: 3px;
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    p {
                        margin: 0;
                        margin-left: 13px;
                        font-size: 15px;
                        
                    }
                }
            }
        }

        .meta-div {
            height: 1.8rem;
            width: 98.5%;
            display: flex;
            align-items: center;
            gap: 7px;

            .premium-div {
                /* margin-left: 10px; */
                flex:1;
                height: 100%;
                border-radius: 3px;
                display: flex;
                justify-content:start;
                align-items: center;
                overflow: hidden;
                background-color: #ffffff83;
                border: 1px solid white;

                .logo-div {
                    width: 3rem;
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border-right: 2px solid white;
                    background-color:  #0152b546;


                    img {
                        width: 40%;
                    }
                }

                .email {
                    display: flex;
                    justify-content: start;
                    align-items: center;
                    p {
                        margin: 0;
                        font-size: 15px;
                        margin-left: 8px;
                    }
                }
            }

            .doc-div {
                flex:1;
                height: 100%;
                border-radius: 4px;
                display: flex;
                justify-content:center;
                align-items: center;
                overflow: hidden;
                text-decoration: none;
                background-color: #0152b5cc;
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
                    font-size: 15px;
                }

                .logo-div {
                    margin-left: 5px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 2.4rem;
                    width: 2.4rem;

                    img {
                        width: 50%;
                    }
                }
               
            }

            .buttons-div {
                flex:1;
                height: 100%;
                border-radius: 3px;
                display: flex;
                justify-content:center;
                align-items: center;
                gap: 1rem;
                overflow: hidden;
                background-color: #ffffff83;
                border: 1px solid white;

                .approve-div {
                    margin-left: 10px;
                    width: 11.5rem;
                    height: 89%;
                    border-radius: 3px;
                    background-color: green;
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

                    p {
                        margin: 0;
                        color: white;
                        font-size: 15px;
                    }
                }

                .decline-div {
                    width: 11.5rem;
                    height: 89%;
                    border-radius: 3px;
                    background-color: #b40e0ee4;
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
                    p {
                        margin: 0;
                        color: white;
                        font-size: 15px;
                    }
                }
            }
        }
      }
    }
`
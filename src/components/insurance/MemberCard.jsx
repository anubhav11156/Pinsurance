import {React, useState, useEffect} from 'react'
import styled from 'styled-components'
import axios from "axios";
import { ethers } from "ethers"
import { pinsuranceContractAddress, mockUsdcContractAddress, pinsuranceAbi, poolAbi, mockUsdcAbi } from "../../config";


function MemberCard({poolAddress, userAddress, userURI}) {

    const [haveStaked, setHaveStaked] = useState(false);
    const [userData, setUserData] = useState({
        name:"",
        email:"",
        profileUri:"",
    });
    const [userPolicyData, setUserPolicyData] = useState({
        premium:"",
        vehicle:"",
        cubicCapacity:"",
    })

    useEffect(() => {
        fetchUserMetaData();
        getMetaData();
        fetchStakeStatus();
    },[poolAddress])

    const fetchUserMetaData = async () => {
        const uriResponse = await axios.get(userURI);
        setUserData({
            ...userData,
            name:uriResponse.data.name,
            email:uriResponse.data.email,
            profileUri:uriResponse.data.profileURI,
        })
    }

    const getMetaData = async () => {
        const provider = new ethers.providers.JsonRpcProvider('https://endpoints.omniatech.io/v1/fantom/testnet/public');
        const poolContract = new ethers.Contract(
            poolAddress,
            poolAbi.abi,
            provider
        )
        try {
            await poolContract.getUserMetadatURI(userAddress)
                .then((response) => {
                    fetchInfoFromURI(response)
                })
        } catch (error) {
            console.log(error);
        }
    }

    const fetchInfoFromURI = async (uri) => {
        const uriResponse = await axios.get(uri);
        setUserPolicyData({
            ...userPolicyData,
            premium: uriResponse.data.insurancePremium,
            vehicle: uriResponse.data.vehicleModel,
            cubicCapacity: uriResponse.data.cubicCapacity
        })
    }

    const fetchStakeStatus = async () => {
        const provider = new ethers.providers.JsonRpcProvider('https://endpoints.omniatech.io/v1/fantom/testnet/public');
        const poolContract = new ethers.Contract(
            poolAddress,
            poolAbi.abi,
            provider
        )
        try {
            await poolContract.getStakeStatus(userAddress)
                .then((response) => {
                    setHaveStaked(response)
                })
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Container>
            <div className='left'>
                <div className='profile-image'>
                    <img src={userData.profileUri} />
                </div>
            </div>
            <div className='right'>
                <div className='detail-container'>
                    <div className='name-div'>
                        <p>{userData.name}</p>
                        <div className='stake-div'>
                           { haveStaked &&
                                <div className='staked'>
                                    <p>Staked</p>
                                </div>
                           }
                           { !haveStaked &&
                                <div className='notStaked'>
                                    <p>Not staked</p>
                                </div>

                           }
                        </div>
                    </div>
                    <div className='address-div'>
                        <div className='address'>
                            <p>{userAddress}</p>
                        </div>
                    </div>
                    <div className='meta-div'>
                        <div className='email-div'>
                            <div className='logo-div'>
                                <img src='/images/gmail.png' />
                            </div>
                            <div className='email'>
                                <p>{userData.email}</p>
                            </div>
                        </div>
                        <div className='premium-div'>
                            <div className='logo-div'>
                                <img src='/images/usdc-logo.svg' />
                            </div>
                            <div className='email'>
                                <p>{userPolicyData.premium}</p>
                            </div>
                        </div>
                        <div className='vehicle-div'>
                            <div className='logo-div'>
                                <img src='/images/car.png' />
                            </div>
                            <div className='email'>
                                <p>{userPolicyData.vehicle}</p>
                            </div>
                        </div>
                        <div className='cc-div'>
                            <div className='logo-div'>
                                <img src='/images/engine.png' />
                            </div>
                            <div className='email'>
                                <p>{userPolicyData.cubicCapacity}</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </Container>
    )
}

export default MemberCard

const Container = styled.div`
    height: 98.7%;
    width: 99%;
    border-radius:5px;
    border: 1px solid #0152b565;
    background-color: #0152b51f;
    display: flex;
    justify-content: center;
    align-items: center;

    .left {
        width: 7rem;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;

        .profile-image {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 5rem;
            height: 5rem;
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
        height: 5rem;
        gap: 7px;
        .address-div {
            height: 1.5rem;
            width: 98.5%;
            display: flex;
            align-items: center;
            border: 1px solid white;
            background-color: #ffffff83;
            border-radius: 3px;

            .address {
                flex: 1;
                height: 100%;
                display: flex;
                justify-content: start;
                align-items: center;

                p {
                    margin: 0;
                    margin-left: 10px;
                    font-size: 15px;
                }
            }
        }

        .name-div {
            flex:1.2;
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
                font-size: 24px;
            }

            .stake-div {
                width: 8rem;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;

                .staked {
                    margin-left: 20px;
                    width: 4rem;
                    height: 1rem;
                    background-color: #008000ca;
                    border-radius: 3px;
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    p {
                        margin: 0;
                        margin-left: 13px;
                        font-size: 11px;
                        color: white
                    }
                }

                .notStaked {
                    margin-left: 20px;
                    width: 5rem;
                    height: 1rem;
                    background-color: #be1717ce;
                    border-radius: 3px;
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    p {
                        margin: 0;
                        margin-left: 13px;
                        font-size: 11px;
                        color: white
                    }
                }
            }
        }

        .meta-div {
            height: 1.5rem;
            width: 98.5%;
            display: flex;
            align-items: center;
            gap: 7px;

            .email-div,
            .premium-div,
            .vehicle-div,
            .cc-div {
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
                    width: 2rem;
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border-right: 2px solid white;

                    img {
                        width: 50%;
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
        }
      }
    }
`
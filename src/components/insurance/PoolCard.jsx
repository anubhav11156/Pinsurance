import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import copy from 'copy-to-clipboard';
import { poolAbi } from "../../config";
import { useAccount } from 'wagmi'
import { ethers } from "ethers"
import axios from "axios";

function PoolCard(props) {

    console.log('testing : ', props);

    const { address } = useAccount();

    const [poolDetail, setPoolDetail] = useState({
        balance: "",
        premium: "",
        memberCount: "",
        vehicle: "",
        cubicCapacity: "",
        name:""
    })

    const copyAddress = () => {
        copy(props.poolAddress);
    }

    useEffect(() => {
        getMetaData()
        getPoolBalance()
        getName()
        getDetail()
    },[props.poolAddress])



    /*--------------------Fetch pool metadata-------------------*/

    const getMetaData = async () => {
        const provider = new ethers.providers.JsonRpcProvider('https://filecoin-hyperspace.chainstacklabs.com/rpc/v1');
        const poolContract = new ethers.Contract(
            props.poolAddress,
            poolAbi.abi,
            provider
        )
        try {
            await poolContract.getUserMetadatURI(address)
                .then((response) => {
                    fetchInfoFromURI(response)
                })
        } catch (error) {
            console.log(error);
        }
    }

    const fetchInfoFromURI = async (uri) => {
        const uriResponse = await axios.get(uri);
        setPoolDetail({
            ...poolDetail,
            premium: uriResponse.data.insurancePremium,
            vehicle: uriResponse.data.vehicleModel,
            cubicCapacity: uriResponse.data.cubicCapacity
        })
    }

    /*-----------------------------------------------------------*/

    /*---------------------get pool balance----------------------*/

    const getPoolBalance = async () => {
        const provider = new ethers.providers.JsonRpcProvider('https://filecoin-hyperspace.chainstacklabs.com/rpc/v1');
        const poolContract = new ethers.Contract(
            props.poolAddress,
            poolAbi.abi,
            provider
        )
        try {
            await poolContract.getBalance()
                .then((response) => {
                    console.log('bal : ', response);
                    setPoolDetail({
                        ...poolDetail,
                        balance: response
                    })
                })
        } catch (error) {
            console.log(error);
        }
    }

    /*-----------------------------------------------------------*/

    /*---------------------get pool name------------------------*/

    const getName = async () => {
        const provider = new ethers.providers.JsonRpcProvider('https://filecoin-hyperspace.chainstacklabs.com/rpc/v1');
        const poolContract = new ethers.Contract(
            props.poolAddress,
            poolAbi.abi,
            provider
        )
        try {
            await poolContract.getPoolName()
                .then((response) => {
                    console.log('name : ', response);
                    setPoolDetail({
                        ...poolDetail,
                        name: response
                    })
                })
        } catch (error) {
            console.log(error);
        }
    }

    /*-----------------------------------------------------------*/

    /*------------------------get Pool detail -------------------*/

    const getDetail = async () => {
        const provider = new ethers.providers.JsonRpcProvider('https://filecoin-hyperspace.chainstacklabs.com/rpc/v1');
        const poolContract = new ethers.Contract(
            props.poolAddress,
            poolAbi.abi,
            provider
        )
        try {
            await poolContract.getPoolDetail()
                .then((response) => {
                    console.log('pool detail : ', response);
                })
        } catch (error) {
            console.log(error);
        }
    }

    /*-----------------------------------------------------------*/

    return (
        <Container>
            <div className='pool-name'>
                <div className='pool-name-div'>
                    <p>{poolDetail.name}</p>
                </div>

                {/* <div className='pool-id'>
                    <div className='text'>
                        <p className='pool-text'>
                            YDCcRekpBGoul8GaVzOx7
                        </p>
                        <div className='copy' onClick={copyPoolD}>
                            <img src="/images/copy -white.png" />
                        </div>
                    </div>
                </div> */}
            </div>
            <div className='pool-address'>
                <div className='address'>
                    <p>Address</p>
                </div>
                <div className='text'>
                    <p className='address-text'>
                        {props.poolAddress}
                    </p>
                    <div className='copy' onClick={copyAddress}>
                        <img src="/images/copy.png" />
                    </div>
                </div>
            </div>
            <div className='pool-balance'>
                <div className='address'>
                    <p>Balance</p>
                </div>
                <div className='text'>
                    <p className='address-text'>
                        {poolDetail.balance}
                    </p>
                </div>
            </div>
            <div className='insurance-period'>
                <div className='text-heading'>
                    <p>Period of Insurance</p>
                </div>
                <div className='boxes'>
                    <div className='from-div'>
                        <div className='from'>
                            <p>From</p>
                        </div>
                        <div className='text'>
                            <p className='from-text'>
                                January
                            </p>
                        </div>
                    </div>
                    <div className='to-div'>
                        <div className='to'>
                            <p>To</p>
                        </div>
                        <div className='text'>
                            <p className='to-text'>
                                Deceber
                            </p>
                        </div>
                    </div>
                </div>

            </div>
            <div className='vehicle-detail'>
                <div className='text-heading'>
                    <p>Vehicle Detail</p>
                </div>
                <div className='boxes'>
                    <div className='vehicle-name-div'>
                        <div className='vehicle-name'>
                            <img src="/images/car.png" />
                        </div>
                        <div className='text'>
                            <p className='name-text'>
                                {poolDetail.vehicle}
                            </p>
                        </div>
                    </div>
                    <div className='cubic-capacity-div'>
                        <div className='cc'>
                            <img src="/images/engine.png" />
                        </div>
                        <div className='text'>
                            <p className='cc-text'>
                                {poolDetail.cubicCapacity}cc
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className='premium-count'>
                <div className='boxes'>
                    <div className='premium-div'>
                        <div className='premium'>
                            <p>Premium</p>
                        </div>
                        <div className='text'>
                            <p className='name-text'>
                                $ {poolDetail.premium}
                            </p>
                        </div>
                    </div>
                    <div className='count-div'>
                        <div className='count'>
                            <p>Member</p>
                        </div>
                        <div className='text'>
                            <p className='count-text'>
                                {props.memberCount}/2
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className='stake-amount'>
                <div className='inner'>
                    <p>Stake $ 2000</p>
                </div>

            </div>
            <div className='status-div'>
                <div className='inner'>
                    <p>Pool Active</p>
                </div>
            </div>
        </Container>
    )
}

export default PoolCard

const Container = styled.div`
    margin-top: 0.7rem;
    width: 100%;
    height: 92%;
    display: flex;
    flex-direction: column;
    background-color: #0152b515;
    border-radius: 8px;
    border: 1px solid #0152b546;
    overflow: hidden;
    color: #202020fb;
    
    .pool-name {
        height: 2.5rem;
        width: 100%;
        background-color: #0152b5b1;
        display: flex;
        justify-content: start;
        align-items: center;
        overflow: hidden;

        .pool-name-div {
            width: 12rem;
            display: flex;
            justify-content: start;
            align-items: center;

            p {
                margin-left:12px;
                font-weight: 500;
                color: white;
            }
        }        
        
        .pool-id {
            flex: 1;
            display: flex;
            justify-content: end;
            align-items: center;
            margin-right: 0.5rem;
            height: 1.8rem;
            border-radius: 6px;
            overflow: hidden;
            border: 1px solid #ffffff52;


            .text {
                flex: 1;
                display: flex;
                
                .pool-text {
                    flex: 1;
                    display: flex;
                    justify-content: start;
                    align-items: center;
                    font-size: 12px;
                    margin-left: 10px;
                    color: #ffffffe8;
                }

                .copy {
                    width: 2.5rem;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    cursor: pointer;
                    transition: background-color 0.15s, opacity 0.15s;

                    img {
                        width: 50%;
                            opacity: 0.7;
                        }

                    &:hover {
                        background-color: #ffffff1c;
                    }

                    &:active {
                        opacity: 0.7;
                    }

                }
            }
            
        }
    }

    

    .pool-address,
    .pool-balance {
        margin-top: 0.6rem;
        display: flex;
        height: 2rem;
        margin-left: 0.5rem;
        margin-right: 0.5rem;
        border-radius: 6px;
        overflow: hidden;
        border: 1px solid #0152b546;

        .address {
            width: 4.1rem;
            border-right: 1px solid #0152b546;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #0152b539;

            p {
                margin: 0%;
                font-size: 15px;
            }
        }

        .text {
            flex: 1;
            display: flex;
            
            .address-text {
                flex: 1;
                display: flex;
                justify-content: start;
                align-items: center;
                font-size: 11px;
                margin-left: 10px;
            }

            .copy {
                width: 2.5rem;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                transition: background-color 0.15s, opacity 0.15s;

                img {
                    width: 50%;
                    opacity: 0.7;
                }

                &:hover {
                    background-color: #0152b539;
                }

                &:active {
                    opacity: 0.7;
                }

             }
        }
    }

    .pool-balance {
        margin-top: 0.9rem;

        .text{
            .address-text {
                font-size: 15px;
            }
        }
    }

    .insurance-period {
        margin-top: 0.7rem;
        display: flex;
        flex-direction: column;
        height: 3.6rem;
        width: 100%;
        margin-left: 0.5rem;
        margin-right: 0.5rem;
        gap: 5px;
        
        .text-heading {
            display: flex;
            height: 1.3rem;
            margin-right: 0.5rem;

            p {
                margin:0;
                font-size:15px;
            }
        }

        .boxes {
            display: flex;
            flex: 1;
            padding-right: 0.5rem;
            gap: 20px;

            .from-div {
                flex: 1;
                display: flex;
                border-radius: 6px;
                overflow: hidden;
                border: 1px solid #0152b546;

                .from {
                    width: 3.5rem;
                    height: 100%;
                    background-color: #0152b539;
                    display: flex;
                    justify-content: start;
                    align-items: center;
                    border-right: 1px solid #0152b546;

                    p {
                        margin:0;
                        margin-left: 10px;
                        font-size: 15px;
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

            .to-div {
                flex: 1;
                display: flex;
                border-radius: 6px;
                overflow: hidden;
                border: 1px solid #0152b546;
                margin-right: 0.6rem;

                .to {
                    width: 3.5rem;
                    height: 100%;
                    background-color: #0152b539;
                    display: flex;
                    justify-content: start;
                    align-items: center;
                    border-right: 1px solid #0152b546;

                    p {
                        margin:0;
                        margin-left: 10px;
                        font-size: 15px;
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
        }
       
    }

    .vehicle-detail {
        margin-top: 0.7rem;
        display: flex;
        flex-direction: column;
        height: 3.6rem;
        width: 100%;
        margin-left: 0.5rem;
        margin-right: 0.5rem;
        gap: 5px;
        
        .text-heading {
            display: flex;
            height: 1.3rem;
            margin-right: 0.5rem;

            p {
                margin:0;
                font-size:15px;
            }
        }

        .boxes {
            display: flex;
            flex: 1;
            padding-right: 0.5rem;
            gap: 20px;

            .vehicle-name-div {
                flex: 1;
                display: flex;
                border-radius: 6px;
                overflow: hidden;
                border: 1px solid #0152b546;

                .vehicle-name {
                    width: 3.4rem;
                    height: 100%;
                    background-color: #0152b539;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border-right: 1px solid #0152b546;

                    img {
                        width: 55%;
                        opacity: 0.9;
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

            .cubic-capacity-div {
                flex: 1;
                display: flex;
                border-radius: 6px;
                overflow: hidden;
                border: 1px solid #0152b546;
                margin-right: 0.6rem;

                .cc {
                    width: 3.4rem;
                    height: 100%;
                    background-color: #0152b539;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border-right: 1px solid #0152b546;

                    img {
                        width: 40%;
                        opacity: 0.9;
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
        }
    }

    .premium-count {
        margin-top: 1rem;
        height: 2rem;
        width: 100%;
        margin-left: 0.5rem;
        margin-right: 0.5rem;
        gap: 5px;
        overflow: hidden;
        
        .boxes {
            display: flex;
            height: 100%;
            padding-right: 0.5rem;
            gap: 20px;

            .premium-div {
                flex: 1;
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

            .count-div {
                flex: 1;
                display: flex;
                border-radius: 6px;
                overflow: hidden;
                border: 1px solid #0152b546;
                margin-right: 0.6rem;

                .count {
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
        } 
    }

    .stake-amount {
        margin-top: 0.8rem;
        height: 2.2rem;
        margin-left: 0.5rem;
        margin-right: 0.5rem;
        border-radius: 6px;

        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;


        .inner {
            display: flex;
            flex: 1;
            height: 100%;
            justify-content: center;
            align-items: center;
            background-color: #0152b5c3;
            display: flex;

            p {
                margin: 0;
                font-size: 15px;
                color: white;
            }
        }

        
    }

    .status-div {
        margin-top: 0.7rem;
        height: 2.2rem;
        margin-left: 0.5rem;
        margin-right: 0.5rem;
        background-color: #008000d5;
        border-radius: 6px;

        display: flex;
        justify-content: center;
        align-items: center;

        p {
            margin: 0;
            font-size: 15px;
            color: white;
        }
    }
`
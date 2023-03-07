import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { ethers } from 'ethers';
import web3modal from "web3modal"
import ClipLoader from "react-spinners/ClipLoader";
import { poolAbi } from "../../config";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function MyClaimCard(props) {
    console.log(props);

    const [claimStatus, setClaimStatus] = useState(false);
    const [haveClaimed, setHaveClaimed] = useState(false);
    const [isClaiming, setIsClaiming] = useState(false);

    useEffect(() => {
        getClaimStatus();
        userFundClaimStatus();
    }, [])

    const claimHandler = async () => {
        setIsClaiming(true);

        const modal = new web3modal({
            cacheProvider: true,
        });

        const connection = await modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();
        const poolContract = new ethers.Contract(
            props.poolAddress,
            poolAbi.abi,
            signer
        )
        try {
            const amount = ethers.utils.parseEther(props.amount);
            const tx = await poolContract.claimFund(
                amount, {
                gasLimit: 999999,
            }
            )

            await tx.wait()
                .then(() => {
                    console.log('done')
                    toast.success("Claimed", {
                        position: toast.POSITION.TOP_CENTER
                    });
                    setIsClaiming(false);
                }).catch((error) => {
                    toast.error("Failed to request claim.", {
                        position: toast.POSITION.TOP_CENTER
                    });
                    console.error(error);
                    setIsClaiming(false);
                })
        } catch (e) {
            console.log(e);
            toast.error("Transaction failed!", {
                position: toast.POSITION.TOP_CENTER
            });
            setIsClaiming(false);
        }
    }


    const getClaimStatus = async () => {
        const provider = new ethers.providers.JsonRpcProvider('https://endpoints.omniatech.io/v1/fantom/testnet/public');
        const poolContract = new ethers.Contract(
            props.poolAddress,
            poolAbi.abi,
            provider
        )
        try {
            const status = await poolContract.getClaimStatus(props.userAddress);
            setClaimStatus(status);
        } catch (error) {
            console.log(error);
        }
    }

    const userFundClaimStatus = async () => {
        const provider = new ethers.providers.JsonRpcProvider('https://endpoints.omniatech.io/v1/fantom/testnet/public');
        const poolContract = new ethers.Contract(
            props.poolAddress,
            poolAbi.abi,
            provider
        )
        try {
            const response = await poolContract.haveUserClaimed(props.userAddress);
            console.log('claimed : ', response);
            setHaveClaimed(response);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Container>
            <div className='pool-detail'>
                <div className='name'>
                    <p>{props.poolName}</p>
                </div>
                <div className='pool-address'>
                    <p>{props.poolAddress}</p>
                </div>
            </div>
            <div className='amount-status'>
                <div className='amount'>
                    <div className='logo-div'>
                        <img src="/images/usdc-logo.svg" />
                    </div>
                    <div className='text'>
                        <p>{props.amount}</p>
                    </div>
                </div>
                {claimStatus &&
                    <div className='approved'>
                        <p>Approved</p>
                    </div>
                }
                {!claimStatus &&
                    <div className='declined'>
                        <p>Not approved yet</p>
                    </div>
                }

            </div>
            {haveClaimed &&
                <div className='claimed'>
                    <p>Funds claimed</p>
                </div>
            }
            {!haveClaimed &&
                <div className='claim-button' onClick={claimHandler}>
                    {!isClaiming &&
                        <p>Claim</p>
                    }
                    {isClaiming &&
                        <ClipLoader color="#ffffff" size={13} />
                    }
                </div>
            }
        </Container>
    )
}

export default MyClaimCard

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 6.6rem;
    width: 99%;
    border-radius: 5px;
    overflow: hidden;
    margin-bottom: 1.3rem;
    gap: 8px;
    background-color: #0152b515;
    border: 1px solid #0152b546;
    color: #202020fb;
    padding-top: 10px;
    padding-bottom: 10px;

    .pool-detail {
        height: 1.7rem;
        width: 95%;
        border-radius: 3px;
        background-color: #ffffff83;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        border: 1px solid #0152b546;
    

        .name {
            width: 8.5rem;
            height: 100%;
            display: flex;
            justify-content: start;
            align-items: center;
            border-right: 1px solid #0152b546;


            p {
                margin: 0;
                font-size: 15px;
                margin-left: 10px;
            }
        }

        .pool-address {
            height: 100%;
            flex: 1;
            display: flex;
            justify-content: start;
            align-items: center;

            p {
                margin: 0;
                font-size: 12px;
                margin-left: 10px;
            }  
        }
    }

    .amount-status {

        height: 1.7rem;
        width: 95%;
        border-radius: 3px;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        gap: 10px;

        .amount {
            flex: 1;
            height: 100%;
            border-radius: 3px;
            background-color: #ffffff83;
            border: 1px solid #0152b546;
            box-sizing: border-box;
            display: flex;
            align-items: center;

            .logo-div {
                height: 100%;
                width: 2rem;
                display: flex;
                justify-content: center;
                align-items: center;
                border-right: 1px solid #0152b546;

                img {
                    width: 50%;
                }
            }

            .text {
                flex: 1;
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

        .approved {
            flex: 1;
            height: 100%;
            border-radius: 3px;
            background-color: #008000ca;
            box-sizing: border-box;
            display: flex;
            justify-content: center;
            align-items: center;

            p {
                margin: 0;
                font-size: 14px;
                color: white;
            }
        }

        .declined {
            flex: 1;
            height: 100%;
            border-radius: 3px;
            /* background-color: #b40e0ee4; */
            background-color: #e89b0d;
            box-sizing: border-box;
            display: flex;
            justify-content: center;
            align-items: center;

            p {
                margin: 0;
                font-size: 13px;
                color: white;
            }
        }

    }

    .claim-button {
        flex:1;
        background-color: #0153b5;
        width: 95%;
        border-radius: 3px;
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
            font-size: 14px;
            color: white;
        }
    }

    .claimed {
        flex:1;
        background-color: #ffa600;
        width: 95%;
        border-radius: 3px;
        display: flex;
        justify-content: center;
        align-items: center;

        p {
            margin: 0;
            font-size: 14px;
            color: white;
        }
    }
`
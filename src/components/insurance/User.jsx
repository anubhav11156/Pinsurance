import { React, useEffect, useState } from 'react'
import styled from 'styled-components'
import BarLoader from "react-spinners/BarLoader";
import ClipLoader from "react-spinners/ClipLoader";
import { Web3Storage, File } from 'web3.storage/dist/bundle.esm.min.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import copy from 'copy-to-clipboard';
import axios from "axios";
import { ethers } from "ethers"
import { useAccount, useBalance } from 'wagmi'
import { pinsuranceContractAddress, mockUsdcContractAddress, pinsuranceAbi, mockUsdcAbi } from "../../config";
import { useSelector } from 'react-redux';
import { selectAccount } from '../../features/AccountDetailSlice';
import fromExponential from 'from-exponential';
import PoolCard from './PoolCard';


function User() {

    const userAccountDetail = useSelector(selectAccount);
    const [poolDetailArray, setPoolDetailArray] = useState([]);
    const [formActive, setFormActive] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [filBalance, setFilBalance] = useState(0);
    const [usdcBalance, setUsdcBalance] = useState('');
    const [isCreatingAccount, setIsCreatingAccount] = useState(false);
    const [userHaveAccount, setuserHaveAccouint] = useState(false);
    const [accountDetail, setAccountDetaiil] = useState({
        name: "",
        age: "",
        address: "",
        filBal: "",
        usdcBal: "",
        email: "",
        profileURI: ""
    });


    const { address } = useAccount();

    const ownerPrivateKey = process.env.REACT_APP_PRIVATE_KEY;

    useEffect(() => {
        if (userAccountDetail.haveAccount) {
            setuserHaveAccouint(true);
        } else {
            setuserHaveAccouint(false);
        }
    }, [userAccountDetail.haveAccount]);


    const [formInput, setFormInput] = useState({
        name: "",
        age: "",
        email: "",
        profileURI: "",
    });

    const createHandler = () => {
        setFormActive(true);
    }



    /*--------------------get balances --------------------*/

    const hexToDec = (hex) => parseInt(hex, 16);

    const balance = useBalance({
        address: `${address}`,
    });

    const getUsdcBalance = async () => {
        const provider = new ethers.providers.JsonRpcProvider('https://rpc.testnet.fantom.network/');
        const usdcContract = new ethers.Contract(
            mockUsdcContractAddress,
            mockUsdcAbi.abi,
            provider
        )
        try {
            await usdcContract.balanceOf(address)
                .then((response) => {
                    let bal = hexToDec(response._hex);
                    setUsdcBalance(
                        Number(ethers.utils.formatEther(fromExponential(bal))).toFixed(2)
                    );
                })
        } catch (error) {
            console.log(error);
        }
    }

    /*--------------------------------------------------------*/

    useEffect(() => {
        getAccountDetail();
        getPools();
        const balFIL = Number(balance.data.formatted);
        setFilBalance(balFIL.toFixed(2));
        getUsdcBalance();
    }, [address]);


    /*----------------get user account detail----------------------------*/

    const getAccountDetail = async () => {
        const provider = new ethers.providers.JsonRpcProvider('https://rpc.testnet.fantom.network/');
        const pinsuranceContract = new ethers.Contract(
            pinsuranceContractAddress,
            pinsuranceAbi.abi,
            provider
        )
        try {
            await pinsuranceContract.getUserDetail(address)
                .then((response) => {
                    console.log('account : ', response);
                    fetchUserInfoFromURI(response.userMetadataURI)
                })
        } catch (error) {
            console.log(error);
        }
    }

    const fetchUserInfoFromURI = async (uri) => {
        const uriResponse = await axios.get(uri);
        console.log('uriResponse : ', uriResponse.data);
        setAccountDetaiil({
            ...accountDetail,
            name: uriResponse.data.name,
            age: uriResponse.data.age,
            email: uriResponse.data.email,
            profileURI: uriResponse.data.profileURI
        })
    }


    /*-------------------------------------------------------------------*/

    /*------------------------ get user pools----------------------------*/

    const getPools = async () => {
        const provider = new ethers.providers.JsonRpcProvider('https://rpc.testnet.fantom.network/');
        const pinsuranceContract = new ethers.Contract(
            pinsuranceContractAddress,
            pinsuranceAbi.abi,
            provider
        )
        try {
           const data =  await pinsuranceContract.getUserAllPools(address)
           const items = await Promise.all(
            data.map(async (i) => {
                let poolAddress = i.poolContractAddress;
                let memberCount = hexToDec(i.currentMemberCount._hex);
                let item = {
                    poolAddress,
                    memberCount
                };
                return item;
            })
           );
           console.log('Pool detail : ',items);
           setPoolDetailArray(items);
        } catch (error) {
            console.log(error);
        }
    }

    console.log('testing : ', poolDetailArray);

    const PoolCards = poolDetailArray.map(card => {
        return (
            <PoolCard 
                memberCount={card.memberCount}
                poolAddress={card.poolAddress}
            />
        )
    }) 
    /*-------------------------------------------------------------------*/

    /*--------------------IPFS code to upload metadata-------------------*/

    const web3StorageApiKey = process.env.REACT_APP_WEB3_STORAGE;

    const makeStorageClient = () => {
        return new Web3Storage({ token: `${web3StorageApiKey}` })
    }

    const uploadImageHandler = async () => {
        const fileInput = document.getElementById('upload-image');
        const pathname = fileInput.files[0].name;
        setIsUploading(true);
        const cid = await uploadToIPFS(fileInput.files);

        if (cid.length) {
            toast.success("Uploaded to IPFS", {
                position: toast.POSITION.TOP_CENTER
            });
        } else {
            toast.error("IPFS upload failed!", {
                position: toast.POSITION.TOP_CENTER
            });
        }
        setIsUploading(false);
        setFormInput({
            ...formInput,
            profileURI: `https://${cid}.ipfs.w3s.link/${pathname}`
        })
    }

    const uploadToIPFS = async (files) => {
        const client = makeStorageClient()
        const cid = await client.put(files)
        return cid;
    }

    const metadata = async () => {
        const { name, age, email, profileURI } = formInput;
        // if (!name || !age || !email || !profileURI) return;
        const data = JSON.stringify({ name, age, email, profileURI });
        const files = [
            new File([data], 'metadata.json')
        ]
        const metadataCID = await uploadToIPFS(files);
        return `https://ipfs.io/ipfs/${metadataCID}/metadata.json`
        // return `https://${metadataCID}.ipfs.w3s.link/${pathname}`
    }
    /*------------------------------------------------------*/


    /*------------------Create account----------------------*/

    const createAccountHandler = async () => {
        setIsCreatingAccount(true);
        const metadatURI = await metadata();
        console.log('uri : ', metadatURI);
        const provider = new ethers.providers.JsonRpcProvider('https://rpc.testnet.fantom.network/');
        const wallet = new ethers.Wallet(ownerPrivateKey);
        const signer = wallet.connect(provider);
        const pinsuranceContract = new ethers.Contract(
            pinsuranceContractAddress,
            pinsuranceAbi.abi,
            signer
        )
        const create = await pinsuranceContract.createUser(
            address,
            metadatURI
        )
        await create.wait()
            .then(() => {
                toast.success("Account created!", {
                    position: toast.POSITION.TOP_CENTER
                });
                setuserHaveAccouint(true);
                setIsCreatingAccount(false);
                window.location.reload();
            }).catch((e) => {
                toast.error("Failed to create account!", {
                    position: toast.POSITION.TOP_CENTER
                });
                console.error(e);
                setIsCreatingAccount(false);
            })
    }

    /*--------------------------------------------------------------------------*/

    const copyAddress = () => {
        if (address) {
            copy(address);
        }
    }

    return (
        <Container>
            <Main>
                {!userHaveAccount &&
                    <>
                        {!formActive &&
                            <div className='noAccount'>
                                <div className='text'>
                                    <p>Don't have an account? <span>Create</span> One!</p>
                                </div>
                                <div className='create'>
                                    <div className='create-button' onClick={createHandler}>
                                        <div className='create-text'>
                                            <p>Create</p>
                                        </div>
                                        <div className='icon'>
                                            <img src="/images/add.png" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }

                        {formActive &&
                            <Form>
                                <div className='left'>
                                    <div className='name-div'>
                                        <input type="text" placeholder="Enter Name" onChange={(prop) => {
                                            setFormInput({
                                                ...formInput,
                                                name: prop.target.value
                                            })
                                        }} />
                                    </div>
                                    <div className='image-div'>

                                        <div className='chooseImage'>
                                            <div className='up'>
                                                <input className="uploadImage" type="file" id="upload-image" onChange={uploadImageHandler} />
                                            </div>
                                            <div className='down'>
                                                {isUploading &&
                                                    <BarLoader color="#0152b5cc" size={13} />
                                                }
                                            </div>
                                        </div>

                                    </div>
                                    <div className='age-div'>
                                        <input type="text" placeholder="Enter Age" onChange={(prop) => {
                                            setFormInput({
                                                ...formInput,
                                                age: prop.target.value
                                            })
                                        }} />
                                    </div>
                                    <div className='email-div'>
                                        <input type="text" placeholder="Enter Email" onChange={(prop) => {
                                            setFormInput({
                                                ...formInput,
                                                email: prop.target.value
                                            })
                                        }} />
                                    </div>
                                    <div className='button-div'>
                                        <div className='createAccount' onClick={createAccountHandler}>
                                            {!isCreatingAccount &&
                                                <p>Create Account</p>
                                            }
                                            {isCreatingAccount &&
                                                <ClipLoader color="#ffffff" size={16} />
                                            }
                                        </div>
                                    </div>
                                </div>
                            </Form>
                        }
                    </>
                }
                {userHaveAccount &&
                    <AccountSection>
                        <div className='up'>
                            <div className='left'>
                                <div className='image'>
                                    <img src={accountDetail.profileURI} />
                                </div>
                            </div>
                            <div className='right'>
                                <div className='details'>
                                    <div className='address-div'>
                                        <p className='address'>{address}</p>
                                        <div className='copy' onClick={copyAddress}>
                                            <img src="/images/copy.png" />
                                        </div>
                                    </div>
                                    <div className='name-div'>
                                        <div className='name'>
                                            <p>Hi, {accountDetail.name}</p>
                                        </div>
                                        <div className='age'>
                                            <p>{accountDetail.age}</p>
                                        </div>
                                    </div>
                                    <div className='email-div'>
                                        <div className='logo'>
                                            <img src="/images/gmail.png" />
                                        </div>
                                        <p className='email'>{accountDetail.email}</p>
                                    </div>
                                    <div className='balance-div'>
                                        <div className='fil-div'>
                                            <div className='logo'>
                                                <img src="/images/ftm-logo.png" />
                                            </div>
                                            <div className='user-balance'>
                                                <p>{filBalance}</p>
                                            </div>
                                        </div>
                                        <div className='usdc-div'>
                                            <div className='logo'>
                                                <img src="/images/usdc-logo.svg" />
                                            </div>
                                            <div className='user-balance'>
                                                <p>{usdcBalance}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='down'>
                            <div className='heading'>
                                <div className='line-1'></div>
                                <div className='text'>
                                    <p>Pools</p>
                                </div>
                                <div className='line-2'></div>
                            </div>
                            <div className='pool-conatainer'>
                                {PoolCards}
                            </div>
                        </div>
                    </AccountSection>
                }
            </Main>
        </Container>
    )
}

export default User

const Container = styled.div`
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`

const Main = styled.div`
    width: 100%;
    height:99%;
    display: flex;
    justify-content: center;

    .noAccount {
        margin-top: 14rem;
        display: flex;
        flex-direction: column;
        height: 8rem;
        width: 57rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .text {
            flex: 1;
            p {
                margin: 0;
                font-size: 48px;
                letter-spacing: 3px;
                span {
                    color: #3adfae;
                }
            }
        }

        .create {
            margin-top: 3rem;
            flex: 1;
            height: 2rem;
            width: 10rem;
            display: flex;
            justify-content: center;
            align-items: center;

            .create-button {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 9rem;
                height: 2.4rem;
                background-color: #0152b5cc ;
                border-radius: 5px;
                overflow: hidden;
                cursor: pointer;
                transition: opacity 0.15s;

                &:hover {
                    opacity: 0.9;
                }

                &:active {
                    opacity: 0.8;
                }

                .create-text {
                    flex: 1;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100%;
                    margin-left: 5px;
                    
                    p { 
                        margin: 0;
                        margin-left: 10px;
                        color: white; 
                        font-size: 22px;
                    }
                }

                .icon {
                    flex: 0.5;
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    img {
                        width: 35%;
                        margin-right: 25px;
                    }
                }
            }
        }
    }
`

const Form = styled.div`
    margin-top: 5.1rem;
    height: 40rem;
    width: 35rem;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;

    .left {
        flex: 1.5;
        height: 100%;
        display: flex;
        flex-direction: column;

        .name-div {
            width: 100%;
            height: 5rem;
            display: flex;
            justify-content: center;
            align-items: center;

            input {
                width: 95%;
                height: 2.4rem;
                border-radius: 8px;
                border: 1px solid #0152b5cc;
                padding-left: 10px;
                font-size: 16px;
                outline: none;
            }   
        }

        .image-div {
            width: 100%;
            height: 14rem;
            display: flex;
            justify-content: center;
            align-items: center;

            .chooseImage {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;

                height: 11rem;
                background-color: lightblue;
                width: 97%;
                /* background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='10' ry='10' stroke='%230152B5CC' stroke-width='4' stroke-dasharray='6%2c 14' stroke-dashoffset='5' stroke-linecap='square'/%3e%3c/svg%3e"); */
                background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='10' ry='10' stroke='%230152B5CC' stroke-width='3' stroke-dasharray='6%2c 14' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");
                border-radius: 10px;
                overflow: hidden;
                background-color: #0152b512;
                display: flex;
                justify-content: center;
                align-items: center;

                .up {
                    display: flex;
                    justify-content: center;
                    align-items: end;
                    flex: 1.2;
                    .uploadImage {
                        width: 220px;
                        height: 35px;
                        border-radius: 2px;
                        color: #0152b5cc;
                        font-size: 15px;
                        border: 1px solid #0152b5cc;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        white-space: nowrap;
                    }

                    .uploadImage::-webkit-file-upload-button {
                        width: 100px;
                        height: 38px;
                        background: #0152b5cc;
                        backdrop-filter: blur( 4px );
                        -webkit-backdrop-filter: blur( 4px );
                        border: none;
                        cursor: pointer;
                        margin-right: 10px;

                        color: white;
                        transition: opacity 0.15s;
                        font-size: 15px;

                        &:hover {
                            opacity: 0.9;
                        }

                        &:active {
                            opacity: 0.8;
                        }
                    }
                }

                .down {
                    flex: 1;
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
            }

            
        }

        .age-div {
            width: 100%;
            height: 5rem;
            display: flex;
            justify-content: center;
            align-items: center;

            input {
                width: 95%;
                height: 2.4rem;
                border-radius: 8px;
                border: 1px solid #0152b5cc;
                padding-left: 10px;
                font-size: 16px;
                outline: none;
            }   
        }

        .email-div {
            margin-top: -0.9rem;
            width: 100%;
            height: 6.6rem;
            display: flex;
            justify-content: center;
            align-items: center;

            input {
                width: 95%;
                height: 2.4rem;
                border-radius: 8px;
                border: 1px solid #0152b5cc;
                padding-left: 10px;
                font-size: 16px;
                outline: none;
            }   
            
        }

        .button-div {
            width: 100%;
            height: 5rem;
            display: flex;
            justify-content: center;
            align-items: start;

            .createAccount {
                width: 97%;
                height: 2.9rem;
                background-color: #0152b5cc;
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 5px;
                cursor: pointer;
                transition: opacity 0.15s;
                p {
                    color: white
                }

                &:hover {
                    opacity: 0.9;
                }

                &:active {
                    opacity: 0.8;
                }
            }
        }
    }
`
const AccountSection = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;

    .up {
        height: 19rem;
        width: 95%;
        display: flex;
        justify-content: center;
        align-items: end;
        gap: 1.2rem;
        overflow: hidden;

        .left {
            width: 14rem;
            height: 84.5%;
            display: flex;
            justify-content: start;

            .image {
                margin-top: 5px;
                width: 14rem;
                height: 13rem;
                display: flex;
                justify-content: center;
                align-items: center;
                /* border: 1px solid #0152b5cc; */
                overflow: hidden;
                border-radius: 6px;
                background-color: #0152b534;

                img {
                    width: 11rem;
                    height: 11rem;
                    object-fit: cover;
                    border-radius: 6px;
                }
            }
        }

        .right {
            flex: 1;
            height: 16rem;
            display: flex;
            justify-content: start;
            align-items: center;
            color: #202020f1;

            .details {
                margin-top: 3.5rem;
                flex:1;
                display: flex;
                flex-direction: column;
                height: 19rem;
                gap: 0.7rem;

                .address-div {
                    width: 100%;
                    height: 2rem;
                    display: flex;
                    justify-content: start;
                    align-items: center;
                    background-color: #0152b534;
                    border-radius: 6px;
                    overflow: hidden;

                    .address {
                        flex: 1;
                        margin: 0;
                        margin-left: 10px;
                        margin-top:2px;
                        font-size: 16px;
                        letter-spacing: 1px;
                    }

                    .copy {
                        width: 2.5rem;
                        height: 2rem;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        transition: background-color 0.15s, opacity 0.15s;

                        img {
                            margin-top: 1px;
                            height: 1.3rem;
                            width: 1.3rem;
                            opacity: 0.7;
                            cursor: pointer;
                        }

                        &:hover {
                            background-color: #0152b539;
                        }

                        &:active {
                            opacity: 0.7;
                        }

                    }
                }

                .name-div {
                    width: 100%;
                    height: 5rem;
                    background-color: #0152b534;
                    display: flex;
                    justify-content: start;
                    align-items: center;
                    border-radius: 6px;

                    .name {
                        display: flex;
                        justify-content: start;
                        align-items: center;
                        flex: 1;

                        p {
                        margin: 0;
                        margin-left: 10px;
                        margin-top:2px;
                        font-size: 50px;
                        font-weight: 400;
                        letter-spacing: 1px;
                    }
                    }

                    .age {
                        width: 3rem;
                        height: 100%;
                        display: flex;
                        justify-content: start;
                        align-items: end;

                        p {
                            margin: 0;
                            margin-bottom: 10px;
                        }
                    }
                   
                }

                .email-div {
                    
                    width: 100%;
                    height: 2rem;
                    display: flex;
                    justify-content: start;
                    align-items: center;
                    gap: 0.8rem;
                    background-color: #0152b534;
                    border-radius: 6px;

                  .logo {
                    display: flex;
                    justify-content:center;
                    align-items: center;
                    width: 2rem;
                    height: 2rem;

                    img {
                        margin-left: 10px;
                        width: 56%;
                    }
                  }
                    
                    .email {
                        flex: 1;
                        margin: 0;
                        margin-top:-1px;
                        margin-left: -3px;
                        font-size: 17px;
                        letter-spacing: 1px;
                    }
                }

                .balance-div {
                    width: 100%;
                    height: 2rem;
                    display: flex;
                    justify-content: start;
                    align-items: center;
                    gap: 0.8rem;
                    overflow: hidden;

                    .fil-div {
                       background-color: #0152b534;
                       flex: 1;
                       height: 100%;
                       display: flex;
                       justify-content: start;
                       align-items: center;
                       border-radius: 6px;
                       
                       .logo {
                            width: 2rem;
                            height: 2rem;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            img {
                                width: 60%;
                            }
                       }
                       .user-balance {
                            margin-left: 3px;
                            font-size: 16px;
                       }
                    }

                    .usdc-div {
                        background-color: #0152b534;
                        flex: 1;
                        height: 100%;
                        display: flex;
                        justify-content: start;
                        align-items: center;
                        border-radius: 6px;

                        .logo {
                            width: 2rem;
                            height: 2rem;
                            display: flex;
                            justify-content: center;
                            align-items: center;

                            img {
                                width: 65%;
                            }
                       }
                       .user-balance {
                            font-size: 16px;
                            margin-left: 3px;
                       }

                    }
                }
            }
        }
    }

    .down {
        margin-top: -1rem;
        flex: 1;
        width: 95%;
        display: flex;
        flex-direction: column;
        justify-content: start;

        .heading {
            height: 1rem;
            display: flex;
            justify-content: start;
            align-items: center;
            margin-bottom: 5px;

            .line-1 {
                width: 2.5rem;
                border-top: 1px solid  #0152b5b6;
                margin-right: 8px;
            }

            .text {
                p {
                    margin: 0;
                    color:  #0152b5e0;
                }
            }

            .line-2 {
                flex: 1;
                margin-left: 8px;
                border-top: 1px solid  #0152b5b6;
            }
        }

        .pool-conatainer{
            flex: 1;
            display: flex;
            display: grid;
            grid-template-columns: 410.94px  410.94px  410.94px;
            grid-column-gap: 6rem;
        }
    }
`
import { React, useEffect, useState } from 'react'
import styled from 'styled-components'
import BarLoader from "react-spinners/BarLoader";
import ClipLoader from "react-spinners/ClipLoader";
import { Web3Storage, File } from 'web3.storage/dist/bundle.esm.min.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Contract, ethers } from "ethers"
import { ContractResultDecodeError, useAccount } from 'wagmi'
import { pinsuranceContractAddress, mockUsdcContractAddress, pinsuranceAbi, mockUsdcAbi } from "../../config";

function User() {

    const [haveAccount, setHaveAccount] = useState(false);
    const [formActive, setFormActive] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isCreatingAccount, setIsCreatingAccount] = useState(false);
    const [metadatUri, setMetadataUri] = useState("");

    const { isConnected, address } = useAccount();

    const ownerPrivateKey = process.env.REACT_APP_PRIVATE_KEY;

    const [formInput, setFormInput] = useState({
        name: "",
        age: "",
        email: "",
        profileURI: "",
    });

    const createHandler = () => {
        setFormActive(true);
    }

    useEffect(() => {
        getAccountStatus();
        getAccountDetail();
    }, [isConnected]);

    const getAccountStatus = async () => {
        const provider = new ethers.providers.JsonRpcProvider('https://filecoin-hyperspace.chainstacklabs.com/rpc/v0');
        const pinsuranceContract = new ethers.Contract(
            pinsuranceContractAddress,
            pinsuranceAbi.abi,
            provider
        )
        try {
            const status = await pinsuranceContract.getUserAccountStatus(address)
                .then((response) => console.log('have account : ', response))
                .catch((e) => console.error(e))
            if (status) {
                setHaveAccount(true);
            } else {
                setHaveAccount(false);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const getAccountDetail = async () => {
        const provider = new ethers.providers.JsonRpcProvider('https://filecoin-hyperspace.chainstacklabs.com/rpc/v0');
        const pinsuranceContract = new ethers.Contract(
            pinsuranceContractAddress,
            pinsuranceAbi.abi,
            provider
        )
        try {
            await pinsuranceContract.getUserDetail(address)
                .then((response) => console.log(response));
        } catch (error) {
            console.log(error);
        }


    }
    /*--------------------IPFS code to upload metadata-------------------*/

    const web3ApiKey = process.env.REACT_APP_WEB3_STORAGE;

    const makeStorageClient = () => {
        return new Web3Storage({ token: `${web3ApiKey}` })
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
            profileURI: `https://ipfs.io/ipfs/${cid}/${pathname}`
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
    }
    /*------------------------------------------------------*/




    /*------------------Create account----------------------*/

    const createAccountHandler = async () => {
        setIsCreatingAccount(true);
        console.log('nigga1');
        const metadatURI = await metadata();
        console.log('uri : ', metadatURI);
        console.log('nigga2');
        const provider = new ethers.providers.JsonRpcProvider('https://filecoin-hyperspace.chainstacklabs.com/rpc/v0');
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
        .then(()=> {
        toast.success("Account created!", {
            position: toast.POSITION.TOP_CENTER
        });
        setHaveAccount(true);
        setIsCreatingAccount(false);
        getAccountStatus();
        }).catch((e)=>{
        toast.error("Failed to create account!", {
            position: toast.POSITION.TOP_CENTER
        });
        console.error(e);
        setIsCreatingAccount(false);
        })
    }

    /*--------------------------------------------------------------------------*/

    return (
        <Container>
            <Main>
                {!haveAccount &&
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
                { haveAccount &&
                    <div className='haveAccount'>
                        Hello
                    </div>
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
    width: 80%;
    height:40rem;
    display: flex;
    justify-content: center;

    .noAccount {
        margin-top: 12rem;
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
    margin-top: 0.5rem;
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
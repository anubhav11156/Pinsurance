import { React, useState } from 'react'
import styled from 'styled-components'

function User() {

    const [haveAccount, setHaveAccount] = useState(false);
    const [formActive, setFormActive] = useState(false);

    const createHandler = () => {
        setFormActive(true);
    }

    const uploadImageHandler = () => {
        // IPFS code ---> 
    }

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
                                        <input type="text" placeholder="Enter Name" />
                                    </div>
                                    <div className='image-div'>
                                        <div className='chooseImage'>
                                            <input className="uploadImage" type="file" id="content" onChange={uploadImageHandler} />
                                        </div>
                                    </div>
                                    <div className='age-div'>
                                        <input type="text" placeholder="Enter Age" />
                                    </div>
                                    <div className='email-div'>
                                        <input type="text" placeholder="Enter Email" />
                                    </div>
                                    <div className='button-div'>
                                        <div className='createAccount'>
                                            <p>Create Account</p>
                                        </div>
                                    </div>
                                </div>
                                <div className='right'>
                                    right
                                </div>
                            </Form>
                        }
                    </>
                }
                {haveAccount &&
                    <div className='haveAccount'>

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
    width: 65rem;
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
            height: 12rem;
            display: flex;
            justify-content: center;
            align-items: center;

            .chooseImage {
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
            }

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

        .button-div {
            width: 100%;
            height: 4.5rem;
            display: flex;
            justify-content: center;
            align-items: start;

            .createAccount {
                width: 97%;
                height: 2.5rem;
                background-color: #0152b5cc;
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 4px;
                cursor: pointer;
                
                p {
                    color: white
                }
            }
        }
    }

    .right {
        flex: 1;
        height: 100%;
        background-color: lightpink;
    }

`
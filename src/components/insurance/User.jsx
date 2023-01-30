import { React, useState } from 'react'
import styled from 'styled-components'

function User() {

    const [haveAccount, setHaveAccount] = useState(false);

    return (
        <Container>
            <Main>
                { !haveAccount &&
                    <div className='noAccount'>
                        <div className='text'>
                            <p>Don't have an account? <span>Create</span> One!</p>
                        </div>
                        <div className='create'>
                            <div className='create-button'>
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
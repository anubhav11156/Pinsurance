import React from 'react'
import styled from 'styled-components'

function MemberCard() {
    return (
        <Container>
            <div className='left'>
                <div className='profile-image'>
                    <img src="https://bafybeifzpfapxzucdrfbr3n4ogml72vxyrxf2kkk7l5mh2aumxkmk7qtoi.ipfs.w3s.link/thelvedem.jpg" />
                </div>
            </div>
            <div className='right'>
                <div className='detail-container'>
                    <div className='name-div'>
                        <p>Anubhav Kumar</p>
                    </div>
                    <div className='address-div'>
                        <div className='address'>
                            <p>0x9d211d45e432c43b4F8b6Eb86c841A11cFc5AD90</p>
                        </div>
                    </div>
                    <div className='meta-div'>
                        <div className='email-div'>
                            <div className='logo-div'>
                                <img src='/images/gmail.png' />
                            </div>
                            <div className='email'>
                                <p>anubhav11697@gmail.com</p>
                            </div>
                        </div>
                        <div className='premium-div'>
                            <div className='logo-div'>
                                <img src='/images/usdc-logo.svg' />
                            </div>
                            <div className='email'>
                                <p>3500</p>
                            </div>
                        </div>
                        <div className='vehicle-div'>
                            <div className='logo-div'>
                                <img src='/images/car.png' />
                            </div>
                            <div className='email'>
                                <p>Supra</p>
                            </div>
                        </div>
                        <div className='cc-div'>
                            <div className='logo-div'>
                                <img src='/images/engine.png' />
                            </div>
                            <div className='email'>
                                <p>1000</p>
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

            .stake-div {
                width: 10rem;
                height: 100%;
                background-color: lightblue;
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
                margin: 0;
                margin-left: 10px;
                font-size: 24px;
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
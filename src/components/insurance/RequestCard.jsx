import React from 'react'
import styled from 'styled-components';


function RequestCard() {
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
                        <p>Anubhav Kuamr</p>
                        <div className='stake-div'>
                            <div className='staked'>
                                <p>0x2408957324890fkjowefhfhfkr20r7kjdfh7r09yrhfd</p>
                            </div>
                        </div>
                    </div>
                    <div className='address-div'>
                        <div className='address'>
                            <p>0x2408957324890fkjowefhfhfkr20r7kjdfh7r09yrhfd</p>
                        </div>
                    </div>
                    <div className='meta-div'>
                        <div className='email-div'>
                            <div className='logo-div'>
                                <img src='/images/gmail.png' />
                            </div>
                            <div className='email'>
                                <p>anubahv11697@gmail.com</p>
                            </div>
                        </div>
                        <div className='premium-div'>
                            <div className='logo-div'>
                                <img src='/images/usdc-logo.svg' />
                            </div>
                            <div className='email'>
                                <p>35000</p>
                            </div>
                        </div>
                        <div className='vehicle-div'>
                            <div className='logo-div'>
                                <img src='/images/car.png' />
                            </div>
                            <div className='email'>
                                <p>GTR</p>
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

export default RequestCard

const Container = styled.div`
    height: 8.5rem;
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
        height: 7rem;
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
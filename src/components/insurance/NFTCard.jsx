import React from 'react'
import styled from 'styled-components'

function NFTCard() {
    return (
        <Container>
            <div className='up'>
                <img src="data:image/png;base64,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" />
            </div>
            <div className='down'>
                <div className='lower-up'>
                    <div className='vehicle'>
                        <div className='logo'>
                            <img src="/images/car.png" />
                        </div>
                        <div className='text'>
                            <p>Audi S5</p>
                        </div>
                    </div>
                    <div className='cc'>
                        <div className='logo'>
                            <img src="/images/engine.png" />
                        </div>
                        <div className='text'>
                            <p>1000</p>
                        </div>
                    </div>
                </div>
                <div className='lower-down'>
                    <div className='premium'>
                        <div className='logo'>
                            <img src="/images/usdc-logo.svg" />
                        </div>
                        <div className='text'>
                            <p>3500</p>
                        </div>
                    </div>
                    <div className='doc'>
                        <p>Metadata</p>
                    </div>
                </div>
            </div>
            <div className='bar'>
                <p># 1</p>
            </div>
        </Container>
    )
}

export default NFTCard

const Container = styled.div`
    position: relative;
    width: 100%;
    height: 98%;

    display: flex;
    flex-direction: column;
    align-items: center;

    .bar {
        position: absolute;
        height: 1.1rem;
        border-radius: 3px;
        width: 3.2rem;
        background-color: #0152b5c1;
        top: 0.2rem;
        left: 0.5rem;

        display: flex;
        justify-content: center;
        align-items: center;
        
        p {
            margin: 0;
            font-size: 14px;
            color: white;

        }
    }

    .up {
        flex: 1;
        width: 100%;
        background-color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        border-bottom: 1px solid  #0152b5b6;
    }

    .down {
        height: 4.8rem;
        width: 93%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;

        .lower-up {
            flex: 1;
            width: 100%;
            display: flex;
            align-items: end;
            gap: 10px;

            .vehicle {
                flex: 1;
                height: 75%;
                border: 1px solid  #0152b5b6;
                box-sizing: border-box;
                border-radius: 3px;

                display: flex;
                justify-content: center;
                align-items: center;

                .logo {
                    width: 2.2rem;
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border-right: 1px solid #0152b5b6;
                    background-color: #0152b546;

                    img {
                        width: 65%;
                    }
                }

                .text {
                    flex: 1;
                    height: 100%;
                    display: flex;
                    justify-content: start;
                    align-items: center;

                    p {
                        font-size: 14px;
                        margin: 0;
                        margin-left: 8px;
                    }
                }
            }

            .cc {
                flex: 1;
                height: 75%;
                border: 1px solid  #0152b5b6;
                box-sizing: border-box;
                border-radius: 3px;

                display: flex;
                justify-content: center;
                align-items: center;

                .logo {
                    width: 2.2rem;
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border-right: 1px solid #0152b5b6;
                    background-color: #0152b546;

                    img {
                        width: 54%;
                    }
                }

                .text {
                    flex: 1;
                    height: 100%;
                    display: flex;
                    justify-content: start;
                    align-items: center;

                    p {
                        font-size: 14px;
                        margin: 0;
                        margin-left: 8px;
                    }
                }
            }
        }

        .lower-down {
            flex:1;
            width: 100%;
            display: flex;
            align-items: center;
            gap: 10px;

            .premium {
                flex: 1;
                height: 75%;
                border: 1px solid  #0152b5b6;
                box-sizing: border-box;
                border-radius: 3px;

                display: flex;
                justify-content: center;
                align-items: center;

                .logo {
                    width: 2.2rem;
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border-right: 1px solid #0152b5b6;
                    background-color: #0152b546;

                    img {
                        width: 52%;
                    }
                }

                .text {
                    flex: 1;
                    height: 100%;
                    display: flex;
                    justify-content: start;
                    align-items: center;

                    p {
                        font-size: 14px;
                        margin: 0;
                        margin-left: 8px;
                    }
                }
            }

            .doc {
                flex: 1;
                height: 75%;
                box-sizing: border-box;
                border-radius: 3px;
                transition: opacity 0.15s;
                cursor: pointer;
                background-color: #0152b5c1;

                display: flex;
                justify-content: center;
                align-items: center;

                &:hover {
                    opacity: 0.9;
                }

                &:active {
                    opacity: 0.8;
                }

                p {
                    font-size: 14px;
                    margin: 0;
                    color: white;
                }
            }
        }
    }
`
import { React, useState, useEffect } from 'react'
import styled from 'styled-components'
import axios from "axios";


function NFTCard(props) {

    const [qrData, setQrData] = useState();
    const [metaURI, setMetaURI] = useState();
    const [premium, setPremium] = useState();
    const [vehicle, setVehicle] = useState();
    const [cubicCapacity, setCubicCapacity] = useState();

    useEffect(() => {
        fetchQrImageData();
        fetchMetadata();
    }, [props])

    const fetchQrImageData = async () => {
        try {
            axios.get(props.uri)
                .then((response) => {
                    axios.get(response.data.qrUri)
                        .then((response) => {
                            setQrData(response.data.qrImageData);
                        }).catch((error) => {
                            console.log(error);
                        });
                }).catch((error) => {
                    console.log(error);
                })
        } catch (error) {
            console.log(error);
        }
    }

    const fetchMetadata = async () => {
        try {
            axios.get(props.uri)
                .then((response) => {
                    setMetaURI(response.data.metaUri)
                    axios.get(response.data.metaUri)
                        .then((response) => {
                            setVehicle(response.data.insurance.vehicle)
                            setCubicCapacity(response.data.insurance.cubicCapacity)
                            setPremium(response.data.insurance.premium.amount);
                        }).catch((error) => {
                            console.log(error);
                        })
                }).catch((error) => {
                    console.log(error)
                })
        } catch (error) {
            console.log(error);
        }
    }

    console.log('premium : ', premium)
    console.log('vehicle : ', vehicle)
    console.log('cc ', cubicCapacity);

    return (
        <NftBox>
            <Container>
                <div className='up'>
                    <img src={qrData} />
                </div>
                <div className='down'>
                    <div className='lower-up'>
                        <div className='vehicle'>
                            <div className='logo'>
                                <img src="/images/car.png" />
                            </div>
                            <div className='text'>
                                <p>{vehicle}</p>
                            </div>
                        </div>
                        <div className='cc'>
                            <div className='logo'>
                                <img src="/images/engine.png" />
                            </div>
                            <div className='text'>
                                <p>{cubicCapacity}</p>
                            </div>
                        </div>
                    </div>
                    <div className='lower-down'>
                        <div className='premium'>
                            <div className='logo'>
                                <img src="/images/usdc-logo.svg" />
                            </div>
                            <div className='text'>
                                <p>{premium}</p>
                            </div>
                        </div>
                        <a className='doc' href={metaURI} target="_blank">
                            <p>Metadata</p>
                        </a>
                    </div>
                </div>
                <div className='bar'>
                    <p># {props.tokenId}</p>
                </div>
            </Container>
        </NftBox>

    )
}

export default NFTCard


const NftBox = styled.div`
    height: 20.5rem;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    overflow: hidden;
    border: 1px solid  #0152b5b6;
    box-sizing: border-box;
`

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
        margin-top: 10px;
        flex: 1;
        width: 100%;
        background-color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        border-bottom: 1px solid  #0152b5b6;
    }

    .down {
        height: 5rem;
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
                text-decoration: none;
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
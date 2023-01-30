import React from 'react'
import styled from 'styled-components'

function Insurance() {
  return (
    <Container>
        <Main>
            This is main
        </Main>
    </Container>
  )
}

export default Insurance

const Container=styled.div`
    flex: 1;
    border-bottom: 1px solid black;
    padding-left: 13.2rem;
    padding-right: 12rem;
    background-color: lightgray;
    display: flex;
    justify-content: center;
    margin-top: 10px;
`

const Main=styled.div`
    height:865px;
    background-color: lightpink;
    width: 100%;
    margin-top:40px ;
`
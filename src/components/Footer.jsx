import React from 'react'
import styled from 'styled-components'

function Footer() {
  return (
    <Container>
        Footer component
    </Container>
  )
}

export default Footer

const Container=styled.div`
  margin-top: 5rem;
  height: 40vh;
  background-color: black;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
`
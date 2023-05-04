import React from "react";
import styled from "styled-components";

const FooterCard = ({ name, state, twitter, github, linkedIn }) => {
  return (
    <Container>
      <div
        className='main-container'
        style={{ padding: "10px 0px", height: "full" }}
      >
        <div className='name-div'>
          <p>{name}</p>
          <p>{state}</p>
          <p>3rd year college student</p>
        </div>

        <div
          className='social-handle-div'
          style={{ paddingBottom: "20px", paddingTop: "" }}
        >
          <div className='handles'>
            <a href={github} target='_blank'>
              <img src='/images/github-logo.png' />
            </a>
          </div>
          <div className='handles'>
            <a href={linkedIn} target='_blank'>
              <img src='/images/linkedin-logo.png' />
            </a>
          </div>
          <div className='handles'>
            <a href={twitter} target='_blank'>
              <img src='/images/twitter.png' />
            </a>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default FooterCard;

const Container = styled.div``;

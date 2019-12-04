import styled, { keyframes } from 'styled-components';

export const SlidesWrapper = styled.div`
  max-width: 700px;
  min-width: ${props => props.width};
  position: relative;
  margin: auto;    
  min-height: 150px;
  max-height: 800px;  
  overflow: hidden;  
  cursor: ${props => props.dragging ? 'grabbing' : 'grab'}
`;

const animation = (props) => {
  return keyframes`
    0% {
      left: ${(props.startAt + "px")};
    }
    100% {
      left: ${(props.stopAt + "px")};
    }  
  `
};

export const Slider = styled.div.attrs(props => ({
    style: {
      left: props.left + "px",
    },
  }))`
	position: relative;		
	width: ${props => (props.sum + 2) * 100}%;
	height: 100%;
  animation: ${props => props.animationStart ? animation(props) : null} 0.2s linear;
  animation-play-state: ${props => props.pause ? "paused" : "running" };
`;

export const MySlide = styled.div`
	float: left;
	width: ${props => 100 / (props.sum + 2)}%;
	height: 100%;
	background-color: grey;
`;

export const Arrow = styled.a`
  cursor: pointer;
  position: absolute;
  top: 50%;
  width: auto;
  padding: 16px;
  margin-top: -22px;
  color: white;
  font-weight: bold;
  font-size: 18px;
  transition: 0.6s ease;
  border-radius: 0 3px 3px 0;
  user-select: none;   
  display: block;
  &.right{
  	right: 0;  	
  }
  :hover{
  	background-color: rgba(0,0,0,0.8);
  }
`;
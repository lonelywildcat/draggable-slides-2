import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
	SlidesWrapper,
	Slider,
	MySlide,
	Arrow
 } from './style';


const Slides = (props) => {

	const children = props.children;
	const sum = children.length;
	const velocity = 0.9;

  const mySlideRef = useRef();
  const requestRef = React.useRef();
  const previousTimeRef = React.useRef();
  const currentMousePos = React.useRef();
	const dragging = React.useRef(false);
	const dragStartMousePos = React.useRef(0);
	const dragStartSliderPos = React.useRef(0);
	const dragCurrSliderPos = React.useRef(0);
	const dragEndMousePos = React.useRef(0);
	const lastMousePos = React.useRef(0);
	const dragEndlastMousePos = React.useRef(0);

	const [sliderPosition, setSliderPosition] = useState(0);
	const [isDrag, setIsDrag] = useState(false);


//初始化，将图片队列向左移动一个图片的长度
  useEffect(() => {
	  	setSliderPosition(-mySlideRef.current.clientWidth)
	  	dragStartSliderPos.current = -mySlideRef.current.clientWidth
  }, [])

//鼠标动作
	const handleMouseDown = useCallback(
		(event) => {
			setIsDrag(true)
			dragging.current = true;
			dragStartMousePos.current = event.clientX;
		}, []) 

	const handleMouseUp = useCallback(
		(event) => {
			setIsDrag(false);
			dragging.current = false;
			dragStartSliderPos.current = dragCurrSliderPos.current;
			dragEndlastMousePos.current = lastMousePos.current;
			dragEndMousePos.current = currentMousePos.current;
		}, []) 

	const handleMouseMove = useCallback(
		(event) => {
			lastMousePos.current = currentMousePos.current;
			currentMousePos.current = event.clientX;
		}, []) 

	//点击按钮时，模拟拖拽动作来滑动画面
	const handleClickArrow = useCallback(
		(button) => (event) => {
			if (button === 'LEFT') {
				if (dragCurrSliderPos.current === -mySlideRef.current.clientWidth * sum) {
					dragCurrSliderPos.current = 0;
				}
				dragCurrSliderPos.current -= 0.1;
				dragEndlastMousePos.current = dragEndMousePos.current + 1.1;
			}
			if (button === 'RIGHT') {
				if (dragCurrSliderPos.current === 0) {
					dragCurrSliderPos.current = -mySlideRef.current.clientWidth * sum
				}
				dragCurrSliderPos.current += 0.1;
				dragEndlastMousePos.current = dragEndMousePos.current - 1.1;
			}
		}, [sum]) 

//松开鼠标，移动鼠标事件监听
  useEffect(() => {  	
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
    	window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [handleMouseUp])

  useEffect(() => {  	
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
    	window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [handleMouseMove])



//每一帧画面的处理
  const animate = (time) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current;
      //拖拽
      if (dragging.current){
      	//已拉到最左边，
      	if (dragCurrSliderPos.current > 0) {
					dragCurrSliderPos.current = -mySlideRef.current.clientWidth * sum;
					dragStartSliderPos.current = dragCurrSliderPos.current;
					dragStartMousePos.current = currentMousePos.current;
      	} 
      	//已拉到最右边，
      	if (dragCurrSliderPos.current < -mySlideRef.current.clientWidth * sum) {
      		dragCurrSliderPos.current = 0;
					dragStartSliderPos.current = dragCurrSliderPos.current;
					dragStartMousePos.current = currentMousePos.current;
      	}    	
				dragCurrSliderPos.current = dragStartSliderPos.current - (dragStartMousePos.current - currentMousePos.current);
      	setSliderPosition(dragCurrSliderPos.current);
      }

      //拖拽结束，往两边滑动
      if (!dragging.current && dragCurrSliderPos.current % mySlideRef.current.clientWidth !== 0) {
	      let left = Math.ceil(dragCurrSliderPos.current / mySlideRef.current.clientWidth) * mySlideRef.current.clientWidth	;	
	      let right = Math.floor(dragCurrSliderPos.current / mySlideRef.current.clientWidth) * mySlideRef.current.clientWidth	;

	      let moveLeft = () => {
					dragCurrSliderPos.current = dragCurrSliderPos.current - velocity * deltaTime;
					dragStartSliderPos.current = dragStartSliderPos.current - velocity * deltaTime;
					//停止点
					if (dragCurrSliderPos.current < right ) {
						dragCurrSliderPos.current = right;
						dragStartSliderPos.current = right;
					}	
	      };

	      let moveRight = () => {
					dragCurrSliderPos.current = dragCurrSliderPos.current + velocity * deltaTime;
					dragStartSliderPos.current = dragStartSliderPos.current + velocity * deltaTime;
					if (dragCurrSliderPos.current > left ) {
						dragCurrSliderPos.current = left;
						dragStartSliderPos.current = left;
					}	
	      };

	      //快速拖拽
				if (dragEndMousePos.current - dragEndlastMousePos.current < -1) {
						moveLeft();
					}  
				if(dragEndMousePos.current - dragEndlastMousePos.current > 1){
						moveRight();					
				}

				//慢速拖拽
				if ( Math.abs(dragEndMousePos.current - dragEndlastMousePos.current) <= 1 ) {
					if (left - dragCurrSliderPos.current > dragCurrSliderPos.current - right ) {
						moveLeft();
					} else {
						moveRight();		
					}
				}
				setSliderPosition(dragCurrSliderPos.current);
      }

    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  }

  
  React.useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []); 
	
	return (
		<SlidesWrapper 
			dragging={isDrag}
		>
			<Slider 
				sum={sum}
				left={sliderPosition}
				onMouseDown={handleMouseDown}
			>
				<MySlide sum={sum} ref={mySlideRef}>{children[sum - 1]}</MySlide>
				{React.Children.map(children, (child) => {
					return (<MySlide sum={sum}>{child}</MySlide>)
				})}
				<MySlide sum={sum}>{children[0]}</MySlide>
			</Slider>
			<Arrow onClick={handleClickArrow('LEFT')}>&#10094;</Arrow>
			<Arrow className="right" onClick={handleClickArrow('RIGHT')}>&#10095;</Arrow>
		</SlidesWrapper>
	)
}

export { Slides };
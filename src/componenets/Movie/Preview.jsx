import React, { useEffect, useRef,useState } from 'react';
import MovieDetail from './MovieDetail';
import './Preview.scss';
import styled, {keyframes} from "styled-components";
import { fetchData } from '../../Utils/functions'
import { getCoords } from '../../Utils/functions';
const fadeIn = keyframes`
      0% {
        opacity: 0;       
      }
      50% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    `;

const FadeInAnimation = styled.div`
        width: 100%;
        height: 100%;
        opacity: 0;
        &.clear-animation {
          opacity: 1;
        }
        &.run-animation {
          opacity: 1;
          animation: ${fadeIn} 500ms linear;
        }
    `;


function PreviewItem({id,isActive}) {

    const [state,setState] = useState({
        id : undefined,
        data : null,
        loading : false
    });
    

    const previewRef = useRef();

    useEffect( ()=>{
        if(isActive === true && id != state['id'] && state['loading'] === false){
            fetchData(
                id,
                "Preview",
                (result) => {
                    console.log('Success');
                    setState( ({
                        id : id,
                        data : result,
                        loading : false
                    }) )
                },
                ()=>{console.log('Error');},
                (isLoading)=>{
                    console.log('Laoding');
                    if(isLoading){
                        setState(oldState=> ({...oldState , loading:isLoading}))
                    }
                }
            )
        }
    } )

    const afterAnimationDone = ()=>{
        const element= previewRef.current;
        // Scroll
        const {top} = getCoords(element);
        window.scrollBy({top : (top + element.clientHeight + 50 - window.innerHeight) - window.pageYOffset,left : 0,behavior: "smooth"});
        
        if(element.querySelector('.run-animation')){
            element.querySelector('.run-animation').removeEventListener('animationend',afterAnimationDone)
            element.querySelector('.fade-in-animation').classList.remove('run-animation');
            element.querySelector('.fade-in-animation').classList.add('clear-animation');
        }
    }

    useEffect(()=>{
        const element= previewRef.current;
        if( isActive === true && element.querySelector('.fade-in-animation') ){
            element.querySelector('.fade-in-animation').classList.add('run-animation')
        }

        if( element.querySelector('.run-animation') ){
            element.querySelector('.run-animation').addEventListener('animationend',afterAnimationDone)
        }

        return ()=>{
            const fadeInAnimation = element.querySelector('.fade-in-animation');
            if(fadeInAnimation){
                fadeInAnimation.classList.remove('run-animation');
                fadeInAnimation.classList.remove('clear-animation');
            }
        }

    },[id,isActive])

    return ( 
        <div className={`preview-item ${isActive === true ? 'active' : ''}`} ref={previewRef}>
            <FadeInAnimation className={`fade-in-animation ${isActive === true ? '' : 'clear-animation'}`}>
                <MovieDetail loading={state['loading']} data={state['data']}/>
            </FadeInAnimation>
        </div>
     );
}

export default PreviewItem;
import React from 'react';
import './Slider.scss'
import styled from 'styled-components';
import { getNamavaUrl } from '../../Utils/functions';
import { Link } from 'react-router-dom';
import ActionButtons from '../actionButtons/ActionButtons';

const Slide = styled.div`
        background-image: linear-gradient(rgba(18, 18, 18, 0) 10vw, rgb(18, 18, 18) 46.875vw), linear-gradient(to left, rgba(18, 18, 18, 0.7), rgba(18, 18, 18, 0) 50%), 
        url(${props => props["imageUrl"]});
        min-height: 100%;
        background-size: contain;
        background-repeat: no-repeat;
        padding-bottom: 40px;
    `;

function SliderItem({slider,className}) {


    


    return ( 
        <div className={`slider-container ${className}`} >

            {/* {slider['backgroundTrailerLandscapeVideoUrl'] !== null ?  
            (<div className="videoPlayer">
                <video class="t-movieSlider-0-1-214" playsinline="" preload="auto" autoPlay poster="https://static.namava.ir/Content/Upload/Images/f35c4a15-3fe9-4e41-8a65-8ef6f2db6c56.jpg?anchor=middlecenter&amp;crop=auto&amp;scale=both&amp;w=1920&amp;h=900">
                    <source type="video/mp4" src="https://static.namava.ir/Content/Upload/Images/37564ca6-7aa5-4da2-a53a-f759bd05fced.mp4" />
                </video>
                <Slide imageUrl=''>
                    <div className="slide-info-container">
                        {slider['logoImageUrl'] && (
                            <Link to='#' >
                                <img className='logo-image' src={getNamavaUrl(slider['logoImageUrl'])} alt={slider['title']} />
                            </Link>
                        )}
                        {
                            slider['title'] && (
                                <h2 className='title'>{slider['title']}</h2>
                            )
                        }
                        <ActionButtons item={slider} />
                    </div>
                </Slide>
            </div>)
            

            :

            (<Slide imageUrl={getNamavaUrl(slider['coverLandscape'])}>
                <div className="slide-info-container">
                    {slider['logoImageUrl'] && (
                        <Link to='#' >
                            <img className='logo-image' src={getNamavaUrl(slider['logoImageUrl'])} alt={slider['title']} />
                        </Link>
                    )}
                    {
                        slider['title'] && (
                            <h2 className='title'>{slider['title']}</h2>
                        )
                    }
                    <ActionButtons item={slider} />
                </div>
            </Slide>)
        
            }  */}

            <Slide imageUrl={getNamavaUrl(slider['coverLandscape'])}>
                <div className="slide-info-container">
                    {slider['logoImageUrl'] && (
                        <Link to='#' >
                            <img className='logo-image' src={getNamavaUrl(slider['logoImageUrl'])} alt={slider['title']} />
                        </Link>
                    )}
                    {
                        slider['title'] && (
                            <h2 className='title'>{slider['title']}</h2>
                        )
                    }
                    <ActionButtons item={slider} />
                </div>
            </Slide>
        </div>
     );
}

export default SliderItem;
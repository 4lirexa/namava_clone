import React, { useEffect, useState } from 'react';
import config from '../config';
import { fetchData } from '../Utils/functions';
import Comment from './Comment';
import './Comments.scss'

function Comments({mediaId}) {

    const [state,setState] = useState({
        comments : [],
        error : false,
        loading : false,
        pi : 0,
        showMoreComments : false,
    })

    useEffect(()=>{
        if(state['loading'] === false && state['error'] === false){
            fetchNextComments(1)
        }
    },[])

    const fetchNextComments = (pi)=>{

        fetchData(mediaId,"Comments",(result)=>{
            setState(state => ({...state,comments : [ ...state['comments'] , ...result],error: false ,loading: false,pi : pi ,showMoreComments : result.length < config.sections.Comments.ps ? false : true}))
        },()=>{},(isLoading)=>{
            if(isLoading){
                setState(state=>({...state,loading:true}))
            }
        },{
            mediaId : mediaId,
            perfileId : 0,
            pi : pi
        })

    }

    console.log('comments',state);
    return ( 
        <div className="comments">
            <div className="comments-header">
                نظرات کاربران
            </div>
            <div className="comments-container">
                {state['comments'].map(comment => (
                    <Comment comment={comment} key={`comment-${mediaId}-${comment['id']}-${comment['createDateUTC']}`} />
                ))}
                {state['showMoreComments'] && (
                    <div>
                        <div className="more-button" onClick={()=>{
                            fetchNextComments(state['pi'] + 1)
                        }}>
                            بیشتر
                        </div>
                    </div>
                )}
            </div>
        </div>
     );
}

export default Comments;
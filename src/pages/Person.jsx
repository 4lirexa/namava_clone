import React, { useEffect, useState } from 'react';
import { fetchData, getNamavaUrl } from '../Utils/functions';
import MultiLineList from '../componenets/RowList/MultiLineList';
import MovieItem from '../componenets/Movie/MovieItem';
import './Person.scss'


function Person({title,id}) {

    const [state,setState] = useState({
        id : undefined,
        data : null,
        loading : false,
        error : false
    });


    useEffect(()=>{
        if(state['loading'] === false && state['error'] === false && (state['data'] === null || state['id'] != id)){
            fetchData(id,"Person",(result)=>{
                setState({...state,id : id ,data : result , loading : false,error : false});
            },()=>{},(isLoading)=>{
                if(isLoading){
                    setState({...state,loading : true})
                }
            })
        }
    },[id,state])


    return (
        <div className="person-list container-fluid">
            <div className="row">
                <div className="col-12 p-0">
                    {state['loading'] !== true && state['data'] && (
                        
                        <>
                        
                            <div className="col-12 person-detail-container">
                                <img src={getNamavaUrl(state['data']['imageUrl'])} alt={state['data']['castName']} className="person-detail-image" />
                                <div className="person-info">
                                    <div className="person-title">
                                        {state['data']['castName']}
                                    </div>
                                    <div className="person-description" dangerouslySetInnerHTML={{__html:state['data']['fullDescription']}}></div>
                                </div>
                            </div>
                        
                        </>
                        
                    )}
                </div>
            </div>
            {(state['data'] != null && state['loading'] === false) && (
                <div className="row">
                <MultiLineList data={{
                    payloadType : 'personMovie',
                    payloadKey : id,
                    items : state['data']['medias'],
                    key : 'mediaId',
                }} showMore={false} Preview={true} ItemComponent={MovieItem}/>
                </div>
            )}
        </div>
    );
}

export default Person;
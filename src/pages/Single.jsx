import {React,useState,useEffect} from 'react';
import { useParams } from 'react-router-dom';
import MovieDetail from '../componenets/Movie/MovieDetail';
import {fetchData} from '../Utils/functions';
import TrailerList from '../componenets/RowList/TrailerList';
import './Single.scss'
import config from '../config';
import { getMediaDetailText } from '../Utils/functions';
import PersonItem from '../componenets/PersonItem';
import MultiLineList from '../componenets/RowList/MultiLineList';
import MovieItem from '../componenets/Movie/MovieItem';
import Comments from '../componenets/Comments';
import Seasons from '../componenets/Seasons';

function Single({id,title}) {
    const {type} = useParams();

    const [state,setState] = useState({
        id:null,
        data : null,
        error : false,
        loading : false,
    });

    useEffect( ()=>{

        if(  state['loading'] === false && state['error'] === false  && (state['data'] === null || state['id'] !== id)){
            const payloadType = type === 'movie' ? 'SinglePageMovie' : 'SinglePageSeries'; 
            fetchData( id,payloadType,
                (result) => {setState({...state,id,data : result,loading : false,error : false })},
                ()=>{},
                (isLoading)=>{
                    if(isLoading){
                        setState({...state,loading : true})
                    }
                }
                
            )
        }

    } , [state,id])

    console.log(title,id,type,state,);
    return ( 
        <div className="container-fluid single">
            { state['loading'] === false && state['data'] !== null && state['id'] === id}{
                <>
                    <div className="row p-0">
                        <MovieDetail data={state['data']} topMedia={true} />
                    </div>
                    {/* SEASONS */}
                    {state['data'] !== null && state['data']['seasons'] && (
                        <div className="row">
                            <div className="col-12 px-5 negative-margin">
                                <Seasons seasons={state['data']['seasons']} />
                            </div>
                        </div>
                    )}
                    {(state['data'] !== null && (state['data']['slideImageList'] && state['data']['slideImageList'].length > 0)) && (
                        <div className={`row px-5 ${state['data']['seasons'] ? '' : 'negative-margin'}`}>
                           <div className="col-12">
                                <TrailerList id={id} images={state['data']['slideImageList']} />
                           </div>
                        </div>
                    )}
                    <div className="row single-row">
                        <div className="col-12 px-5">
                            {state['data'] !== null && state['data']['movieLatinName'] && (
                                <div className="media-detail-latin-name">
                                    {state['data']['movieLatinName']}
                                </div>
                            )}
                            {state['data'] !== null && state['data']['caption'] && (
                                <div className="media-detail-title">
                                    درباره {(()=>{
                                        return state['data']['type'].toLowerCase() === config.SliderTypes.Series ? "سریال " : "فیلم "
                                    })()}
                                    {state['data']['caption']}
                                </div>
                            )}
                            {state['data'] !== null && state['data']['about'] && (
                                <div className="media-detail-description" dangerouslySetInnerHTML={{__html:state['data']['about']}}></div>
                            )}
                            {state['data'] !== null && state['data']['categories'] && (
                                getMediaDetailText('دسته بندی',state['data']['categories'],10,'category',' , ')
                            )}
                            {state['data'] !== null && state['data']['voiceList'] && (
                                getMediaDetailText('صدا',state['data']['voiceList'],10,'language',' , ')
                            )}
                            {state['data'] !== null && state['data']['subtitleList'] && (
                                getMediaDetailText('زیرنویس',state['data']['subtitleList'],10,'language',' , ')
                            )}
                        </div>
                    </div>
                    <div className="row">
                        {(state['data'] !== null && state['data']['casts'] && state['data']['casts'].length > 0) && (
                            <MultiLineList data={{
                                payloadType : "PersonList",
                                payloadKey : id,
                                items : state['data']['casts'],
                                key : 'castId',
                                slug : 'castRole'
                            }} Preview={false} ItemComponent={PersonItem} placeholder={false}/>
                        )}
                    </div>
                    <div className="row">
                        <MultiLineList data={{
                            payloadType : "SinglePageRelated",
                            payloadKey : id,
                            options : {
                                categoryId : ( state['data'] != null && state['data']['categories'] && state['data']['categories'].length > 0) ? state['data']['categories'][0]['categoryId'] : undefined ,
                            },
                            maxItems : 16,
                        }} Preview={true} firstRequest={true} ItemComponent={MovieItem}/>
                    </div>
                    <Comments mediaId={id} />
                </>
            }
        </div>
     );
}

export default Single;
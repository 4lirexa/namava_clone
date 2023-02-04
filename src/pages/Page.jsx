import React, { useEffect } from 'react';
import Slider from '../componenets/Slider/Slider';
import 'bootstrap/dist/css/bootstrap-grid.min.css'
import RowList from '../componenets/RowList/RowList';
import { useMenusContext,types } from '../context/MenuContext';
import config from '../config';
import {getItemComponent} from '../Utils/functions';
import AdsItem from '../componenets/AdsItem/AdsItem';
import BannerItem from '../componenets/BannerItem/BannerItem';
import { useLocation } from 'react-router-dom';



function Page() {

    console.log('asd');
    let {state : menus,dispatch} = useMenusContext();

    let location = useLocation();

    console.log(location);
    let page ;
    if(menus['loading'] === false && menus['data'] !== null ){
        page = menus['data'].find(menuItem => {
            if(menuItem['slug'] != "" && menuItem['slug'] === location.pathname.substring(1).toLowerCase()){
                console.log('1');
                return true;
            }
            if(menuItem['slug'] === 'index' && location.pathname === '/'){
                console.log('2');
                return true;
            }
            console.log('3');
            return false;
        })
    }
    console.log(page);
    return ( 
        
        <div className="container-fluid">
            <div className="row">
                { (menus.succeeded === true && menus.loading === false && page) && page.pageItems.map( ({payloadType,payloadKey, ...pageItem})=>{
                    let section = undefined;
                    let preview = false;

                    switch(payloadType){
                        case config.pageItemsType.Slider:
                            section = <Slider key={`page-section-${pageItem['pageItemId']}`} sliderID={payloadKey}/>
                            break;
                        case config.pageItemsType.Latest:
                        case config.pageItemsType.LatestEpisods:
                        case config.pageItemsType.CategoryGroup:
                        case config.pageItemsType.ExclusiveDubs:
                        case config.pageItemsType.PostGroup:
                            preview = true;
                            let itemComponent = getItemComponent(payloadType);
                            
                            if(page['slug'] === 'movies'){
                                switch(payloadType){
                                    case config.pageItemsType.Latest:
                                        payloadType = config.pageItemsType.LatestMovies;
                                        break;
                                }
                            }
                            
                            section = <RowList key={`page-section-${pageItem['pageItemId']}`} data={{
                                payloadType,
                                payloadKey,
                                title : pageItem['caption']
                            }} ItemComponent={itemComponent} Preview={preview}/>
                            break;
                        case config.pageItemsType.Advertisement:
                            section = <RowList className="Advertisement" key={`page-section-${pageItem['pageItemId']}`}  data={{
                                payloadType,
                                payloadKey,
                            }} ItemComponent={AdsItem}/>
                            break;
                        case config.pageItemsType.BannerGroup:
                            section = <RowList className="Banner" key={`page-section-${pageItem['pageItemId']}`}  data={{
                                payloadType,
                                payloadKey,
                            }} ItemComponent={BannerItem}/>
                            break;
                        default:
                            section = undefined;
                    }


                    return section;

                } ) }
            </div>
        </div>
     );
}

export default Page;
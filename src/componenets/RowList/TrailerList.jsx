import React from 'react';
import { SRLWrapper } from 'simple-react-lightbox';
import RowList from '../RowList/RowList'
import TrailerItem from './TrailerItem';
import './TrailerList.scss'

function TrailerList({id,images}) {

    let items = [];
    images.forEach((image,index) => {
        items.push({
            id : `${id}-${index}`,
            imageUrl : image['url'] + '?anchor=middlecenter&crop=auto&scale=both&w=400&h=300',
            fullImageUrl : image['url'],
        })
    });

    console.log(items);
    return ( 

        <div className="trailer-list">
            <h3 className="title">
                <span>تریلر, تصاویر و جزییات</span>
            </h3>
            <div className="row">
                <div className="col-12 p-0">
                    <SRLWrapper options={{
                        showDownloadButton: false,
                        autoplaySpeed: 0,
                        showThumbnails: false,
                        showCaption:false,
                    }}>
                        <RowList ItemComponent={TrailerItem} data={{payloadType : 'TrailerList',payloadKey : id , items}} placeholder={false} />
                    </SRLWrapper>
                </div>
            </div>
        </div>

     );
}

export default TrailerList;
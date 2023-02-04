import React from 'react';
import ImageRealLazyLoad from 'real-react-lazyload';
import { getNamavaUrl } from '../../Utils/functions';
import './AdsItem.scss'
function AdsItem({item,placeholder = false}) {
    return ( 
        <div className="ads-item">
            <a href="#" target="_blank">
                {/* {placeholder === false && (
                    <ImageRealLazyLoad src={getNamavaUrl(item['imageUrl'])} alt={item['caption']} />
                )} */}
            </a>
        </div>
     );
}

export default AdsItem;
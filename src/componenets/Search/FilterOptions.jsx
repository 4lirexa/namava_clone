import React from 'react';
import './FilterOptions.scss'
import OptionItem from '../../context/OptionItem';
import RangeSlider from '../RangeSlider';
import { types } from '../../context/FilterContext';

let domain = [1900,2022]
function FilterOptions({dispatch,filter}) {

    let options = [];
    let optionIndex = 0;
    let optionItems = [];
    for (let i = 0; i < filter.options.length; i++) {
        optionItems.push(
            <OptionItem option={filter['options'][i]} type={filter['type']} key={`filter-option-item-${filter['filterId']}-${filter['options'][i]['optionId']}`} onClick={()=>{
                if(filter['options'][i].selected === false || filter['type'] === 'radio'){
                    dispatch({
                        type : types.SELECT_OPTION,
                        filterId : filter['filterId'],
                        optionId : filter['options'][i].optionId,
                        optionIndex : i,
                        optionCaption : filter['options'][i].caption,
                        filterType : filter['type'],
                    })
                }else{
                    dispatch({
                        type : types.DESELECT_OPTION,
                        filterId : filter['filterId'],
                        optionId : filter['options'][i].optionId,
                        optionIndex : i,
                        optionCaption : filter['options'][i].caption,
                        filterType : filter['type'],
                    })
                }
            }} />
        )
        if(optionItems.length === 5 || i + 1 === filter.options.length){
            options.push(
                <div className="options" key={`options-${filter['filterId']}-${optionIndex++}`}>
                    {optionItems}
                </div>
            );
            optionItems = [];
        }
        
    }
    
    let [min,max] = domain;
    if(filter['selected'].length > 0){
        if(typeof filter['selected'][0]['optionId'] !== 'number'){
            [min,max] = filter['selected'][0]['optionId'].split('-')
        }
        
    }
    return ( 
        <div className="options-container">
            {filter['type'] === 'range-slider' ? <GetSlider min={min} max={max} domain={domain} dispatch={dispatch} filter={filter}/> : options}
        </div>
     );
}

export default FilterOptions;

const GetSlider = ({dispatch,filter,domain,min,max})=>{
    
    return <RangeSlider domain={domain} min={min} max={max} onChange={([min,max])=>{
        dispatch({
            type : types.SELECT_OPTION,
            filterId : filter['filterId'],
            optionId :`${Math.floor(min)}-${Math.floor(max)}`,
            optionCaption :`${Math.floor(min)}-${Math.floor(max)}`,
            filterType : 'radio'
        })
    }} />
}
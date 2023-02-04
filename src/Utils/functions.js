import MovieItem from "../componenets/Movie/MovieItem"
import ExclusiveDubItem from "../componenets/ExclusiveDubItem/ExclusiveDubItem"
import config from "../config"
import namava from "./namava"
import momentj from 'moment-jalaali'
import 'moment-timezone'
import fa from 'moment/dist/locale/fa'

export const getNamavaUrl = (url) => {
    return 'https://namava.ir' + url
}

export function getItemUrl(item,itemType = false){
    
    
    let type = config.SliderTypes.Movie.toLowerCase();

    if(item['type'] !== null && item['type'] === config.SliderTypes.Series){
        type = config.SliderTypes.Series.toLowerCase();
    }

    let title = item['title'] || item['caption'] || item['castName'];

    if(title){
        title = title.replace(/[^a-zA-Z0-9\u0633\u06A9\u06AF\u06C0\u06CC\u060C\u062A\u062B\u062C\u062D\u062E\u062F\u063A\u064A\u064B\u064C\u064D\u064E\u064F\u067E\u0670\u0686\u0698\u200C\u0621-\u0629\u0630-\u0639\u0641-\u0654]/g, '_');
    }

    let link = '/'
    if(itemType === false){
        link = `/${type}/`;
    }else if(itemType === "Collection"){
        link = '/collection-'
    }else if(itemType === "Person"){
        link = '/person-'
    }

    const prefix = '-';
    if(item['id'] && itemType === false){
        link += item['id'];
    }
    if(item['referenceId'] && itemType === "Collection"){
        link += item['referenceId'];
    }
    if(item['castId'] && itemType === "Person"){
        link += item['castId'];
    }
    if(title){
        link += prefix + title;
    }

    return link;
}

export const fetchData = async (payloadKey,payloadType,onSuccess,onError,setLoading,options = {}) => {
    if(setLoading){
        setLoading(true)
    }
    let section = config.sections[payloadType];
    if(section === undefined || section === null){
        if(setLoading){
            setLoading(false)
        }
        onError(`PayloadType : ${payloadType} is not Supported in url`)
        return;
    } 
    let url = section.url.replace('{{PAYLOAD_KEY}}',payloadKey);
    let params = {};
    for(let key in section){
        if(key !== 'url'){
            params[key] = options[key];
            if(params[key] === undefined && section[key] !== undefined){
                params[key] = section[key];
            }
        }
    }
    
    let {data : {succeeded,result,error}} = await namava.get(url,{
        params : params
    })

    if(setLoading){
        setLoading(false)
    }
    if(succeeded === true && error === null && Array.isArray(result) && result.length > 0){
        onSuccess(result);
    }else if(succeeded === true && error === null && Array.isArray(result) && result.length === 0){
        onError(error)
    }else if(succeeded === true && error === null && Array.isArray(result) === false){
        if(payloadType === "SinglePageRelated"){
            console.log('okkk');
            onSuccess(result['items']);
        }else{
            onSuccess(result);
        }
    }else{
        onError(error)
    }



}
export const fetchBriefData = async (id,onSuccess,onError,setLoading) => {
    if(setLoading){
        setLoading(true)
    }
    let section = config.sections.BreifData;
    if(section === undefined || section === null){
        if(setLoading){
            setLoading(false)
        }
        onError(`PayloadType : BreifData is not Supported in url`)
        return;
    } 
    let url = section.url.replace('{{ID}}',id);
    
    let {data : {succeeded,result,error}} = await namava.get(url)
    if(setLoading){
        setLoading(false)
    }
    if(succeeded === true && error === null){
        onSuccess(result);
    }else{
        onError(error)
    }

}
export const getItemComponent = (payloadType)=>{
    switch (payloadType){
        case config.pageItemsType.Latest:
        case config.pageItemsType.LatestEpisods:
        case config.pageItemsType.CategoryGroup:
        case config.pageItemsType.PostGroup:
            return MovieItem;
        case config.pageItemsType.ExclusiveDubs:
            return ExclusiveDubItem;
        default :
        return undefined;
    }
}

export function getCoords(elem) {
    const box = elem.getBoundingClientRect();

    const body = document.body;
    const docEl = document.documentElement;

    const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    const scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

    const clientTop = docEl.clientTop || body.clientTop || 0;
    const clientLeft = docEl.clientLeft || body.clientLeft || 0;

    const top  = box.top +  scrollTop - clientTop;
    const left = box.left + scrollLeft - clientLeft;

    return { top: Math.round(top), left: Math.round(left) };
}

export function getMediaDetailText(caption,items,maxLength,keyType,separator = '-'){

    const content = [];
    if(items === null || items.length === 0){
        return;
    }
    const max = maxLength > items.length ? items.length : maxLength
    for (let i = 0; i < max; i++) {
        content.push(<a href="#" key={`text-${keyType}-${items[i][keyType + 'Id']}`}>{items[i][keyType + "Name"] || items[i]["name"]}</a>)
        content.push(<span key={`text-separator-${keyType}-${items[i][keyType + 'Id']}`} className='separator'>{separator}</span>)
    }

    content.pop()

    return (

        <div className="detail-row text-row">
            <span>{caption}:</span>
            {content}
        </div>

    )

}

export function searchCountriesFilter(params,filters){
    let countries = [];
    let optionsId = params.get('country') ? params.get('country').split(',') : [];
    let countryFilter;
    for (const key in filters) {
        if (filters[key]['slug'] === "country") {
            countryFilter = filters[key];
            break;
        }
    }
    if(countryFilter){
        optionsId.forEach(optionId => {
            let option = countryFilter.options.find(filterOption => filterOption['optionId'] == optionId);
            if(option && option['slug']){
                countries.push(option['slug'])
            }
        });
    }
    return {
        CountryProducer : countries.length > 0 ? countries.join(',') : undefined,
    }
}

export function searchGenreFilter(params,filter){
    let optionsId = params.get('genre') || undefined;
    return{
        subcategories : optionsId
    }
}

export function searchYearFilter(params,filters){
    let year = params.get('year') || undefined;

    let startYear,endYear;
    if(year){

        let parts = year.split('-');
        momentj.locale("fa", fa);
        momentj.loadPersian({
            usePersianDigits: false ,
        });
        startYear = new momentj(parts[0]).tz("Asia/Tehran").locale('fa').format("jYYYY");
        endYear = new momentj(parts[1]).tz("Asia/Tehran").locale('fa').format("jYYYY");

    }

    return{
        ADProductionYear : year,
        PersianProductionYear : (startYear && endYear) ? `${startYear}-${endYear}` : endYear
    }

}

export function searchSortFilter(params,filters){
    let countries = [];
    let sort = params.get('sort') ? params.get('sort').split(',') : [];
    if(sort){
        let sortFilter;
        for (const key in filters) {
            if (filters[key]['slug'] === "sort") {
                sortFilter = filters[key];
                break;
            }
        }
        if(sortFilter && sortFilter.selected.length > 0){
            sort = sortFilter.options[sortFilter.selected[0].optionIndex].slug;
        }
    }
    
    return {
        searchOrderType : sort,
    }
}

export function searchDubsSubtitleFilter(params,filters){
    let entityTypes = {
        "FilterItemDubbed": "dubs",
        "FilterItemVoice": "language",
        "FilterItemSubtitle": "subtitle",
        "FilterItemVoiceForDeaf": "forIndistinct",
    }
    let searchFilters = {
        dubs: undefined,
        subtitle: undefined,
        language: undefined,
        forIndistinct: undefined,
    }

    let optionsId = params.get('cognition') ? params.get('cognition').split(',') : [];
    let cognitionsFilter;
    for (const key in filters) {
        if (filters[key]['slug'] === "cognition") {
            cognitionsFilter = filters[key];
            break;
        }
    }
    if(cognitionsFilter){
        optionsId.forEach(optionId => {
            let option = cognitionsFilter.options.find(filterOption => filterOption['optionId'] == optionId);
            if(option && option['slug'] && option['entityType']){
                if(searchFilters[entityTypes[option['entityType']]] === undefined){
                    searchFilters[entityTypes[option['entityType']]] = [option['slug']]
                }else{
                    searchFilters[entityTypes[option['entityType']]].push(option['slug']);
                }
            }
        });
    }

    for (const key in searchFilters) {
        if (searchFilters[key] !== undefined) {
            searchFilters[key] = searchFilters[key].join(',')
        }
    }
    if(searchFilters['forIndistinct'] !== undefined){
        searchFilters['forIndistinct'] = true;
    }

    return searchFilters;
}
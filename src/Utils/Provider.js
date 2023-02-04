import React from 'react';
import { MenusProvider } from '../context/MenuContext';
import { SliderProvider } from '../context/SliderContext';
import SimpleReactLightBox from 'simple-react-lightbox';

function Provider({children}) {
    return ( 
        <MenusProvider>
            <SimpleReactLightBox>
                <SliderProvider>
                    {children}
                </SliderProvider>
            </SimpleReactLightBox>
        </MenusProvider>
     );
}

export default Provider;
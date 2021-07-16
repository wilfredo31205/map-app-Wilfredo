


import React from 'react'


import  { SocketProvider } from './Context/SocketContext';

import {  MapaPages } from './pages/MapaPages';

import ReactMapGL from 'react-map-gl';

export const MapasApp = () => {




    return (

        <ReactMapGL>

          <SocketProvider>



           <MapaPages/>

              
         </SocketProvider>

         </ReactMapGL>
          

        
        


     
    );
}

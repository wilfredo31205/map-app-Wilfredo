

import React, { useContext ,useEffect, Fragment } from 'react'
import { useMaxbox } from '../hooks/useMaxbox';


import { SocketContext } from '../Context/SocketContext';

//import workerClass from 'worker-loader';

//import ReactMapGL from 'react-map-gl';

import  ReactMapGL from 'react-map-gl'

const puntoInicial = {


    lng: -69.9140,
    lat: 18.4603,
    zoom: 15.75




}




export const MapaPages = () => {


// eslint-disable-next-line import/no-webpack-loader-syntax
//mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;


    const { setRef, Coords  ,   NuevoMarcador$ , MovimientoMarcador$ , agregarMarcador , ActualizarPosicion } = useMaxbox(puntoInicial);

 

        const {socket } = useContext(SocketContext);


        // Escuchar los marcadores existentes

    

        useEffect(() => {


    

            socket.on('marcadores-activos',(marcadores) =>{ // esto es lo que voy a escuchar cada vez que el backend dispare marcadores activos 

                // va a rergesar un objeto vacio un objeto con los marcadores activos que esta en el archivo marcadores.js


                for(const key of Object.keys(marcadores)){ // mandando a recorrer el objeto de marcadores que viene directamente del archivo usemaxbox.



                    agregarMarcador(marcadores[key], key); // en el key que esta afuera del objeto le mandamos el id  // esta funcion de agregar marcador que esta en useMaxbox.js , recibe un evento que es  "E"  ese evento va a hacer
                    //  agregarMarcador(marcadores[key]); el marcador que esta en este parentesis, que va a estar el id , la longitud y la latitud 

                 //   console.log(marcadores [key]);  // obteniendo los marcodores en el objeto


                }
                

            
                //console.log(marcador);

  



            })

          
          
          
        }, [socket,agregarMarcador]);

        









  //  Escuchando que un  cliente este conectado


    // useEffect(() => {
    //    
        // socket.on('mapa',(mapa)=>{

            // console.log(mapa);



        // })
        // 

    // 

    //    
    //    
    // }, [socket]);










     
 // pora nuevo marcado
     useEffect(() => { // pasandole la referencia de los marcadores 
        NuevoMarcador$.subscribe(marcador =>{

           

            socket.emit('marcador-nuevo',marcador);




            //console.log('MapaPages');
        //console.log(market);

        });
         
         
     }, [NuevoMarcador$,socket]);


     // TODO TAREA 


     // Movimiento del marcador 

     useEffect(() => { 
        MovimientoMarcador$.subscribe(marcador =>{

            socket.emit('marcador-actualizado' ,marcador); // cuando se mueve el marcador 

        
            
        })
         
         
     }, [socket ,MovimientoMarcador$]);



     // mover marcador mediante socket 

        useEffect(() => {
           

            socket.on('marcador-actualizado' , (marcador) =>{ // escuchando cuando alguien dispare un mascador actualizado 
            
            ActualizarPosicion(marcador)

             })


           
        }, [ socket , ActualizarPosicion ])






     // escuchar nuevo marcador 

     useEffect(() =>{


        socket.on('marcador-nuevo',(marcador) =>{

            agregarMarcador(marcador , marcador.id); // mostrando los nuevos marcadores en los demas clientes , que de igual manera se le pasa el marcador y el id 
            // le pasamos agregarMarcador ya que cuando recargue la pantalla no se desaparezcan los marcadores y se queden activo , es decir que a la hora de hacer click
            // deben de aparecer en todos los clientes conectados 




           // console.log(marcador);




        });
        
        
        
        
     }, [socket,agregarMarcador])


    return (

        <Fragment>


        <div className="info">

        Lng : { Coords.lng} | lat: {Coords.lat} | zoom: {Coords.zoom}




        </div>







       <div

       ref={setRef}
       
       className="mapContainer" // elemento donde va a mostrar nuestro mapa  
       
       
       
       
       
       
       
       
       
       
       
       />




            
        </Fragment>
    )
}

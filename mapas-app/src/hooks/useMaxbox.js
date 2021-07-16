

import { useState , useRef , useEffect, useCallback  } from 'react';
import mapboxgl from 'mapbox-gl';

import { v4} from 'uuid';

import { Subject } from 'rxjs';

 //TODO CAMBIAR API KEY
 mapboxgl.accessToken = 'pk.eyJ1Ijoid2lsZnJlZG8zMiIsImEiOiJja3FiY3B4c3AwbnRwMnVvM3NxY3Y3enpuIn0.B6KQb-4bI0HA8bEuKt9QQA';



export const useMaxbox = (puntoInicial) => {



    const Mapadiv =  useRef() // teniendo la referencia sin importar que el componente se pueda redibujar 
    //   const [mapa,setMapa] = useState();



        // referencia al div del mapa 


        //const mapaDiv = useRef();

        const setRef = useCallback((node) =>{ // obteniendo la referencia del mapa  , con usecallback memorizamos el producto



            Mapadiv.current = node;



        },[])


        // referencia a los marcadores 


        const marcadores  = useRef({}); 


        // observables de rxjs


        const MovimientoMarcador = useRef(new Subject())      // relacionado con el movimiento del marcador 


        
        const NuevoMarcador = useRef(new Subject())     // relacionado con el movimiento del marcador 

        // el Subject es un tipo especial de  observable, en el cual nos permite la facilidad de suscribirme y emitir valores donde quiera


    //    NuevoMarcador.current.subscribe(); // suscribiendo el marcdor 











        // mapa  y coords(cordenadas)



        const mapa = useRef();// useRef se utiliza para mantener una referencia 
       const [Coords, setCoords] = useState(puntoInicial) // colocando las cordenadas que estan en la variable puntoInicial




       // Funcion para agregar marcadores


            const agregarMarcador = useCallback((e, id )=>{ // e= evento 

                const { lng , lat  } = e.lngLat  ||e; // si el objeto no tiene la propiedad entonces que pregunte por el evento, es decir que si es undefined que pregunte por el evento si tiene la longitutsd y la latitud 


   

                const market = new mapboxgl.Marker(); // con esto se crea el nuevo marcador 



                market.id = id ?? v4(); // TODO  si el marcador tiene id , // si viene el id utiliza el id en caso contrario  utilizar el uuid para generarlo 
                
                market
                .setLngLat([lng , lat])   // setLngLat  es latitud y longitud asi funciona maxbox 
                .addTo(mapa.current) // referencia del mapa , renderizandolo
                .setDraggable(true); // para que se pueda deslizar
                marcadores.current[market.id] = market //.current para hacer referencia al valor actual  , market.id va a puntar al market  que tiene todas las propiedades 



                    // TODO :  si el marcador tiene id no emitir 
                    
                  //  NuevoMarcador.current.next( market); // next es el siguiente valor a emitir  , mandando a emitir el market, porque tiene su id y mas informaciones , esta es una manera la otra es la siguiente 



                  // mandando a llamar este next si estoy creando los marcadores que vienen de mi backend 

                  if(!id){// si no hay id o sino no existe

                    NuevoMarcador.current.next({ // solo aqui es que mandamos a llamar este evento,  es decir sino tenemos id 
                        id: market.id,
                        lng,
                        
                        lat
                     });



                  }



                    // Escuchar movimiento del marcador 

                    market.on('drag',({target})=>{ // drag es un evento de maxbox, para saber mas evento , visitar maxbox 


                        const { id  } = target; 

                        const { lng , lat } = target.getLngLat();


                        console.log(lng, lat);


                        //TODO : emitir los cambios del marcador 


                        MovimientoMarcador.current.next({id, lng,lat})// para emitir el siguiente valor que son el id, lng y lat 


                    })






            },[])




            // Funcion para actualizar la ubicacion del marcador 


            const ActualizarPosicion = useCallback(({ id , lng,lat})=> { // useCallback para memorizarlo // recibiendo el marcador, que ahi viene la longitud, latitud ect.. 
                // marcador que esta como parametro es un objeto en la cual vienen esas propiedades, no es un market de usemaxbox 


                marcadores.current[id].setLngLat([ lng, lat ]) //.current son market o propiedades de usemaxbox de igual manera setlnglat en el es un arreglo que tiene la longitud y la latitud 





            },[])






   useEffect( ()=>{
       
       const map = new mapboxgl.Map({
           container: Mapadiv.current,
           style: 'mapbox://styles/mapbox/streets-v11',
           center : [ puntoInicial.lng , puntoInicial.lat], //  en maxbox el mapa empieza con longitud primero y latitud despues
           zoom : puntoInicial.zoom
           });
           mapa.current = map; // COMO ESTAMOS USANDO0 EL USEREF EL VALOR ACTUAL ES MAPA.CURRENT  Y ES IGUAL AL MAP  QUE ES ESTO //const map = new mapboxgl.Map({
           //setMapa(map);
       
       
       
   },[puntoInicial])




// Cuando se mueva el Mapa 
useEffect(()=>{
    mapa.current?.on('move',()=>{



        const { lng , lat } = mapa.current.getCenter(); // obteniendo las cordenadas  // estos eventos estan en la documentacion de maxboxmapbox.com/
        setCoords({
            lng:lng.toFixed(4),
            lat:lat.toFixed(4),
            zoom: mapa.current.getZoom().toFixed(2)
                    
            // en cada lado donde diga mapa.current , estamos haciendo el uso de la referencia useref
        })
       // console.log(lng, lat);
        //console.log('????');
    })
      //  return mapa?.off('move'); // si existe el mapa cancela O LIMPIA EL MOVE 
},[]);




    // Agregar marcadores cuando hago click 



    useEffect(() => {
       
      
        
        mapa.current?.on('click',(e)=>{


            agregarMarcador(e);


        })

    }, [ agregarMarcador]);







    return{

        Coords,
        marcadores,
        NuevoMarcador$ : NuevoMarcador.current,// se le coloca un signo de dolar al observable cuando es un observable en el cual podemos suscribirnos 
        MovimientoMarcador$: MovimientoMarcador.current,
        setRef,
     agregarMarcador,
     ActualizarPosicion





    }



      
    
}

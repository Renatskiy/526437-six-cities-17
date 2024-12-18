
import {useEffect, useState, useRef} from 'react';
import leaflet from 'leaflet';
import { TCity } from '../types/cityTypes';
// import { useSelector } from 'react-redux';
// import { RootState } from '../types/rootStateTypes';


export default function useMap(mapRef: React.MutableRefObject<HTMLInputElement | null> , city: TCity) {
  const [map, setMap] = useState<null | leaflet.Map>(null);
  // const activeCity = useSelector((state: RootState) => state.selectedCity);
  const isRenderedRef = useRef(false);
  useEffect(() => {

    console.log(isRenderedRef.current);
    if (mapRef.current !== null && !isRenderedRef.current) {
      console.log('asdfasdfasdfa');
      const instance = leaflet.map(mapRef.current, {
        center: {
          lat: city?.location?.latitude,
          lng: city?.location?.longitude,
        },
        zoom: city?.location?.zoom,
      });

      leaflet
        .tileLayer(
          'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
          {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          },
        )
        .addTo(instance);

      setMap(instance);
      isRenderedRef.current = true;
    }
  }, [mapRef, city]);

  return map;
}

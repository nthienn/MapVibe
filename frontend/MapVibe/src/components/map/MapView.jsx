import { useEffect, useRef } from "react";
import mapvinagl from "mapvina-gl";

const DEFAULT_ZOOM = 15;

const MapView = ({
  latitude = null,
  longitude = null,
  zoom = DEFAULT_ZOOM,
}) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  const hasCoordinates =
    latitude !== null &&
    latitude !== undefined &&
    longitude !== null &&
    longitude !== undefined;

  useEffect(() => {
    if (!mapContainerRef.current || !hasCoordinates) return;

    const lat = Number(latitude);
    const lng = Number(longitude);

    if (Number.isNaN(lat) || Number.isNaN(lng)) return;

    const map = new mapvinagl.Map({
      container: mapContainerRef.current,
      style: `https://maps.mapvina.com/styles/v2/streets.json?key=${
        import.meta.env.VITE_MAPVINA_KEY
      }`,
      center: {
        lat,
        lng,
      },
      zoom,
    });

    mapRef.current = map;

    map.addControl(
      new mapvinagl.NavigationControl({
        showZoom: true,
        showCompass: false,
      }),
      "top-right",
    );

    markerRef.current = new mapvinagl.Marker({
      draggable: false,
    })
      .setLngLat([lng, lat])
      .addTo(map);

    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }

      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [latitude, longitude, zoom, hasCoordinates]);

  if (!hasCoordinates) {
    return null;
  }

  return (
    <div ref={mapContainerRef} className="map-view" id="singleListingMap"></div>
  );
};

export default MapView;

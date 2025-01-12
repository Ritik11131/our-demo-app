import { useEffect, useRef, memo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface GenericMapProps {
  geojsonData?: GeoJSON.FeatureCollection;
  markers?: { colorCode: string; items: { name: string; latitude: number; longitude: number }[] };
  className?: string;
}

const GenericMap = memo(({ geojsonData, markers = { colorCode: '', items: [] }, className = 'h-[500px] w-full' }: GenericMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null);
  const markerLayerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize the map
    mapInstanceRef.current = L.map(mapRef.current, {
      center: [0, 0], // Initial center
      zoom: 2, // Initial zoom level
    });

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapInstanceRef.current);

    // Only initialize marker layer if markers are expected
  if (markers && markers.items.length > 0) {
    markerLayerRef.current = L.layerGroup().addTo(mapInstanceRef.current);
  }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Remove existing GeoJSON layer if it exists
    if (geoJsonLayerRef.current) {
      geoJsonLayerRef.current.remove();
    }

    // Add new GeoJSON layer if geojsonData is valid
    if (geojsonData && geojsonData.features.length > 0) {
      geoJsonLayerRef.current = L.geoJSON(geojsonData, {
        pointToLayer: (feature, latlng) => {
          return L.marker(latlng);
        },
        onEachFeature: (feature, layer) => {
          if (feature.properties?.name) {
            layer.bindPopup(feature.properties.name);
          }
        },
      }).addTo(mapInstanceRef.current);

      const bounds = geoJsonLayerRef.current.getBounds();
      mapInstanceRef.current.fitBounds(bounds);
    }
  }, [geojsonData]);

  useEffect(() => {
    if (!mapInstanceRef.current || !markerLayerRef.current) return;

    // Clear existing markers
    markerLayerRef.current.clearLayers();

    // Add markers to the layer
    markers?.items?.forEach(({ latitude, longitude, name }) => {
      if (latitude && longitude) {
        const circle: L.CircleMarker = L.circleMarker([latitude, longitude], {
          radius: 5,
          color: markers.colorCode || 'blue',
          fillColor: markers.colorCode || 'blue',
          fillOpacity: 0.5,
        }).bindPopup(name);
        markerLayerRef.current?.addLayer(circle);
      }
    });

    // Adjust map bounds to fit markers
    if (markers.items.length > 0) {
      const bounds = L.featureGroup(
        markers.items.map(({ latitude, longitude }) =>
          L.circleMarker([latitude, longitude])
        )
      ).getBounds();
      mapInstanceRef.current.fitBounds(bounds);
    }
  }, [markers]);

  return <div ref={mapRef} className={className} />;
});

export default GenericMap;
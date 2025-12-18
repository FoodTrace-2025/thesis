import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";

type LatLng = { lat: number | null; lng: number | null } | null;

interface SelectorMapProps {
  latLng: LatLng;
  isOpen: boolean;
  onSelect: (coords: { lat: number; lng: number }) => void;
}

const defaultCenter: [number, number] = [65.0121, 25.4651]; // Oulu fallback

function ResizeHandler({ isOpen }: { isOpen: boolean }) {
  const map = useMap();
  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    const doInvalidate = () => {
      if (cancelled) return;
      const container = map.getContainer?.();
      if (!container) return;
      map.invalidateSize();
    };
    map.whenReady(doInvalidate);
    const timeout = setTimeout(doInvalidate, 250);
    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [isOpen, map]);
  return null;
}

function Recenter({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

function ClickHandler({ onSelect }: { onSelect: (coords: { lat: number; lng: number }) => void }) {
  useMapEvents({
    click(e) {
      onSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

const markerIcon = L.divIcon({
  className: "leaflet-div-icon",
  html:
    '<div style="width:14px;height:14px;border-radius:7px;background:#2F7D32;border:2px solid white;box-shadow:0 0 4px rgba(0,0,0,0.4);"></div>',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

export function SelectorMap({ latLng, onSelect, isOpen }: SelectorMapProps) {
  const center = useMemo<[number, number]>(() => {
    if (latLng && latLng.lat != null && latLng.lng != null) {
      return [latLng.lat, latLng.lng];
    }
    return defaultCenter;
  }, [latLng]);

  // Extra guard for build-time/static render
  if (typeof window === 'undefined') return null;

  return (
    <MapContainer
      center={center}
      zoom={latLng?.lat ? 13 : 5}
      style={{ height: "320px", width: "100%" }}
      scrollWheelZoom
    >
      <ResizeHandler isOpen={isOpen} />
      <Recenter center={center} />
      <ClickHandler onSelect={onSelect} />
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {latLng && latLng.lat != null && latLng.lng != null && (
        <Marker position={[latLng.lat, latLng.lng]} icon={markerIcon} />
      )}
    </MapContainer>
  );
}

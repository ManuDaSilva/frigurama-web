"use client";

import { useRef, useEffect } from "react";

type Props = {
  lat?: number | null;
  lng?: number | null;
  address?: string;
  onChange: (v: { lat: number; lng: number; address: string }) => void;
};

export default function GoogleMap({ lat, lng, address, onChange }: Props) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    async function init() {
      // 1. Definir configuración API (Next.js ya carga el script)
      // @ts-ignore
      google.maps.importLibrary;

      // 2. Importar librerías necesarias
      const { Map } = (await google.maps.importLibrary("maps")) as google.maps.MapsLibrary;
      const { Marker } = (await google.maps.importLibrary("marker")) as google.maps.MarkerLibrary;
      const { Geocoder } = (await google.maps.importLibrary("geocoding")) as google.maps.GeocodingLibrary;
      const { PlacesService, Autocomplete } = (await google.maps.importLibrary("places")) as any;

      // 3. Posición inicial (si no tienes valores aún)
      const center = {
        lat: lat ?? 41.387,
        lng: lng ?? 2.17,
      };

      // 4. Crear mapa
      const map = new Map(mapRef.current!, {
        center,
        zoom: 15,
        streetViewControl: false,
      });

      // 5. Crear marcador
      const marker = new Marker({
        position: center,
        map,
        draggable: true,
      });

      const geocoder = new Geocoder();

      // =============== AUTOCOMPLETE (BUSCADOR) ===============
      if (inputRef.current) {
        const auto = new Autocomplete(inputRef.current, {
          fields: ["geometry", "formatted_address"],
        });

        auto.addListener("place_changed", () => {
          const place = auto.getPlace();
          if (!place.geometry) return;

          const newLat = place.geometry.location?.lat()!;
          const newLng = place.geometry.location?.lng()!;
          const formatted = place.formatted_address ?? "";

          marker.setPosition({ lat: newLat, lng: newLng });
          map.panTo({ lat: newLat, lng: newLng });

          onChange({
            lat: newLat,
            lng: newLng,
            address: formatted,
          });
        });
      }

      // =============== ARRASTRAR MARCADOR ===============
      marker.addListener("dragend", async () => {
        const pos = marker.getPosition();
        if (!pos) return;

        const newLat = pos.lat();
        const newLng = pos.lng();

        const result = await geocoder.geocode({ location: pos });

        const formatted =
          result.results?.[0]?.formatted_address ?? address ?? "";

        onChange({
          lat: newLat,
          lng: newLng,
          address: formatted,
        });
      });
    }

    init();
  }, [lat, lng]);

  return (
    <div className="space-y-3">
      {/* Input de búsqueda */}
      <input
        ref={inputRef}
        type="text"
        placeholder="Buscar dirección..."
        className="w-full border rounded px-3 py-2"
      />

      {/* Dirección seleccionada */}
      {address && (
        <p>
          <strong>Dirección seleccionada:</strong> {address}
        </p>
      )}

      {/* Mapa */}
      <div
        ref={mapRef}
        className="w-full h-[400px] rounded border"
      />
    </div>
  );
}

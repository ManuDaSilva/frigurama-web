"use client";

import { useRef, useEffect } from "react";

type Props = {
  lat?: number | null;
  lng?: number | null;
  address?: string;
  onChange: (v: { lat: number; lng: number; address: string }) => void;
};

export default function GoogleMap({ lat, lng, address, onChange }: Props) {
  const mapRef      = useRef<HTMLDivElement | null>(null);
  const inputRef    = useRef<HTMLInputElement | null>(null);
  const autoRef     = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    async function init() {
      // Guard: google must be available (script loaded via afterInteractive)
      if (typeof google === "undefined" || !google.maps?.importLibrary) return;

      // Prevent double-initialization (React Strict Mode runs effects twice in dev)
      if (autoRef.current) return;

      // Import only the libraries needed
      const { Map } = (await google.maps.importLibrary("maps")) as google.maps.MapsLibrary;
      const { Geocoder } = (await google.maps.importLibrary("geocoding")) as google.maps.GeocodingLibrary;
      await google.maps.importLibrary("places"); // loads Autocomplete into global

      // Initial position
      const center = {
        lat: lat ?? 41.387,
        lng: lng ?? 2.17,
      };

      // Create map
      const map = new Map(mapRef.current!, {
        center,
        zoom: 15,
        streetViewControl: false,
      });

      // Create marker using the classic global (compatible without a Map ID)
      const marker = new google.maps.Marker({
        position: center,
        map,
        draggable: true,
      });

      const geocoder = new Geocoder();

      // =============== AUTOCOMPLETE (BUSCADOR) ===============
      if (inputRef.current) {
        autoRef.current = new google.maps.places.Autocomplete(inputRef.current, {
          fields: ["geometry", "formatted_address"],
        });

        autoRef.current.addListener("place_changed", () => {
          const place = autoRef.current!.getPlace();
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

    // Cleanup: remove Autocomplete's global document listeners on unmount.
    // Critical in React Strict Mode (dev), which runs effects twice —
    // without this, a stale Autocomplete instance retains global keyboard
    // listeners that steal focus from other inputs in the form.
    return () => {
      if (autoRef.current && typeof google !== "undefined") {
        google.maps.event.clearInstanceListeners(autoRef.current);
        // Do NOT reset autoRef.current — preserving it keeps the guard active
        // across React Strict Mode's double-invocation of effects in development.
      }
    };
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

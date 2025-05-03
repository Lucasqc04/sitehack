import React from 'react';

interface MapViewProps {
  latitude: number;
  longitude: number;
  title?: string;
  zoom?: number;
}

const MapView: React.FC<MapViewProps> = ({
  latitude,
  longitude,
  title = "Sua localização aproximada",
  zoom = 14
}) => {
  // Usar URL comum do Google Maps (não requer API key)
  const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}&z=${zoom}&output=embed`;

  return (
    <div className="border border-hack-primary mt-4">
      <div className="w-full h-64 bg-hack-dark overflow-hidden">
        <iframe
          width="100%"
          height="100%"
          frameBorder="0"
          style={{ border: 0 }}
          src={mapUrl}
          allowFullScreen
          title={title}
        ></iframe>
      </div>
      <p className="text-hack-secondary text-sm mt-2 p-2">
        Esta é uma localização aproximada baseada no seu IP público,
        sem requisitar permissão de GPS.
      </p>
    </div>
  );
};

export default React.memo(MapView);

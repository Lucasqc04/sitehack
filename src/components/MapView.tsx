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
  const zoomDelta = 0.02;
  const left = longitude - zoomDelta;
  const right = longitude + zoomDelta;
  const top = latitude + zoomDelta;
  const bottom = latitude - zoomDelta;
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${latitude}%2C${longitude}`;
  const mapLink = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=${zoom}/${latitude}/${longitude}`;

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
      <div className="text-hack-secondary text-sm mt-2 p-2 space-y-1">
        <p>
          Esta é uma localização aproximada baseada no seu IP público,
          sem requisitar permissão de GPS.
        </p>
        <a
          href={mapLink}
          target="_blank"
          rel="noreferrer"
          className="text-hack-primary underline"
        >
          Abrir mapa em outra aba
        </a>
      </div>
    </div>
  );
};

export default React.memo(MapView);

import React from 'react';

interface InfoSectionProps {
  title: string;
  data: Record<string, string>;
}

const InfoSection: React.FC<InfoSectionProps> = ({ title, data }) => {
  return (
    <div className="hack-panel mb-6 hacking-effect">
      <h2 className="hack-title">{`> ${title}`}</h2>
      <div className="grid gap-2">
        {Object.entries(data).map(([key, value], index) => (
          <div key={key} className={`grid grid-cols-2 gap-4 p-2 hack-data-row`}>
            <span className="text-hack-secondary font-mono">{key}:</span>
            <span className="text-hack-primary font-mono break-all">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfoSection;

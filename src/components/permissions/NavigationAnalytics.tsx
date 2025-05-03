import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

 
const NavigationAnalytics: React.FC = () => {
  const [tracking, setTracking] = useState(false);
  const [interactions, setInteractions] = useState<Record<string, number>>({
    clicks: 0,
    mousemoves: 0,
    scrolls: 0,
    keydowns: 0
  });
  
  const startTracking = () => {
    setTracking(true);
    // Reset counts
    setInteractions({
      clicks: 0,
      mousemoves: 0,
      scrolls: 0,
      keydowns: 0
    });
  };
  
  const stopTracking = () => {
    setTracking(false);
  };
  
  // Event handlers
  const handleClick = () => {
    setInteractions(prev => ({ ...prev, clicks: prev.clicks + 1 }));
  };
  
  const handleMouseMove = () => {
    setInteractions(prev => ({ ...prev, mousemoves: prev.mousemoves + 1 }));
  };
  
  const handleScroll = () => {
    setInteractions(prev => ({ ...prev, scrolls: prev.scrolls + 1 }));
  };
  
  const handleKeyDown = () => {
    setInteractions(prev => ({ ...prev, keydowns: prev.keydowns + 1 }));
  };
  
  useEffect(() => {
    if (tracking) {
      // Add event listeners
      document.addEventListener('click', handleClick);
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('scroll', handleScroll);
      document.addEventListener('keydown', handleKeyDown);
    }
    
    // Cleanup function
    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('scroll', handleScroll);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [tracking]);
  
  // Prepare data for chart
  const chartData = Object.entries(interactions).map(([type, count]) => {
    const displayName = {
      clicks: 'Cliques',
      mousemoves: 'Movimentos do Mouse',
      scrolls: 'Rolagens',
      keydowns: 'Teclas Pressionadas'
    }[type] || type;
    
    return { type: displayName, count };
  });

  return (
    <div className="border border-hack-primary p-4 mb-6">
      <h3 className="text-xl text-hack-primary mb-3">Análise de Navegação em Tempo Real</h3>
      
      <div className="space-y-4">
        <div className="flex space-x-4">
          {!tracking ? (
            <button 
              onClick={startTracking}
              className="py-2 px-4 bg-hack-dark border border-hack-primary text-hack-primary hover:bg-hack-primary hover:text-hack-dark"
            >
              Iniciar Rastreamento
            </button>
          ) : (
            <button 
              onClick={stopTracking}
              className="py-2 px-4 bg-hack-dark border border-red-500 text-red-500 hover:bg-red-500 hover:text-hack-dark"
            >
              Parar Rastreamento
            </button>
          )}
        </div>
        
        {tracking && (
          <div className="text-hack-primary animate-pulse">
            Rastreando suas interações em tempo real...
          </div>
        )}
        
        {(chartData.some(item => item.count > 0)) && (
          <div>
            <h4 className="text-lg text-hack-primary mb-2">Suas Interações Nesta Sessão</h4>
            <div className="h-60 border border-hack-primary p-2 bg-hack-dark">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="type" stroke="#00ff00" />
                  <YAxis stroke="#00ff00" />
                  <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #00ff00' }} />
                  <Legend />
                  <Bar dataKey="count" fill="#00ff00" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
        
        <div className="text-hack-secondary text-sm">
          <p>
            Este componente rastreia suas interações reais com a página:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Cliques: {interactions.clicks}</li>
            <li>Movimentos do mouse: {interactions.mousemoves}</li>
            <li>Rolagens de página: {interactions.scrolls}</li>
            <li>Teclas pressionadas: {interactions.keydowns}</li>
          </ul>
          <p className="mt-2">
            Sites podem coletar esses dados para analisar seu comportamento e criar perfis 
            detalhados sobre como você navega, sem necessidade de permissão explícita.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NavigationAnalytics;

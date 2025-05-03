import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PerformanceMetrics {
  pageLoad: number;
  domLoad: number;
  networkLatency: number;
  resourceLoad: ResourceMetric[];
  memory: number | null;
}

interface ResourceMetric {
  name: string;
  loadTime: number;
}

const PerformanceAccess: React.FC = () => {
  const [performanceData, setPerformanceData] = useState<PerformanceMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Obter métricas reais de performance
      const perf = window.performance;
      const timing = perf.timing || {};
      
      // Calcular tempos reais
      const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
      const domLoadTime = timing.domComplete - timing.domLoading;
      const networkLatency = timing.responseEnd - timing.requestStart;
      
      // Obter recursos realmente carregados
      const resources = perf.getEntriesByType('resource');
      const resourceMetrics = resources
        .filter(r => r.duration > 0)  // Filtrar recursos válidos
        .map(resource => ({
          name: new URL(resource.name).pathname.split('/').pop() || resource.name,
          loadTime: Math.round(resource.duration)
        }))
        .sort((a, b) => b.loadTime - a.loadTime)  // Ordenar por tempo de carregamento
        .slice(0, 5);  // Mostrar apenas os 5 mais demorados
      
      // Memória (apenas em alguns navegadores)
      let memoryUsage = null;
      if ((performance as any).memory) {
        memoryUsage = Math.round((performance as any).memory.usedJSHeapSize / (1024 * 1024));
      }
      
      setPerformanceData({
        pageLoad: pageLoadTime,
        domLoad: domLoadTime,
        networkLatency,
        resourceLoad: resourceMetrics,
        memory: memoryUsage
      });
    } catch (err: any) {
      setError(`Erro ao acessar dados de performance: ${err.message}`);
    }
  }, []);

  if (error) {
    return (
      <div className="border border-hack-primary p-4 mb-6">
        <h3 className="text-xl text-hack-primary mb-3">Dados de Performance</h3>
        <div className="text-red-500 p-3 border border-red-500">
          {error}
        </div>
      </div>
    );
  }

  if (!performanceData) {
    return (
      <div className="border border-hack-primary p-4 mb-6">
        <h3 className="text-xl text-hack-primary mb-3">Dados de Performance</h3>
        <div className="text-hack-primary">Carregando métricas de performance...</div>
      </div>
    );
  }

  return (
    <div className="hack-panel mb-6">
      <h3 className="hack-title">Dados de Performance</h3>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="hack-panel">
            <div className="text-sm text-hack-secondary">Tempo de Carregamento</div>
            <div className="text-2xl text-hack-primary">{performanceData.pageLoad}ms</div>
          </div>
          
          <div className="hack-panel">
            <div className="text-sm text-hack-secondary">Carregamento do DOM</div>
            <div className="text-2xl text-hack-primary">{performanceData.domLoad}ms</div>
          </div>
          
          <div className="hack-panel sm:col-span-2 md:col-span-1">
            <div className="text-sm text-hack-secondary">Memória Utilizada</div>
            <div className="text-2xl text-hack-primary">
              {performanceData.memory ? `${performanceData.memory} MB` : 'Indisponível'}
            </div>
          </div>
        </div>
        
        {performanceData.resourceLoad.length > 0 && (
          <div>
            <h4 className="hack-title text-base">Tempo de Carregamento de Recursos</h4>
            <div className="h-60 md:h-80 border border-hack-primary p-2 bg-hack-dark">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={performanceData.resourceLoad}
                  margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis type="number" stroke="#00ff00" />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    stroke="#00ff00" 
                    width={100}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #00ff00' }} />
                  <Bar dataKey="loadTime" fill="#00ff00" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            {/* Lista para mobile */}
            <div className="mt-4 md:hidden">
              <h5 className="text-hack-primary mb-2">Recursos carregados:</h5>
              <div className="space-y-2">
                {performanceData.resourceLoad.map((resource, i) => (
                  <div key={i} className="hack-panel p-2 flex justify-between">
                    <span className="text-hack-secondary truncate flex-1">{resource.name}</span>
                    <span className="text-hack-primary ml-2">{resource.loadTime}ms</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        <div className="text-hack-secondary text-sm">
          <p>
            Estes dados são medições reais do desempenho da sua sessão atual, 
            incluindo tempo de carregamento da página, uso de memória e recursos solicitados.
            Esta coleta é feita diretamente pelo navegador usando a API Performance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PerformanceAccess;

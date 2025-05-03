import React, { useState, useEffect } from 'react';
import { 
  TrackingDisplay, 
  AdvancedFingerprint, 
  NetworkLocation,
  HardwareDisplay
} from '../components';
import {
  CameraAccess,
  MicrophoneAccess,
  ClipboardAccess,
  GeolocationAccess,
  FileAccess,
  BluetoothAccess,
  SensorsAccess,
  NotificationAccess,
  ScreenRecordingAccess,
  PerformanceAccess,
  NavigationAnalytics,
  PermissionsManager
} from '../components/permissions';
import HackingAnimation from '../components/HackingAnimation';
import { requestAllPermissions } from '../services/permissionsAccess';
import '../styles/globals.css';

const Home: React.FC = () => {
  const [viewMode, setViewMode] = useState<'selection' | 'withoutPermission' | 'withPermission'>('selection');
  const [permissionsRequested, setPermissionsRequested] = useState(false);
  const [showHacking, setShowHacking] = useState(false);

  // Efeito para solicitar permissões quando o modo de visualização muda para 'withPermission'
  useEffect(() => {
    if (viewMode === 'withPermission' && !permissionsRequested) {
      const requestPermissions = async () => {
        try {
          await requestAllPermissions();
        } catch (error) {
          console.error("Erro ao solicitar permissões:", error);
        } finally {
          setPermissionsRequested(true);
        }
      };
      
      requestPermissions();
    }
  }, [viewMode, permissionsRequested]);

  // Função para mudar de modo e potencialmente solicitar permissões
  const changeViewMode = (mode: 'selection' | 'withoutPermission' | 'withPermission') => {
    if (mode === 'withoutPermission') {
      setShowHacking(true);
      setTimeout(() => {
        setViewMode(mode);
      }, 6000); // Esperar a animação terminar
    } else {
      setViewMode(mode);
    }
    
    if (mode === 'withPermission') {
      setPermissionsRequested(false); // Reset para solicitar permissões novamente
    }
  };

  // Renderiza a tela de seleção
  const renderSelectionScreen = () => (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 matrix-background">
      <div className="scanline"></div>
      <div className="text-center mb-10">
        <h1 className="text-5xl font-mono hack-text glitch-text mb-6">
          {'> HACK RASTREAMENTO'}
        </h1>
        <p className="text-xl text-hack-secondary mb-12">
          Descubra o que os sites sabem sobre você
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
        <button 
          onClick={() => changeViewMode('withoutPermission')}
          className="hack-panel hover:bg-hack-dark hover:border-hack-primary transition-all duration-300 text-left"
        >
          <h2 className="text-2xl font-mono hack-text mb-4">{'> SEM SUA PERMISSÃO'}</h2>
          <p className="text-hack-secondary">
            Veja todos os dados que um site pode coletar automaticamente sem pedir nenhuma permissão.
          </p>
        </button>
        
        <button 
          onClick={() => changeViewMode('withPermission')}
          className="hack-panel hover:bg-hack-dark hover:border-hack-primary transition-all duration-300 text-left"
        >
          <h2 className="text-2xl font-mono hack-text mb-4">{'> COM SUA PERMISSÃO'}</h2>
          <p className="text-hack-secondary">
            Veja o que um site pode acessar quando você concede permissões adicionais.
          </p>
        </button>
      </div>
    </div>
  );

  // Renderiza o conteúdo de dados sem permissão
  const renderWithoutPermissionContent = () => (
    <div className="min-h-screen bg-black p-8 matrix-background">
      <div className="scanline"></div>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-mono hack-text">
            {'> DADOS SEM SUA PERMISSÃO'}
          </h1>
          <button 
            onClick={() => changeViewMode('selection')}
            className="hack-btn"
          >
            {'< Voltar'}
          </button>
        </div>
        
        <NetworkLocation />
        <TrackingDisplay />
        <HardwareDisplay />
        <AdvancedFingerprint />
        
        <div className="hack-panel mt-12">
          <h2 className="text-2xl hack-text mb-4">Por que isso importa?</h2>
          <p className="text-hack-secondary mb-2">
            Estas informações são coletadas constantemente por sites e serviços online para criar 
            perfis detalhados sobre você, seus hábitos e comportamentos.
          </p>
          <p className="text-hack-secondary">
            Use ferramentas como bloqueadores de rastreamento, VPNs e navegadores focados em 
            privacidade para reduzir sua exposição digital.
          </p>
        </div>
      </div>
    </div>
  );

  // Renderiza o conteúdo de dados com permissão
  const renderWithPermissionContent = () => (
    <div className="min-h-screen bg-black p-8 matrix-background">
      <div className="scanline"></div>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-mono hack-text">
            {'> DADOS COM SUA PERMISSÃO'}
          </h1>
          <button 
            onClick={() => changeViewMode('selection')}
            className="hack-btn"
          >
            {'< Voltar'}
          </button>
        </div>

        {!permissionsRequested ? (
          <div className="flex items-center justify-center p-8 border border-hack-primary">
            <p className="text-hack-primary text-xl">Solicitando permissões...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-hack-secondary mb-6">
              Esta seção demonstra dados e recursos que um site só pode acessar após você conceder permissões explícitas.
              Cada recurso abaixo requer sua permissão para funcionar.
            </p>

            <CameraAccess />
            <MicrophoneAccess />
            <GeolocationAccess />
            <FileAccess />
            <ClipboardAccess />
            <NotificationAccess />
            <ScreenRecordingAccess />
            <BluetoothAccess />
            <SensorsAccess />
            <PerformanceAccess />
            <NavigationAnalytics />
            <PermissionsManager />
          </div>
        )}
      </div>
    </div>
  );

  // Renderizar a animação de hacking quando necessário
  return (
    <>
      {showHacking && (
        <HackingAnimation 
          onComplete={() => setShowHacking(false)}
          messages={[
            "> Iniciando rastreamento passivo...",
            "> Interceptando dados do navegador...",
            "> Coletando informações de metadados...",
            "> Extraindo fingerprint do navegador...",
            "> Detectando configurações de hardware...",
            "> Mapeando endereço IP e geolocalização...",
            "> Analisando histórico de navegação...",
            "> Coletando informações do dispositivo...",
            "> Processando perfil de usuário...",
            "> Acesso concluído. Dados expostos!"
          ]}
        />
      )}
      
      {/* Renderizar conteúdo principal baseado no modo */}
      {viewMode === 'selection' && renderSelectionScreen()}
      {viewMode === 'withoutPermission' && renderWithoutPermissionContent()}
      {viewMode === 'withPermission' && renderWithPermissionContent()}
    </>
  );
};

export default Home;
import React, { useEffect, useState } from 'react';

interface PermissionStatus {
  name: string;
  status: 'granted' | 'denied' | 'prompt' | 'unavailable';
  icon: string;
  description: string;
}

const PermissionsManager: React.FC = () => {
  const [permissions, setPermissions] = useState<PermissionStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkPermissions = async () => {
    setLoading(true);
    
    try {
      const permissionsToCheck: { name: string, description: string, icon: string }[] = [
        { name: 'geolocation', description: 'Acesso à sua localização precisa', icon: '📍' },
        { name: 'notifications', description: 'Envio de notificações', icon: '🔔' },
        { name: 'camera', description: 'Acesso à sua câmera', icon: '📷' },
        { name: 'microphone', description: 'Acesso ao seu microfone', icon: '🎤' },
        { name: 'clipboard-read', description: 'Leitura da área de transferência', icon: '📋' },
        { name: 'clipboard-write', description: 'Escrita na área de transferência', icon: '✏️' }
      ];
      
      const results: PermissionStatus[] = [];
      
      for (const permission of permissionsToCheck) {
        try {
          if ('permissions' in navigator) {
            const status = await navigator.permissions.query({ name: permission.name as PermissionName });
            // Garantir que status.state seja um dos valores esperados
            const permissionState = status.state as 'granted' | 'denied' | 'prompt';
            
            results.push({
              name: permission.name,
              status: permissionState,
              icon: permission.icon,
              description: permission.description
            });
          } else {
            results.push({
              name: permission.name,
              status: 'unavailable',
              icon: permission.icon,
              description: permission.description
            });
          }
        } catch (err) {
          // Esta permissão não é suportada
          results.push({
            name: permission.name,
            status: 'unavailable',
            icon: permission.icon,
            description: permission.description
          });
        }
      }
      
      setPermissions(results);
    } catch (err: any) {
      setError(`Erro ao verificar permissões: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    checkPermissions();
  }, []);
  
  const handleRevokeAttempt = (permissionName: string) => {
    alert(`Para revogar a permissão de ${permissionName}, você precisa fazer isso nas configurações do seu navegador.\n\nVocê pode acessar as configurações de permissão do site clicando no ícone de cadeado na barra de endereço ou através das configurações do navegador.`);
  };
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'granted':
        return <span className="px-2 py-1 bg-green-800 text-green-100 rounded-full text-xs">Permitido</span>;
      case 'denied':
        return <span className="px-2 py-1 bg-red-800 text-red-100 rounded-full text-xs">Bloqueado</span>;
      case 'prompt':
        return <span className="px-2 py-1 bg-yellow-800 text-yellow-100 rounded-full text-xs">Perguntar</span>;
      default:
        return <span className="px-2 py-1 bg-gray-800 text-gray-100 rounded-full text-xs">Não suportado</span>;
    }
  };

  if (loading) {
    return (
      <div className="border border-hack-primary p-4 mb-6">
        <h3 className="text-xl text-hack-primary mb-3">Gerenciador de Permissões</h3>
        <div className="text-hack-primary">Verificando permissões...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-hack-primary p-4 mb-6">
        <h3 className="text-xl text-hack-primary mb-3">Gerenciador de Permissões</h3>
        <div className="text-red-500 p-3 border border-red-500">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="border border-hack-primary p-4 mb-6">
      <h3 className="text-xl text-hack-primary mb-3">Gerenciador de Permissões</h3>
      
      <div className="space-y-4">
        <button 
          onClick={checkPermissions}
          className="py-2 px-4 bg-hack-dark border border-hack-primary text-hack-primary hover:bg-hack-primary hover:text-hack-dark"
        >
          Atualizar Status das Permissões
        </button>
        
        <div className="border border-hack-primary">
          <table className="w-full">
            <thead className="bg-hack-dark">
              <tr>
                <th className="p-2 text-left text-hack-primary">Permissão</th>
                <th className="p-2 text-left text-hack-primary">Status</th>
                <th className="p-2 text-left text-hack-primary">Ações</th>
              </tr>
            </thead>
            <tbody>
              {permissions.map((permission) => (
                <tr key={permission.name} className="border-t border-hack-primary">
                  <td className="p-2">
                    <div className="flex items-center">
                      <span className="mr-2 text-xl">{permission.icon}</span>
                      <div>
                        <div className="text-hack-primary">{permission.name}</div>
                        <div className="text-hack-secondary text-sm">{permission.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-2">
                    {getStatusBadge(permission.status)}
                  </td>
                  <td className="p-2">
                    {permission.status === 'granted' && (
                      <button 
                        onClick={() => handleRevokeAttempt(permission.name)}
                        className="py-1 px-2 bg-hack-dark border border-red-500 text-red-500 text-sm hover:bg-red-500 hover:text-hack-dark"
                      >
                        Revogar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="text-hack-secondary text-sm">
          <p>
            O gerenciador de permissões mostra quais recursos você permitiu que este site acesse.
            Para revogar permissões, você geralmente precisa usar as configurações do seu navegador.
          </p>
          <p className="mt-2">
            Diferentes navegadores armazenam essas configurações em lugares diferentes, mas
            geralmente você pode encontrá-las clicando no ícone de cadeado na barra de endereço
            ou nas configurações de privacidade do navegador.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PermissionsManager;

import React, { useState } from 'react';
import { writeToClipboard, readFromClipboard } from '../../services/permissionsAccess';

const ClipboardAccess: React.FC = () => {
  const [status, setStatus] = useState<string | null>(null);
  const [clipboardContent, setClipboardContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleWriteToClipboard = async () => {
    try {
      await writeToClipboard('Colei algo na sua área de transferência kkkk');
      setStatus('Texto escrito na área de transferência!');
    } catch (err) {
      setError('Falha ao acessar a área de transferência. Permissão negada.');
    }
  };

  const handleReadFromClipboard = async () => {
    try {
      const text = await readFromClipboard();
      setClipboardContent(text);
    } catch (err) {
      setError('Falha ao ler da área de transferência. Permissão negada.');
    }
  };

  return (
    <div className="hack-panel mb-6">
      <h3 className="hack-title">Acesso à Área de Transferência</h3>
      
      <div className="space-y-4">
        <div>
          <button 
            onClick={handleWriteToClipboard}
            className="py-2 px-4 bg-hack-dark border border-hack-primary text-hack-primary hover:bg-hack-primary hover:text-hack-dark mr-4"
          >
            Escrever no Clipboard
          </button>
          
          <button 
            onClick={handleReadFromClipboard}
            className="py-2 px-4 bg-hack-dark border border-hack-primary text-hack-primary hover:bg-hack-primary hover:text-hack-dark"
          >
            Ler do Clipboard
          </button>
        </div>
        
        {status && <p className="text-hack-primary">{status}</p>}
        
        {clipboardContent && (
          <div className="mt-3">
            <p className="text-hack-secondary mb-1">Conteúdo da área de transferência:</p>
            <div className="p-2 bg-black border border-hack-primary">
              <p className="text-hack-primary break-all">{clipboardContent}</p>
            </div>
          </div>
        )}
        
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export default ClipboardAccess;

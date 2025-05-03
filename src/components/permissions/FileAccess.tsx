import React, { useRef, useState } from 'react';

interface FileInfo {
  name: string;
  type: string;
  size: number;
  lastModified: Date;
}

const FileAccess: React.FC = () => {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    
    if (!event.target.files || event.target.files.length === 0) {
      setError('Nenhum arquivo selecionado');
      return;
    }
    
    const fileList = Array.from(event.target.files);
    const fileInfoList: FileInfo[] = fileList.map(file => ({
      name: file.name,
      type: file.type || 'Desconhecido',
      size: file.size,
      lastModified: new Date(file.lastModified)
    }));
    
    setFiles(fileInfoList);
  };

  const handleOpenFilePicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="hack-panel mb-6">
      <h3 className="hack-title">Acesso a Arquivos</h3>
      
      <div className="space-y-4">
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          multiple
        />
        
        <button 
          onClick={handleOpenFilePicker}
          className="py-2 px-4 bg-hack-dark border border-hack-primary text-hack-primary hover:bg-hack-primary hover:text-hack-dark"
        >
          Selecionar Arquivos
        </button>
        
        {error && (
          <div className="text-red-500">
            {error}
          </div>
        )}
        
        {files.length > 0 && (
          <div>
            <h4 className="text-lg text-hack-primary mb-2">Arquivos selecionados ({files.length}):</h4>
            <div className="border border-hack-primary">
              <table className="w-full table-auto">
                <thead className="bg-hack-dark">
                  <tr>
                    <th className="text-left p-2 text-hack-primary">Nome</th>
                    <th className="text-left p-2 text-hack-primary">Tipo</th>
                    <th className="text-left p-2 text-hack-primary">Tamanho</th>
                    <th className="text-left p-2 text-hack-primary">Modificado</th>
                  </tr>
                </thead>
                <tbody>
                  {files.map((file, index) => (
                    <tr key={index} className="border-t border-hack-primary">
                      <td className="p-2 text-hack-primary break-all">{file.name}</td>
                      <td className="p-2 text-hack-secondary">{file.type}</td>
                      <td className="p-2 text-hack-secondary">{formatBytes(file.size)}</td>
                      <td className="p-2 text-hack-secondary">{file.lastModified.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <p className="text-hack-secondary text-sm mt-2">
              Um site só pode acessar estes arquivos quando você explicitamente os seleciona. 
              Nenhum site pode acessar seus arquivos sem permissão.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileAccess;

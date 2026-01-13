
import React, { useState, useCallback } from 'react';
import { WardrobeItem, ClothingCategory } from '../types';
import { Modal } from './common/Modal';
import { Button } from './common/Button';
import { ArrowUpTrayIcon, CameraIcon } from './icons';
import { classifyClothingItem } from '../services/geminiService';

interface AddItemFormProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItems: (items: Omit<WardrobeItem, 'id' | 'isFavorite' | 'creationYear' | 'manualTechnique' | 'fiberOrigin' | 'itemStatus'>[]) => void;
}

type UploadStatus = 'pending' | 'classifying' | 'success' | 'error';

interface UploadingFile {
  file: File;
  preview: string;
  status: UploadStatus;
  name: string;
  category: string;
  errorMessage?: string;
}

export const AddItemForm: React.FC<AddItemFormProps> = ({ isOpen, onClose, onAddItems }) => {
  const [files, setFiles] = useState<UploadingFile[]>([]);
  const [isClassifying, setIsClassifying] = useState(false);

  const handleFileChange = (selectedFiles: FileList | null) => {
    if (selectedFiles) {
      const newFiles: UploadingFile[] = Array.from(selectedFiles).map(file => ({
        file,
        preview: URL.createObjectURL(file),
        status: 'pending',
        name: '',
        category: '',
      }));
      setFiles(prev => [...prev, ...newFiles]);
    }
  };
  
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files) {
        handleFileChange(e.dataTransfer.files);
    }
  }, []);

  const classifyAll = async () => {
    setIsClassifying(true);
    // Process files one by one for better UX and to avoid overwhelming the API
    for (const fileToProcess of files) {
      if (fileToProcess.status === 'pending') {
        // Set current file to 'classifying'
        setFiles(currentFiles => currentFiles.map(f =>
          f.preview === fileToProcess.preview ? { ...f, status: 'classifying' } : f
        ));
        
        try {
          const { name, category } = await classifyClothingItem(fileToProcess.file);
          setFiles(currentFiles => currentFiles.map(f =>
            f.preview === fileToProcess.preview ? { ...f, name, category, status: 'success' } : f
          ));
        } catch (e) {
          console.error("Classification failed for", fileToProcess.file.name, e);
          const errorMessage = e instanceof Error ? e.message : "Erro desconhecido.";
          setFiles(currentFiles => currentFiles.map(f =>
            f.preview === fileToProcess.preview ? { ...f, status: 'error', errorMessage } : f
          ));
        }
      }
    }
    setIsClassifying(false);
  };
  
  const handleAdd = () => {
    const newItems = files
      .filter(f => f.status === 'success')
      .map(f => ({
        name: f.name,
        category: f.category as ClothingCategory,
        imageUrl: f.preview,
      }));
    onAddItems(newItems);
    setFiles([]);
    onClose();
  };

  const isAddDisabled = files.length === 0 || files.some(f => f.status !== 'success') || isClassifying;
  const isClassifyDisabled = files.length === 0 || files.every(f => f.status !== 'pending') || isClassifying;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Adicionar Peças ao Guarda-Roupa">
      <div className="space-y-4">
        <div 
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-text-secondary/50 rounded-lg p-6 text-center"
        >
          <ArrowUpTrayIcon className="w-10 h-10 mx-auto text-text-secondary" />
          <p className="mt-2 text-text-secondary">Arraste e solte imagens ou</p>
          <input type="file" id="multi-file-upload" className="hidden" onChange={(e) => handleFileChange(e.target.files)} multiple accept="image/*" />
          <label htmlFor="multi-file-upload" className="font-semibold text-primary cursor-pointer hover:underline">Selecione arquivos</label>
        </div>
        
        {files.length > 0 && (
          <div className="max-h-60 overflow-y-auto space-y-3 pr-2">
            {files.map((f, index) => (
              <div key={index} className="flex items-center gap-4 bg-background p-2 rounded-md">
                <img src={f.preview} alt="preview" className="w-16 h-16 rounded object-cover" />
                <div className="flex-grow">
                  <p className="text-sm truncate text-text-main">{f.file.name}</p>
                  {f.status === 'success' && <p className="text-xs text-text-secondary">{f.name} - {f.category}</p>}
                </div>
                <div>
                  {f.status === 'pending' && <span className="text-xs text-text-secondary">Pendente</span>}
                  {f.status === 'classifying' && <span className="text-xs text-primary animate-pulse">Classificando...</span>}
                  {f.status === 'success' && <span className="text-xs text-green-400">Sucesso</span>}
                  {f.status === 'error' && <span className="text-xs text-red-400" title={f.errorMessage}>Falha</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end gap-4 pt-4">
            <Button onClick={classifyAll} variant="secondary" disabled={isClassifyDisabled}>
              {isClassifying ? 'Classificando...' : 'Classificar com IA'}
            </Button>
            <Button onClick={handleAdd} disabled={isAddDisabled}>Adicionar</Button>
        </div>
      </div>
    </Modal>
  );
};

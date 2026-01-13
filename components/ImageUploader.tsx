
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { CameraIcon, ArrowUpTrayIcon, XMarkIcon, CheckCircleIcon } from './icons';
import { Button } from './common/Button';

interface ImageUploaderProps {
  onImageSelect: (file: File | string) => void;
  currentImage: string | null;
  predefinedModels: { id: string; name: string; imageUrl: string }[];
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, currentImage, predefinedModels }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isCameraOpen, setCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageSelect(e.dataTransfer.files[0]);
    }
  }, [onImageSelect]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageSelect(e.target.files[0]);
    }
  };

  const startCamera = async () => {
    setCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Error accessing camera: ", err);
      setCameraOpen(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
    }
    setCameraOpen(false);
  };

  const takePicture = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0, videoRef.current.videoWidth, videoRef.current.videoHeight);
        onImageSelect(canvasRef.current.toDataURL('image/png'));
        stopCamera();
      }
    }
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  if (isCameraOpen) {
    return (
      <div className="flex flex-col items-center gap-4">
        <video ref={videoRef} autoPlay className="w-full rounded-lg max-h-60" />
        <canvas ref={canvasRef} className="hidden" />
        <div className="flex gap-4">
          <Button onClick={takePicture}>Tirar Foto</Button>
          <Button variant="secondary" onClick={stopCamera}>Cancelar</Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-text-main mb-3">Sua Imagem Base</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          onDragEnter={handleDragEnter}
          onDrop={handleDrop}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors flex flex-col items-center justify-center h-full ${
            isDragging ? 'border-primary bg-primary/10' : 'border-text-secondary/50'
          }`}
        >
          {currentImage && !predefinedModels.some(m => m.imageUrl === currentImage) ? (
            <div className="relative">
              <img src={currentImage} alt="Preview" className="mx-auto max-h-40 rounded-lg" />
              <button
                onClick={() => onImageSelect('')}
                className="absolute -top-2 -right-2 bg-surface rounded-full p-1 text-text-secondary hover:text-text-main"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <>
              <ArrowUpTrayIcon className="w-10 h-10 text-text-secondary" />
              <p className="mt-2 text-sm text-text-secondary">Arraste e solte ou</p>
              <input type="file" id="file-upload" className="hidden" onChange={handleFileChange} accept="image/*" />
              <label htmlFor="file-upload" className="font-semibold text-primary cursor-pointer hover:underline">
                Selecione um arquivo
              </label>
              <Button onClick={startCamera} variant="ghost" className="mt-2" icon={<CameraIcon />}>
                Usar Câmera
              </Button>
            </>
          )}
        </div>
        
        <div className="h-full">
            <p className="text-center text-text-secondary mb-2 text-sm">Ou comece com um modelo</p>
             <div className="grid grid-cols-2 gap-2">
                {predefinedModels.map(model => (
                    <button key={model.id} onClick={() => onImageSelect(model.imageUrl)} className="relative group rounded-lg overflow-hidden">
                        <img src={model.imageUrl} alt={model.name} className="w-full h-24 object-cover group-hover:scale-105 transition-transform"/>
                        {currentImage === model.imageUrl && (
                           <>
                            <div className="absolute inset-0 border-2 border-primary rounded-lg"></div>
                            <CheckCircleIcon className="absolute top-1 right-1 w-5 h-5 text-primary bg-surface rounded-full" />
                           </>
                        )}
                    </button>
                ))}
             </div>
        </div>
      </div>
    </div>
  );
};

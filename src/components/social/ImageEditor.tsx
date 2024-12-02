import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Crop, RotateCw, Sliders, Save, X, Undo, Redo } from 'lucide-react';

interface ImageEditorProps {
  imageUrl: string;
  onSave: (editedUrl: string) => void;
  onClose: () => void;
}

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function ImageEditor({ imageUrl, onSave, onClose }: ImageEditorProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(null);
  const [activeTab, setActiveTab] = useState<'crop' | 'adjust'>('crop');
  const [aspectRatio, setAspectRatio] = useState(1);

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: CropArea) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    try {
      // Create a canvas to apply the effects
      const image = new Image();
      image.crossOrigin = "anonymous";
      
      const applyFilters = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size based on cropped area
        canvas.width = croppedAreaPixels?.width || image.width;
        canvas.height = croppedAreaPixels?.height || image.height;

        // Create an intermediate canvas for the crop and rotation
        const intermediateCanvas = document.createElement('canvas');
        const intermediateCtx = intermediateCanvas.getContext('2d');
        if (!intermediateCtx) return;

        intermediateCanvas.width = canvas.width;
        intermediateCanvas.height = canvas.height;

        // Apply rotation
        intermediateCtx.save();
        intermediateCtx.translate(intermediateCanvas.width/2, intermediateCanvas.height/2);
        intermediateCtx.rotate((rotation * Math.PI) / 180);
        intermediateCtx.translate(-intermediateCanvas.width/2, -intermediateCanvas.height/2);

        // Draw the cropped image
        if (croppedAreaPixels) {
          intermediateCtx.drawImage(
            image,
            croppedAreaPixels.x,
            croppedAreaPixels.y,
            croppedAreaPixels.width,
            croppedAreaPixels.height,
            0,
            0,
            canvas.width,
            canvas.height
          );
        } else {
          intermediateCtx.drawImage(image, 0, 0, canvas.width, canvas.height);
        }

        intermediateCtx.restore();

        // Apply filters using CSS filter syntax
        ctx.filter = `brightness(${brightness/100}) contrast(${contrast}%) saturate(${saturation}%)`;
        ctx.drawImage(intermediateCanvas, 0, 0);

        // Convert to data URL and save
        const editedImageUrl = canvas.toDataURL('image/jpeg', 0.95);
        onSave(editedImageUrl);
      };

      image.onload = applyFilters;
      image.src = imageUrl;
    } catch (error) {
      console.error('Failed to save edited image:', error);
      alert('Failed to save the edited image. Please try again.');
    }
  };

  const handleRotate90 = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleReset = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
  };

  // Calculate filter styles for real-time preview
  const filterStyle = {
    filter: `brightness(${brightness/100}) contrast(${contrast}%) saturate(${saturation}%)`,
    transform: `rotate(${rotation}deg)`
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold">Edit Image</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-1 min-h-0">
          <div className="w-64 border-r p-4 space-y-6">
            <div className="space-y-2">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('crop')}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium ${
                    activeTab === 'crop'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Crop className="w-4 h-4" />
                    Crop
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('adjust')}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium ${
                    activeTab === 'adjust'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Sliders className="w-4 h-4" />
                    Adjust
                  </div>
                </button>
              </div>
            </div>

            {activeTab === 'crop' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Aspect Ratio
                  </label>
                  <select
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(Number(e.target.value))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value={1}>1:1 (Square)</option>
                    <option value={4/5}>4:5 (Instagram Portrait)</option>
                    <option value={16/9}>16:9 (Landscape)</option>
                    <option value={9/16}>9:16 (Story)</option>
                    <option value={1.91}>1.91:1 (Facebook)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Zoom
                  </label>
                  <input
                    type="range"
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rotation
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      value={rotation}
                      min={0}
                      max={360}
                      step={1}
                      onChange={(e) => setRotation(Number(e.target.value))}
                      className="flex-1"
                    />
                    <button
                      onClick={handleRotate90}
                      className="p-2 rounded-lg hover:bg-gray-100"
                      title="Rotate 90°"
                    >
                      <RotateCw className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'adjust' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Brightness
                  </label>
                  <input
                    type="range"
                    value={brightness}
                    min={0}
                    max={200}
                    onChange={(e) => setBrightness(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-500 mt-1">{brightness}%</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contrast
                  </label>
                  <input
                    type="range"
                    value={contrast}
                    min={0}
                    max={200}
                    onChange={(e) => setContrast(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-500 mt-1">{contrast}%</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Saturation
                  </label>
                  <input
                    type="range"
                    value={saturation}
                    min={0}
                    max={200}
                    onChange={(e) => setSaturation(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-500 mt-1">{saturation}%</div>
                </div>
              </div>
            )}

            <div className="pt-4 border-t">
              <button
                onClick={handleReset}
                className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Reset All
              </button>
            </div>
          </div>

          <div className="flex-1 relative bg-gray-900">
            <div className="absolute inset-0">
              <Cropper
                image={imageUrl}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={aspectRatio}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                style={{
                  containerStyle: {
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#111'
                  },
                  imageStyle: filterStyle
                }}
              />
            </div>
          </div>
        </div>

        <div className="p-4 border-t flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
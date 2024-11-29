import { useRef, useState } from 'react';
import { RotateCw, Move, Paintbrush } from 'lucide-react';
import Draggable from 'react-draggable';
import { FurnitureConfig } from './FurnitureConfig';

interface FurnitureItemProps {
  id: string;
  type: string;
  position: { x: number; y: number };
  rotation: number; // Rotation actuelle
  color?: string;
  isSelected: boolean;
  isOwner: boolean;
  config: FurnitureConfig;
  onSelect: (id: string) => void;
  onDragStop: (id: string, x: number, y: number) => void;
  onRotate: (id: string, angle: number) => void;
  onChangeColor: (id: string, color: string) => void; // Ajout pour changer la couleur
  isOccupied: (x: number, y: number, id: string) => boolean;
}

export function FurnitureItem({
  id,
  type,
  position,
  rotation,
  color,
  isSelected,
  isOwner,
  config,
  onSelect,
  onDragStop,
  onRotate,
  onChangeColor,
  isOccupied,
}: FurnitureItemProps) {
  const nodeRef = useRef(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const Icon = config.icon;

  const handleRotate = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newRotation = (rotation + 90) % 360;
    onRotate(id, newRotation);
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeColor(id, e.target.value); // Mettre à jour la couleur dans l'état global
  };

  const dimensions = config.getDimensions
    ? config.getDimensions(rotation)
    : { width: config.width, height: config.height };

  return (
    <Draggable
      nodeRef={nodeRef}
      disabled={!isOwner}
      defaultPosition={{
        x: position.x * config.cellSize,
        y: position.y * config.cellSize,
      }}
      grid={[config.cellSize, config.cellSize]}
      bounds="parent"
      onStop={(_, data) => {
        const gridX = Math.round(data.x / config.cellSize);
        const gridY = Math.round(data.y / config.cellSize);

        if (!isOccupied(gridX, gridY, id)) {
          onDragStop(id, gridX, gridY);
        } else {
          console.warn('Collision détectée : position occupée.');
        }
      }}
    >
      <div
        ref={nodeRef}
        className={`absolute cursor-move bg-white rounded-lg shadow-lg transition-transform hover:scale-105 ${
          isSelected ? 'ring-2 ring-blue-500' : ''
        }`}
        style={{
          width: dimensions.width * config.cellSize,
          height: dimensions.height * config.cellSize,
          backgroundColor: color || config.color,
          transform: `rotate(${rotation}deg)`,
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(id);
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon className="w-6 h-6 text-white drop-shadow" />
          {isOwner && (
            <>
              <Move className="absolute top-1 right-1 w-4 h-4 text-white opacity-50" />
              <button
                onClick={handleRotate}
                className="absolute bottom-1 right-1 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg"
              >
                <RotateCw className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowColorPicker(!showColorPicker);
                }}
                className="absolute bottom-1 left-1 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg"
              >
                <Paintbrush className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
        {showColorPicker && isOwner && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-white p-2 rounded shadow-lg z-10">
            <input
              type="color"
              value={color || config.color}
              onChange={handleColorChange}
              className="w-16 h-10 border-none outline-none cursor-pointer"
            />
          </div>
        )}
      </div>
    </Draggable>
  );
}

import { useRef } from 'react';
import { Move } from 'lucide-react';
import Draggable from 'react-draggable';
import { FurnitureConfig } from './types';

interface FurnitureItemProps {
  id: string;
  type: string;
  position: { x: number; y: number };
  color?: string;
  isSelected: boolean;
  isOwner: boolean;
  config: FurnitureConfig;
  onSelect: (id: string) => void;
  onDragStop: (id: string, x: number, y: number) => void;
}

export function FurnitureItem({
  id,
  type,
  position,
  color,
  isSelected,
  isOwner,
  config,
  onSelect,
  onDragStop,
}: FurnitureItemProps) {
  const nodeRef = useRef(null);
  const Icon = config.icon;

  return (
    <Draggable
      nodeRef={nodeRef}
      disabled={!isOwner}
      defaultPosition={{
        x: position.x * config.cellSize,
        y: position.y * config.cellSize
      }}
      grid={[config.cellSize, config.cellSize]}
      bounds="parent"
      onStop={(_, data) => onDragStop(id, data.x, data.y)}
    >
      <div
        ref={nodeRef}
        className={`absolute cursor-move bg-white rounded-lg shadow-lg transition-transform hover:scale-105 ${
          isSelected ? 'ring-2 ring-blue-500' : ''
        }`}
        style={{
          width: config.width * config.cellSize,
          height: config.height * config.cellSize,
          backgroundColor: color || config.color,
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(id);
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon className="w-6 h-6 text-white drop-shadow" />
          {isOwner && (
            <Move className="absolute top-1 right-1 w-4 h-4 text-white opacity-50" />
          )}
        </div>
      </div>
    </Draggable>
  );
}
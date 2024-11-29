import { ArrowLeft, Lock, ShoppingBag, Unlock } from 'lucide-react';

interface InteriorHeaderProps {
  buildingName: string;
  isOwner: boolean;
  isLocked: boolean;
  onClose: () => void;
  onToggleLock: () => void;
  onOpenShop: () => void;
}

export function InteriorHeader({
  buildingName,
  isOwner,
  isLocked,
  onClose,
  onToggleLock,
  onOpenShop,
}: InteriorHeaderProps) {
  return (
    <div className="absolute top-0 left-0 right-0 bg-gray-800 p-4 flex items-center justify-between">
      <button
        onClick={onClose}
        className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Retour à la ville
      </button>
      <h2 className="text-xl font-bold text-white">
        {buildingName || 'Intérieur de la résidence'}
      </h2>
      <div className="flex gap-2">
        {isOwner && (
          <>
            <button
              onClick={onOpenShop}
              className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              title="Boutique de meubles"
            >
              <ShoppingBag className="w-5 h-5" />
            </button>
            <button
              onClick={onToggleLock}
              className={`p-2 rounded-lg transition-colors ${
                isLocked 
                  ? 'bg-red-500 text-white hover:bg-red-600' 
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
              title={isLocked ? 'Déverrouiller' : 'Verrouiller'}
            >
              {isLocked ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
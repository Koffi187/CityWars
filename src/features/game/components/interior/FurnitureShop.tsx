import { X } from 'lucide-react';
import { FURNITURE_CONFIGS } from './configs';
import { Resources } from '../../../resources/types';

interface FurnitureShopProps {
  onClose: () => void;
  onBuy: (type: string, price: number) => void;
  resources: Resources;
}

export function FurnitureShop({ onClose, onBuy, resources }: FurnitureShopProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200]">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Boutique de meubles</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(FURNITURE_CONFIGS).map(([type, config]) => {
            const Icon = config.icon;
            const canAfford = resources.money >= config.price;

            return (
              <div
                key={type}
                className={`relative group p-4 rounded-lg border-2 ${
                  canAfford 
                    ? 'border-gray-200 hover:border-blue-500 cursor-pointer'
                    : 'border-gray-200 opacity-50 cursor-not-allowed'
                }`}
                onClick={() => canAfford && onBuy(type, config.price)}
              >
                <div 
                  className="w-16 h-16 mx-auto mb-2 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: config.color }}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-center">
                  <div className="font-medium">{config.name}</div>
                  <div className="text-sm text-gray-500">
                    {config.width}x{config.height} cases
                  </div>
                  <div className="mt-2 text-blue-600 font-semibold">
                    {config.price} 💰
                  </div>
                </div>

                {!canAfford && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg">
                    <span className="text-red-500 text-sm font-medium">
                      Fonds insuffisants
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-4 text-sm text-gray-500">
          Votre or: {resources.money} 💰
        </div>
      </div>
    </div>
  );
}
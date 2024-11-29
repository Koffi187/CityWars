import { Building2, Coins, Factory, Gem } from 'lucide-react';
import { useGameStore } from '../../../store/gameStore';

export function ResourceBar() {
  const resources = useGameStore((state) => state.resources);

  if (!resources) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40 bg-gray-800/90 backdrop-blur-md rounded-full shadow-xl px-4 py-3 max-w-[90%] md:max-w-xl">
      <div className="flex justify-between items-center space-x-3 md:space-x-6">
        <ResourceItem
          icon={<Coins className="w-6 h-6 text-yellow-500" />}
          value={resources.money}
          label="Or"
          color="from-yellow-500/20"
        />
        <ResourceItem
          icon={<Building2 className="w-6 h-6 text-blue-500" />}
          value={resources.materials}
          label="Matériaux"
          color="from-blue-500/20"
        />
        <ResourceItem
          icon={<Factory className="w-6 h-6 text-purple-500" />}
          value={resources.energy}
          label="Énergie"
          color="from-purple-500/20"
        />
        <ResourceItem
          icon={<Gem className="w-6 h-6 text-yellow-400" />}
          value={resources.tokens}
          label="Jetons"
          color="from-yellow-400/20"
        />
      </div>
    </div>
  );
}

function ResourceItem({ 
  icon, 
  value, 
  label, 
  color 
}: { 
  icon: React.ReactNode; 
  value: number; 
  label: string;
  color: string;
}) {
  return (
    <div
      className={`flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-full bg-gradient-to-r ${color} to-transparent transition-all`}
    >
      {icon}
      <div>
        <div className="text-sm md:text-base font-bold text-white">
          {value?.toLocaleString() || '0'}
        </div>
        <div className="text-xs md:text-sm text-gray-300">
          {label}
        </div>
      </div>
    </div>
  );
}

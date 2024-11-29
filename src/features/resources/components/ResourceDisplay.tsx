import { Building2, Coins, Factory, Gem } from 'lucide-react';
import { useGameStore } from '../../../store/gameStore';

export function ResourceDisplay() {
  const resources = useGameStore((state) => state.resources);

  if (!resources) {
    return null;
  }

  return (
    <div className="flex gap-6">
      <ResourceItem
        icon={<Coins className="w-4 h-4 text-yellow-500" />}
        value={resources.money}
        label="Or"
      />
      <ResourceItem
        icon={<Building2 className="w-4 h-4 text-blue-500" />}
        value={resources.materials}
        label="Matériaux"
      />
      <ResourceItem
        icon={<Factory className="w-4 h-4 text-purple-500" />}
        value={resources.energy}
        label="Énergie"
      />
      <ResourceItem
        icon={<Gem className="w-4 h-4 text-yellow-400" />}
        value={resources.tokens}
        label="Jetons"
      />
    </div>
  );
}

function ResourceItem({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <div>
        <div className="font-medium">{value?.toLocaleString() || '0'}</div>
        <div className="text-xs text-gray-400">{label}</div>
      </div>
    </div>
  );
}
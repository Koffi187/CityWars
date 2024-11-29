import { Loader2 } from 'lucide-react';

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white">Chargement de CityWars...</h2>
      </div>
    </div>
  );
}
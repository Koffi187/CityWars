import { LogOut, Settings, User } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { auth } from '../firebase';
import { signOut, updateProfile } from 'firebase/auth';
import { useGameStore } from '../../../store/gameStore';

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [error, setError] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);
  const lastUsernameChange = useGameStore((state) => state.lastUsernameChange);

  const canChangeName = !lastUsernameChange || Date.now() - lastUsernameChange > 30 * 24 * 60 * 60 * 1000;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Erreur lors de la déconnexion:', err);
    }
  };

  const handleUpdateUsername = async () => {
    if (!auth.currentUser || !canChangeName || !newUsername.trim()) return;

    try {
      await updateProfile(auth.currentUser, {
        displayName: newUsername.trim()
      });
      useGameStore.setState({ lastUsernameChange: Date.now() });
      setIsEditing(false);
      setNewUsername('');
      setError('');
    } catch (err) {
      setError('Erreur lors du changement de pseudo');
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
      >
        <User className="w-5 h-5" />
        <span>{auth.currentUser?.displayName || auth.currentUser?.email?.split('@')[0]}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg p-2 z-50">
          {isEditing ? (
            <div className="p-2">
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="w-full px-3 py-2 border rounded-md mb-2"
                placeholder="Nouveau pseudo"
                maxLength={20}
              />
              {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
              {!canChangeName && (
                <p className="text-orange-500 text-sm mb-2">
                  Vous devez attendre 30 jours entre chaque changement de pseudo
                </p>
              )}
              <div className="flex gap-2">
                <button
                  onClick={handleUpdateUsername}
                  disabled={!canChangeName || !newUsername.trim()}
                  className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sauvegarder
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setNewUsername('');
                    setError('');
                  }}
                  className="bg-gray-200 px-3 py-1 rounded-md hover:bg-gray-300"
                >
                  Annuler
                </button>
              </div>
            </div>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 rounded-md"
              >
                <Settings className="w-4 h-4" />
                Changer de pseudo
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 rounded-md text-red-600"
              >
                <LogOut className="w-4 h-4" />
                Se déconnecter
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
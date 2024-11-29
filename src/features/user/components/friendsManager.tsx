import React, { useEffect, useState } from "react";
import { friendService } from "../services/friendService";
import { UserPlus, UserX, Check, Search } from "lucide-react";
import { userService } from "../../auth/services/userService"; // Importer la fonction pour récupérer le profil

export function FriendsManager() {
  const [friends, setFriends] = useState<string[]>([]);
  const [friendRequests, setFriendRequests] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [friendNames, setFriendNames] = useState<{ [key: string]: string }>({}); // Pour stocker les noms des amis

  useEffect(() => {
    const unsubscribeFriends = friendService.subscribeToFriends(setFriends);
    const unsubscribeRequests = friendService.subscribeToFriendRequests(setFriendRequests);

    return () => {
      if (unsubscribeFriends) unsubscribeFriends();
      if (unsubscribeRequests) unsubscribeRequests();
    };
  }, []);

  // Charger les noms des amis en utilisant leurs UID
  useEffect(() => {
    if (friends.length > 0) {
      friends.forEach(async (friendId) => {
        const profile = await userService.getUserProfileById(friendId);
        if (profile) {
          setFriendNames((prev) => ({
            ...prev,
            [friendId]: profile.name, // Associer l'UID au nom de l'ami
          }));
        }
      });
    }
  }, [friends]);

  const handleSearch = async () => {
    setLoading(true);
    await friendService.searchUsers(searchTerm, setSearchResults);
    setLoading(false);
  };

  const handleSendRequest = async (friendId: string) => {
    await friendService.sendFriendRequest(friendId);
  };

  const handleAcceptRequest = async (friendId: string) => {
    await friendService.acceptFriendRequest(friendId);
  };

  const handleRemoveFriend = async (friendId: string) => {
    await friendService.removeFriend(friendId);
  };

  return (
    <div className="p-6 bg-gray-800 text-white rounded-lg shadow-lg max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Gérer mes amis</h2>

      {/* Recherche */}
      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium text-gray-300">Rechercher un utilisateur</label>
        <div className="relative">
          <input
            type="text"
            className="w-full p-2.5 bg-gray-700 border border-gray-600 text-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="Entrez un nom ou un email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="absolute inset-y-0 right-0 px-4 bg-blue-600 hover:bg-blue-700 rounded-r-lg flex items-center"
            onClick={handleSearch}
          >
            <Search className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Résultats de la Recherche */}
      {searchResults.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Résultats de la recherche</h3>
          <ul className="space-y-3">
            {searchResults.map((user) => (
              <li key={user.id} className="flex items-center justify-between bg-gray-700 p-3 rounded-lg">
                <span>{user.name}</span>
                <button
                  onClick={() => handleSendRequest(user.id)}
                  className="flex items-center gap-2 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                >
                  <UserPlus className="w-4 h-4" />
                  Ajouter
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Demandes d'Amis */}
      {friendRequests.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Demandes reçues</h3>
          <ul className="space-y-3">
            {friendRequests.map((requestId) => (
              <li key={requestId} className="flex items-center justify-between bg-gray-700 p-3 rounded-lg">
                <span>{friendNames[requestId] || requestId}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAcceptRequest(requestId)}
                    className="flex items-center gap-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                  >
                    <Check className="w-4 h-4" />
                    Accepter
                  </button>
                  <button
                    onClick={() => {}}
                    className="flex items-center gap-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                  >
                    <UserX className="w-4 h-4" />
                    Refuser
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Liste des Amis */}
      {friends.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Mes amis</h3>
          <ul className="space-y-3">
            {friends.map((friendId) => (
              <li key={friendId} className="flex items-center justify-between bg-gray-700 p-3 rounded-lg">
                <span>{friendNames[friendId] || friendId}</span>
                <button
                  onClick={() => handleRemoveFriend(friendId)}
                  className="flex items-center gap-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                >
                  <UserX className="w-4 h-4" />
                  Supprimer
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {loading && <div className="mt-4 text-center">Chargement...</div>}
    </div>
  );
}

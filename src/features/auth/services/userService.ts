import { doc, setDoc, getDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { db, auth } from "../firebase";

const USERS_COLLECTION = "users";

export const userService = {
  /**
   * Crée un profil utilisateur dans Firestore
   * @param userId - L'UID de l'utilisateur (Firebase Auth)
   * @param name - Le nom complet de l'utilisateur
   */
  createUserProfile: async (userId: string, name: string) => {
    try {
      const userRef = doc(db, USERS_COLLECTION, userId);
      const userDoc = await getDoc(userRef);

      // Vérifie si le profil existe déjà
      if (!userDoc.exists()) {
        await setDoc(userRef, {
          name,
          createdAt: new Date(),
          friends: [], // Initialisation avec une liste d'amis vide
        });
        console.log("Profil utilisateur créé avec succès !");
      } else {
        console.log("Le profil utilisateur existe déjà. Mise à jour des données si nécessaire.");
        // Vous pouvez mettre à jour le profil ici si nécessaire
        // Exemple : mettre à jour le champ `name`
        await updateDoc(userRef, { name });
      }
    } catch (error) {
      console.error("Erreur lors de la création ou mise à jour du profil utilisateur :", error);
      throw error;
    }
  },

  getUserProfileById: async (userId: string) => {
    try {
      const userRef = doc(db, USERS_COLLECTION, userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        return userDoc.data(); // Retourne les données de l'utilisateur (y compris le 'name')
      } else {
        console.warn("Utilisateur non trouvé.");
        return null;
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du profil utilisateur :", error);
      throw error;
    }
  },

  /**
   * Récupère les données d'un utilisateur à partir de Firestore
   * @param userId - L'UID de l'utilisateur
   */
  getUserProfile: async (userId: string) => {
    try {
      const userRef = doc(db, USERS_COLLECTION, userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        return { id: userDoc.id, ...userDoc.data() };
      } else {
        console.warn("Le profil utilisateur n'existe pas.");
        return null;
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du profil utilisateur :", error);
      throw error;
    }
  },

  /**
   * Met à jour les données utilisateur
   * @param updates - Les données à mettre à jour
   */
  updateUserProfile: async (updates: Partial<{ name: string; friends: string[] }>) => {
    if (!auth.currentUser) return;

    try {
      const userRef = doc(db, USERS_COLLECTION, auth.currentUser.uid);
      await updateDoc(userRef, updates);
      console.log("Profil utilisateur mis à jour avec succès !");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil utilisateur :", error);
      throw error;
    }
  },

  /**
   * S'abonne aux changements des données utilisateur en temps réel
   * @param callback - Fonction à appeler avec les données utilisateur mises à jour
   */
  subscribeToUserProfile: (callback: (data: any) => void) => {
    if (!auth.currentUser) return;

    const userRef = doc(db, USERS_COLLECTION, auth.currentUser.uid);

    return onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        callback(doc.data());
      }
    });
  },

  /**
   * Ajoute un ami à la liste de l'utilisateur
   * @param friendId - L'UID de l'ami à ajouter
   */
  addFriend: async (friendId: string) => {
    if (!auth.currentUser) return;

    try {
      const userRef = doc(db, USERS_COLLECTION, auth.currentUser.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const currentFriends = userDoc.data().friends || [];
        if (!currentFriends.includes(friendId)) {
          await updateDoc(userRef, {
            friends: [...currentFriends, friendId],
          });
          console.log("Ami ajouté avec succès !");
        } else {
          console.warn("Cet utilisateur est déjà votre ami.");
        }
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout d'un ami :", error);
      throw error;
    }
  },

  /**
   * Supprime un ami de la liste de l'utilisateur
   * @param friendId - L'UID de l'ami à supprimer
   */
  removeFriend: async (friendId: string) => {
    if (!auth.currentUser) return;

    try {
      const userRef = doc(db, USERS_COLLECTION, auth.currentUser.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const currentFriends = userDoc.data().friends || [];
        const updatedFriends = currentFriends.filter((id: string) => id !== friendId);

        await updateDoc(userRef, {
          friends: updatedFriends,
        });
        console.log("Ami supprimé avec succès !");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression d'un ami :", error);
      throw error;
    }
  },
};

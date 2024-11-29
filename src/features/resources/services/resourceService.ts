import { doc, setDoc, getDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { db, auth } from "../../auth/firebase";
import { Resources } from "../types";
import { useGameStore } from "../../../store/gameStore";

// Nom de la collection où sont stockées les ressources des utilisateurs
const USERS_COLLECTION = "users";

// Ressources initiales d'un utilisateur
const INITIAL_RESOURCES: Resources = {
  money: 1000,
  materials: 500,
  energy: 100,
  tokens: 10,
};

export const resourceService = {
  /**
   * Initialise les ressources de l'utilisateur
   */
  initializeUserResources: async () => {
    if (!auth.currentUser) return;

    try {
      const userRef = doc(db, USERS_COLLECTION, auth.currentUser.uid);
      const userDoc = await getDoc(userRef);

      // Si l'utilisateur n'existe pas, on le crée avec des ressources initiales
      if (!userDoc.exists()) {
        await setDoc(userRef, {
          resources: INITIAL_RESOURCES,
          lastUsernameChange: null,
        });
        useGameStore.setState({
          resources: INITIAL_RESOURCES,
          lastUsernameChange: null,
        });
      } else {
        const data = userDoc.data();
        useGameStore.setState({
          resources: {
            ...INITIAL_RESOURCES,
            ...data.resources,
          },
          lastUsernameChange: data.lastUsernameChange,
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'initialisation des ressources :", error);
    }
  },

  /**
   * S'abonne aux changements des ressources utilisateur en temps réel
   */
  subscribeToResources: () => {
    if (!auth.currentUser) return;

    const userRef = doc(db, USERS_COLLECTION, auth.currentUser.uid);

    return onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        useGameStore.setState({
          resources: {
            ...INITIAL_RESOURCES,
            ...data.resources,
          },
          lastUsernameChange: data.lastUsernameChange,
        });
      }
    });
  },

  /**
   * Met à jour les ressources utilisateur dans Firestore
   * @param updates - Les données à mettre à jour
   */
  updateResources: async (updates: Partial<Resources>) => {
    if (!auth.currentUser) return;

    try {
      const userRef = doc(db, USERS_COLLECTION, auth.currentUser.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const currentResources = userDoc.data().resources || INITIAL_RESOURCES;
        const newResources = {
          ...currentResources,
          ...updates,
        };

        // Mise à jour des ressources dans Firestore
        await updateDoc(userRef, {
          resources: newResources,
        });

        return newResources;
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour des ressources :", error);
      throw error;
    }
  },

  /**
   * Met à jour le timestamp du dernier changement de pseudo
   * @param timestamp - Le timestamp du dernier changement
   */
  updateLastUsernameChange: async (timestamp: number) => {
    if (!auth.currentUser) return;

    try {
      const userRef = doc(db, USERS_COLLECTION, auth.currentUser.uid);
      await updateDoc(userRef, {
        lastUsernameChange: timestamp,
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la date de changement de pseudo :", error);
      throw error;
    }
  },
};

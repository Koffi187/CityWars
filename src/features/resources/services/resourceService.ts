import { doc, setDoc, onSnapshot, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../auth/firebase';
import { Resources } from '../types';
import { useGameStore } from '../../../store/gameStore';

const USERS_COLLECTION = 'users';

const INITIAL_RESOURCES: Resources = {
  money: 1000,
  materials: 500,
  energy: 100,
  tokens: 10,
};

export const resourceService = {
  initializeUserResources: async () => {
    if (!auth.currentUser) return;

    try {
      const userRef = doc(db, USERS_COLLECTION, auth.currentUser.uid);
      const userDoc = await getDoc(userRef);

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
      console.error('Erreur lors de l\'initialisation des ressources:', error);
    }
  },

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
        
        await updateDoc(userRef, {
          resources: newResources,
        });
        
        return newResources;
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour des ressources:', error);
      throw error;
    }
  },

  updateLastUsernameChange: async (timestamp: number) => {
    if (!auth.currentUser) return;

    try {
      const userRef = doc(db, USERS_COLLECTION, auth.currentUser.uid);
      await updateDoc(userRef, {
        lastUsernameChange: timestamp,
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la date de changement de pseudo:', error);
      throw error;
    }
  },
};
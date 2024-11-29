import { collection, addDoc, query, where, onSnapshot, deleteDoc, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../auth/firebase';
import { Building } from '../types';
import { useGameStore } from '../../../store/gameStore';

const BUILDINGS_COLLECTION = 'buildings';

export const buildingService = {
  subscribeToBuildings: (cityId: string) => {
    if (!auth.currentUser) return;

    const buildingsQuery = query(
      collection(db, BUILDINGS_COLLECTION),
      where('ownerId', '==', auth.currentUser.uid)
    );

    return onSnapshot(buildingsQuery, (snapshot) => {
      const buildings = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Building[];
      
      useGameStore.setState({ buildings });
    });
  },

  addBuilding: async (building: Omit<Building, 'id'>) => {
    if (!auth.currentUser) return;

    try {
      const buildingData = {
        ...building,
        createdAt: serverTimestamp(),
        ownerId: auth.currentUser.uid,
      };

      await addDoc(collection(db, BUILDINGS_COLLECTION), buildingData);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du bâtiment:', error);
      throw error;
    }
  },

  deleteBuilding: async (buildingId: string) => {
    if (!auth.currentUser) return;

    try {
      await deleteDoc(doc(db, BUILDINGS_COLLECTION, buildingId));
    } catch (error) {
      console.error('Erreur lors de la suppression du bâtiment:', error);
      throw error;
    }
  },

  updateBuilding: async (buildingId: string, updates: Partial<Building>) => {
    if (!auth.currentUser) return;

    try {
      const buildingRef = doc(db, BUILDINGS_COLLECTION, buildingId);
      await updateDoc(buildingRef, updates);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du bâtiment:', error);
      throw error;
    }
  }
};
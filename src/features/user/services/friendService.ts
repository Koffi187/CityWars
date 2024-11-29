import {
    collection,
    query,
    where,
    onSnapshot,
    doc,
    updateDoc,
    arrayUnion,
    arrayRemove,
  } from 'firebase/firestore';
  import { db, auth } from '../../auth/firebase';
  
  const USERS_COLLECTION = 'users';
  
  export const friendService = {
    subscribeToFriends: (callback: (friends: string[]) => void) => {
      if (!auth.currentUser) return;
  
      const userDoc = doc(db, USERS_COLLECTION, auth.currentUser.uid);
  
      return onSnapshot(userDoc, (snapshot) => {
        const data = snapshot.data();
        const friends = data?.friends || [];
        callback(friends);
      });
    },
  
    subscribeToFriendRequests: (callback: (requests: string[]) => void) => {
      if (!auth.currentUser) return;
  
      const userDoc = doc(db, USERS_COLLECTION, auth.currentUser.uid);
  
      return onSnapshot(userDoc, (snapshot) => {
        const data = snapshot.data();
        const friendRequests = data?.friendRequests || [];
        callback(friendRequests);
      });
    },
  
    sendFriendRequest: async (friendId: string) => {
      if (!auth.currentUser) return;
  
      try {
        const friendDoc = doc(db, USERS_COLLECTION, friendId);
  
        await updateDoc(friendDoc, {
          friendRequests: arrayUnion(auth.currentUser.uid),
        });
        console.log('Demande d\'ami envoyée !');
      } catch (error) {
        console.error('Erreur lors de l\'envoi de la demande d\'ami:', error);
        throw error;
      }
    },
  
    acceptFriendRequest: async (friendId: string) => {
      if (!auth.currentUser) return;
  
      const currentUserDoc = doc(db, USERS_COLLECTION, auth.currentUser.uid);
      const friendDoc = doc(db, USERS_COLLECTION, friendId);
  
      try {
        // Ajouter l'ami pour les deux utilisateurs
        await updateDoc(currentUserDoc, {
          friends: arrayUnion(friendId),
          friendRequests: arrayRemove(friendId),
        });
  
        await updateDoc(friendDoc, {
          friends: arrayUnion(auth.currentUser.uid),
        });
  
        console.log('Demande d\'ami acceptée !');
      } catch (error) {
        console.error('Erreur lors de l\'acceptation de la demande d\'ami:', error);
        throw error;
      }
    },
  
    removeFriend: async (friendId: string) => {
      if (!auth.currentUser) return;
  
      const currentUserDoc = doc(db, USERS_COLLECTION, auth.currentUser.uid);
      const friendDoc = doc(db, USERS_COLLECTION, friendId);
  
      try {
        // Supprimer l'ami pour les deux utilisateurs
        await updateDoc(currentUserDoc, {
          friends: arrayRemove(friendId),
        });
  
        await updateDoc(friendDoc, {
          friends: arrayRemove(auth.currentUser.uid),
        });
  
        console.log('Ami supprimé !');
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'ami:', error);
        throw error;
      }
    },
  
    searchUsers: async (searchTerm: string, callback: (results: any[]) => void) => {
      const usersRef = collection(db, USERS_COLLECTION);
  
      try {
        const usersQuery = query(usersRef, where('name', '>=', searchTerm));
        const unsubscribe = onSnapshot(usersQuery, (snapshot) => {
          const results = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          callback(results);
        });
  
        return unsubscribe;
      } catch (error) {
        console.error('Erreur lors de la recherche d\'utilisateurs:', error);
        throw error;
      }
    },
  };
  
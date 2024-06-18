import { useEffect } from 'react';
import { getDatabase, ref, onValue, onDisconnect, set, serverTimestamp } from 'firebase/database';
import { useUserContext } from '../../context/userContext';

function usePresence() {
  const { state } = useUserContext();

  useEffect(() => {
    const database = getDatabase();
    const userStatusDatabaseRef = ref(database, `/status/${state.user.uid}`);

    const isOfflineForDatabase = {
      state: 'offline',
      last_changed: serverTimestamp(),
    };

    const isOnlineForDatabase = {
      state: 'online',
      last_changed: serverTimestamp(),
    };

    const connectedRef = ref(database, '.info/connected');

    onValue(connectedRef, (snapshot) => {
      if (snapshot.val() === false) {
        return;
      }

      onDisconnect(userStatusDatabaseRef).set(isOfflineForDatabase).then(() => {
        set(userStatusDatabaseRef, isOnlineForDatabase);
      });
    });

    return () => {
      set(userStatusDatabaseRef, isOfflineForDatabase);
    };
  }, [state.user.uid]);
}

export default usePresence;

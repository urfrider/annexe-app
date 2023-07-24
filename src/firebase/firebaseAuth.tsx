import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';

export function useAuth() {
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    // Unsubscribe from the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  return user;
}

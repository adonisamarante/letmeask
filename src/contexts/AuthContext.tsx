import { createContext, ReactNode, useEffect, useState } from 'react';
import { auth, firebase } from '../services/firebase';

type User = {
  readonly id: string;
  readonly name: string;
  readonly avatar: string;
}

type AuthContextType = {
  // simbolo | serve para dizer que user pode ser User ou undefined, não é uma condição
  user: User | undefined;
  // signInWithGoogle = uma função ( () => ) que não retorna nada ( void )
  signInWithGoogle: () => Promise<void>;
}

type AuthContextProviderProps = {
  // o children nesse caso são componentes react, não seriam strings, então se diz que são ReactNode
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props: AuthContextProviderProps) {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    // sempre que se declara um event listener dentro de um useEffect é recomendado atribuir a variavel unsubscribe
    // que no caso desliga o listener e não fica ouvindo sem necessidade
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        const { displayName, photoURL, uid } = user;

        if (!displayName || !photoURL) {
          throw new Error('Missing information from Google Account.');
        }

        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL
        })
      }
    })

    return () => {
      unsubscribe();
    }
  }, [])

  async function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();

    const result = await auth.signInWithPopup(provider);

    if (!result.user) {
      throw new Error('User not found');
    }

    const { displayName, photoURL, uid } = result.user;

    if (!displayName || !photoURL) {
      throw new Error('Missing information from Google Account.');
    }

    setUser({
      id: uid,
      name: displayName,
      avatar: photoURL
    })
  }

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle }}>
      {props.children}
    </AuthContext.Provider>
  )
}
// // src/context/AuthContext.tsx
// "use client";

// import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import { useRouter } from 'next/navigation';

// interface User {
//   userId: string; // The property name from the JWT payload
//   email: string;
//   name: string;
// }

// interface AuthContextType {
//   user: User | null;
//   loading: boolean;
//   login: (userData: User) => void;
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true); // Start as true
//   const router = useRouter();

//   useEffect(() => {
//     // This function now fetches the session from the server
//     async function checkUserSession() {
//       try {
//         const response = await fetch('/api/auth/session');
//         if (response.ok) {
//           const data = await response.json();
//           setUser(data.user);
//         } else {
//           setUser(null);
//         }
//       } catch (error) {
//         console.error("Failed to fetch session:", error);
//         setUser(null);
//       } finally {
//         setLoading(false);
//       }
//     }

//     checkUserSession();
//   }, []);

//   const login = (userData: User) => {
//     setUser(userData);
//     router.push("/home");
//   };

//   const logout = async () => {
//     await fetch('/api/logout', { method: 'POST' });
//     setUser(null);
//     router.push('/login');
//   };

//   return (
//     <AuthContext.Provider value={{ user, loading, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };




// src/context/AuthContext.tsx
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  userId: string; // The property name from the JWT payload
  id?: string;    // Alias returned by the login response
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Start as true
  const router = useRouter();

  useEffect(() => {
    // This function now fetches the session from our dedicated server endpoint
    async function checkUserSession() {
      try {
        const response = await fetch('/api/auth/session');
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to fetch session:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    checkUserSession();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    router.push("/home");
  };

  const logout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
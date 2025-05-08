import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface TokenPayload {
  username: string;
  exp: number;
  iat: number;
}

interface AuthContextType {
  token: string | null;
  username: string | null;
  setToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  username: null,
  setToken: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(Cookies.get("token") || null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode<TokenPayload>(token);
        setUsername(decoded.username);
        Cookies.set("token", token);
      } catch {
        setUsername(null);
      }
    } else {
      setUsername(null);
      Cookies.remove("token");
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, username, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
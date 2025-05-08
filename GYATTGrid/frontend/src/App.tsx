import { Router } from './components/Router';
import { AuthProvider } from "./context/authContext";

export const App = () => {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  )
}
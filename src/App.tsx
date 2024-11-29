import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './features/auth/firebase';
import { Game } from './features/game/Game';
import { AuthModal } from './features/auth/components/AuthModal';
import { LoadingScreen } from './components/LoadingScreen';

function App() {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="w-full h-screen bg-gray-900">
      {!user ? <AuthModal /> : <Game />}
    </div>
  );
}

export default App;
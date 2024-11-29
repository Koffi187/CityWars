import { useState } from "react";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { LogIn, UserPlus, AlertCircle } from "lucide-react";
import { resourceService } from "../../resources/services/resourceService";
import { userService } from "../services/userService"; // Ajout du service user

export function AuthModal() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // Nouveau champ pour le nom
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        // Connexion
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        // Inscription
        const { user } = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        await resourceService.initializeUserResources();
        await userService.createUserProfile(user.uid, name); // Créer le profil utilisateur Firestore
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black flex items-center justify-center p-6">
      <div className="bg-gray-900 shadow-2xl rounded-lg p-8 max-w-md w-full transform transition-all duration-300">
        {/* Logo Section */}
        <div className="flex justify-center mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 64 64"
            className="w-16 h-16 text-blue-500"
            fill="currentColor"
          >
            <path d="M32 2L4 12v40l28 10 28-10V12L32 2zm0 4.3l24 9.4v37.7L32 57.7 8 53.4V15.7l24-9.4zM32 12c-8.8 0-16 7.2-16 16s7.2 16 16 16 16-7.2 16-16-7.2-16-16-16zm0 4c6.6 0 12 5.4 12 12s-5.4 12-12 12-12-5.4-12-12 5.4-12 12-12zm0 6a6 6 0 100 12 6 6 0 000-12z" />
          </svg>
        </div>

        <h2 className="text-3xl font-extrabold text-center text-white mb-6">
          {isLogin ? "Connexion" : "Inscription"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Nom complet
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full p-3 rounded-lg border border-gray-700 bg-gray-800 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                placeholder="Entrez votre nom complet"
                required={!isLogin}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300">
              Adresse email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full p-3 rounded-lg border border-gray-700 bg-gray-800 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              placeholder="Entrez votre email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full p-3 rounded-lg border border-gray-700 bg-gray-800 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              placeholder="Entrez votre mot de passe"
              required
            />
          </div>

          {error && (
            <div className="flex items-center text-red-500 text-sm">
              <AlertCircle className="w-5 h-5 mr-2" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-3 bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition-colors ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <span>Chargement...</span>
            ) : isLogin ? (
              <>
                <LogIn className="w-5 h-5" />
                Se connecter
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                S'inscrire
              </>
            )}
          </button>
        </form>

        <button
          onClick={() => setIsLogin(!isLogin)}
          className="mt-6 text-sm text-blue-400 hover:text-blue-500 text-center block w-full transition"
        >
          {isLogin
            ? "Pas encore de compte ? S'inscrire"
            : "Déjà un compte ? Se connecter"}
        </button>
      </div>
    </div>
  );
}

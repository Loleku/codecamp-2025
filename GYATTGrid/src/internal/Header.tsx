import logo from "../assets/logo.png";
import { Link } from 'react-router-dom';
import { Links } from '../constants/links';
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface TokenPayload {
    username: string;
    exp: number;
    iat: number;
}

const token = Cookies.get("token");
let username = "";

if (token) {
    try {
        const decoded = jwtDecode<TokenPayload>(token);
        username = decoded.username;
    } catch (err) {
        console.error("Błąd dekodowania tokena", err);
    }
}

export const Header = () => {
  return (
    <header className="fixed top-4 left-4 right-4 flex justify-between items-center bg-gray-900 text-white px-6 py-3 rounded-full shadow-lg z-50">
      <div className="flex items-center space-x-3">
        <img src={logo} alt="Logo" className="h-10 object-contain" />
        <p className="font-bold text-lg leading-none flex items-center m-0 h-10">
          <span className="text-[#208EF3]">GYATT</span>
          <span className="text-[#0F518C]">Grid</span>
        </p>
      </div>
      <ul className="hidden lg:flex lg:space-x-6">
        <Link to={Links.HOME} className="hover:scale-110 transition-transform text-white no-underline">
            Home
        </Link>
        {token && 
        <>
            <Link to={Links.SELECT} className="hover:scale-110 transition-transform text-white no-underline">
                Puzzles
            </Link>
            <Link to={Links.SETTINGS} className="hover:scale-110 transition-transform text-white no-underline">
                Settings
            </Link>
        </>
        }
      </ul>
      <div className="flex items-center space-x-4">
        {token ? (
            <>
                <p>{username}</p>
                <Link to={Links.PROFILE} className="hidden lg:block bg-white text-gray-900 px-4 py-2 rounded-full text-sm font-bold hover:bg-gray-200">
                    Profile
                </Link>
            </>
        ) : (
            <>
                <Link to={Links.LOGIN} className="text-white no-underline">
                    Sign in
                </Link>
                <Link to={Links.REGISTER} className="hidden lg:block bg-white text-gray-900 px-4 py-2 rounded-full text-sm font-bold hover:bg-gray-200">
                    Sign up
                </Link>
            </>
        )}
      </div>
    </header>
  );
};
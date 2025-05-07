import { FaFacebookF, FaInstagram, FaTiktok, FaXTwitter } from "react-icons/fa6";

export const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-8 mt-auto">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold">
                            <span className="text-logoYellow">Weather</span>
                            <span className="text-logoBlue">ly</span>
                        </h3>
                        <p className="text-gray-400 text-sm">
                            Your trusted weather companion providing accurate forecasts and real-time updates.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-logoBlue font-semibold">Services</h4>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li><a className="hover:text-logoYellow">Placeholder</a></li>
                            <li><a className="hover:text-logoYellow">Placeholder</a></li>
                            <li><a className="hover:text-logoYellow">Placeholder</a></li>
                            <li><a className="hover:text-logoYellow">Placeholder</a></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-logoBlue font-semibold">Company</h4>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li><a href="#" className="hover:text-logoYellow">Placeholder</a></li>
                            <li><a href="#" className="hover:text-logoYellow">Placeholder</a></li>
                            <li><a href="#" className="hover:text-logoYellow">Placeholder</a></li>
                            <li><a href="#" className="hover:text-logoYellow">Placeholder</a></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-logoBlue font-semibold">Contact Us</h4>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li>Email: info@weatherly.com</li>
                            <li>Phone: +48 123 456 789</li>
                            <li>Address: Pogodna 12</li>
                            <li>Lublin, Poland</li>
                        </ul>
                    </div>
                </div>

                <div className="flex justify-center items-center space-x-8 mt-8">
                    <a href="#" className="text-gray-400 hover:text-baloonBlue transition-colors" title="Facebook">
                        <FaFacebookF size={24} />
                    </a>
                    <a href="#" className="text-gray-400 hover:text-red-400 transition-colors" title="Instagram">
                        <FaInstagram size={24} />
                    </a>
                    <a href="#" className="text-gray-400 hover:text-[#69C9D0] transition-colors" title="TikTok">
                        <FaTiktok size={24} />
                    </a>
                    <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors" title="X">
                        <FaXTwitter size={24} />
                    </a>
                </div>


                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
                    <p>&copy; 2025 Weatherly. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};
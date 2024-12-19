import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="relative bg-gray-900 text-white py-10 rounded-t-xl border border-gray-400/30 shadow-inner ">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0 px-6">
        {/* Logo dan Deskripsi */}
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold">
            <span className="bg-gradient-to-r from-teal-400 to-blue-500 text-transparent bg-clip-text">MILEZ</span>
          </h2>
          <p className="text-gray-400 mt-2">Redefining sustainable travel, one journey at a time.</p>
        </div>

        {/* Ikon Media Sosial */}
        <div className="flex space-x-6">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-teal-400">
            <FaFacebook size={24} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-teal-400">
            <FaTwitter size={24} />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-teal-400">
            <FaInstagram size={24} />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-teal-400">
            <FaLinkedin size={24} />
          </a>
        </div>
      </div>

      {/* Hak Cipta */}
      <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-500">&copy; 2024 MILEZ. All rights reserved.</div>
    </footer>
  );
}

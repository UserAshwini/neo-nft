// "use client";
// import AnimatedText from "./cards/AnimatedText";
// import CustomConnectButton from "./cards/CustomConnectWallet";
// import { useAccount } from "wagmi";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// function Navbar({ Component, pageProps }) {
//   const { address } = useAccount();

//   const handleMyNftsClick = (e) => {
//     if (!address) {
//       e.preventDefault(); // Prevent navigation
//       toast.error("Connect your wallet to view My NFTs!", {
//         position: "top-right",
//         autoClose: 8000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         pauseOnFocusLoss: true,
//         theme: "dark",
//       });
//     }
//   };
//   return (
//     <div>
//       <nav className=" p-8 navbar navbar-pc">
//         <div className="flex items-center justify-between w-full">
//           <div className="text-4xl font-bold flex gap-2">
//             <AnimatedText text="Neo" color="white" />
//             <AnimatedText text="NFT" color="#39FF14" />
//           </div>
//           <div className="flex ml-auto nav-items">
//             <a href="/" className="mr-6">
//               <div className="nav-item text-white hover:text-lime-400">
//                 Home
//               </div>
//             </a>
//             <a href="/create-items" className="mr-6">
//               <div className="nav-item text-white hover:text-lime-400">
//                 Upload NFTs
//               </div>
//             </a>
//             <a href="/explore">
//               <div className="nav-item text-white hover:text-lime-400">
//                 Explore
//               </div>
//             </a>

//             <a href="/dashboard">
//               <div className="nav-item text-white hover:text-lime-400">
//                 Creator Dashboard
//               </div>
//             </a>
//             <a href="/my-assets" className="mr-6" onClick={handleMyNftsClick}>
//               <div className="nav-item text-white hover:text-lime-400">
//                 My NFTs
//               </div>
//             </a>
//           </div>
//           <div className="ml-auto">
//             <CustomConnectButton />
//           </div>
//         </div>
//       </nav>
//     </div>
//   );
// }

// export default Navbar;

"use client";
import AnimatedText from "./cards/AnimatedText";
import CustomConnectButton from "./cards/CustomConnectWallet";
import { useAccount } from "wagmi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";
import { Blend, X } from "lucide-react";
import { motion } from "framer-motion";

function Navbar({ Component, pageProps }) {
  const { address } = useAccount();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMyNftsClick = (e) => {
    if (!address) {
      e.preventDefault(); // Prevent navigation
      toast.error("Connect your wallet to view My NFTs!", {
        position: "top-right",
        autoClose: 8000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        pauseOnFocusLoss: true,
        theme: "dark",
      });
    }
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="navbar navbar-pc">
        <div className="flex items-center justify-between w-full">
          <div className="text-4xl font-bold flex gap-2">
            <AnimatedText text="Neo" color="white" />
            <AnimatedText text="NFT" color="#39FF14" />
          </div>
          <div className="flex items-center justify-between w-full">
            <div className="flex ml-auto nav-items">
              <a href="/" className="mr-6">
                <div className="nav-item text-white hover:text-lime-400">
                  Home
                </div>
              </a>
              <a href="/create-items" className="mr-6">
                <div className="nav-item text-white hover:text-lime-400">
                  Upload NFTs
                </div>
              </a>
              <a href="/explore" className="mr-6">
                <div className="nav-item text-white hover:text-lime-400">
                  Explore
                </div>
              </a>
              <a href="/dashboard" className="mr-6">
                <div className="nav-item text-white hover:text-lime-400">
                  Creator Dashboard
                </div>
              </a>
              <a href="/my-assets" className="mr-6" onClick={handleMyNftsClick}>
                <div className="nav-item text-white hover:text-lime-400">
                  My NFTs
                </div>
              </a>
            </div>
            <div className="ml-auto">
              <CustomConnectButton />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navbar */}
      <nav className="navbar navbar-mobile">
        <div className="flex items-center justify-between w-full">
          <div className="text-sm font-bold flex gap-2">
            <AnimatedText text="Neo" color="white" />
            <AnimatedText text="NFT" color="#39FF14" />
          </div>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="focus:outline-none z-50"
          >
            <Blend className="text-white" size={32} />
          </button>
        </div>

        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-xl z-40"
          />
        )}

        {/* Mobile Navigation Menu - Slide-in panel */}
        {menuOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3 }}
            className="fixed top-24 left-[-20] w-full h-screen bg-black/80 z-50"
          >
            <div className="ml-32 flex flex-col space-y-16 mt-52 text-white ">
              <a
                href="/"
                className="nav-item text-white hover:text-lime-400 text-4xl "
                onClick={() => setMenuOpen(false)}
              >
                <p className="text-2xl text-[#39FF14] acme-font">Home</p>
                Home
              </a>
              <a
                href="/create-items"
                className="nav-item text-white hover:text-lime-400 text-4xl"
                onClick={() => setMenuOpen(false)}
              >
                <p className="text-2xl text-[#39FF14] acme-font">Upload NFTs</p>
                Upload NFTs
              </a>
              <a
                href="/explore"
                className="nav-item text-white hover:text-lime-400 text-4xl"
                onClick={() => setMenuOpen(false)}
              >
                <p className="text-2xl text-[#39FF14] acme-font">Explore</p>
                Explore
              </a>
              <a
                href="/dashboard"
                className="nav-item text-white hover:text-lime-400 text-4xl"
                onClick={() => setMenuOpen(false)}
              >
                <p className="text-2xl text-[#39FF14] acme-font">
                  Creator Dashboard
                </p>
                Creator Dashboard
              </a>
              <a
                href="/my-assets"
                onClick={(e) => {
                  handleMyNftsClick(e);
                  setMenuOpen(false);
                }}
                className="nav-item text-white hover:text-lime-400 text-4xl"
              >
                <p className="text-2xl text-[#39FF14] acme-font">My NFTs</p>
                My NFTs
              </a>
              <div className="mt-4 gap-28">
                <CustomConnectButton />
              </div>
            </div>
          </motion.div>
        )}
      </nav>
    </>
  );
}

export default Navbar;

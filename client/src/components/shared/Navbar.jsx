import { useRef, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Search from "./Search";
import { memo } from "react";
import { logoutAction } from "../../redux/actions/authActions";
import { IoLogOutOutline } from "react-icons/io5";
import { Transition } from "@headlessui/react";
import { AiOutlineBars } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import Logo from "../../assets/SocialEcho.png";
import { BiChat } from "react-icons/bi";

const Navbar = ({ userData, toggleLeftbar, showLeftbar }) => {
  const dispatch = useDispatch();
  const [loggingOut, setLoggingOut] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef(null);

  const handleProfileClick = () => {
    setShowDropdown(!showDropdown);
  };

  const logout = async () => {
    setLoggingOut(true);
    await dispatch(logoutAction());
    setLoggingOut(false);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <nav className="sticky top-0 z-20 flex items-center justify-between bg-white/10 backdrop-blur-lg p-4 shadow-lg md:px-20 border-b border-gray-200">
      {/* Logo */}
      <Link to="/" className="flex items-center">
        <img className="w-36 opacity-90 brightness-125 drop-shadow-lg" src={Logo} alt="Logo" />
      </Link>

      {/* Mobile Menu Button */}
      <button className="md:hidden text-2xl text-white hover:text-gray-300 transition duration-300" onClick={toggleLeftbar}>
        {showLeftbar ? <RxCross1 /> : <AiOutlineBars />}
      </button>

      {/* Search Box */}
      <div className="flex-1 mx-4 md:max-w-lg">
        <Search />
      </div>

      {/* Chatbot Link */}
      <Link to="/chatbot" className="hidden md:flex items-center gap-2 text-white hover:text-gray-300 transition duration-300 bg-gray-800/50 px-3 py-2 rounded-lg shadow-md">
        <BiChat className="text-xl" />
        <span>Chatbot</span>
      </Link>

      {/* Profile Dropdown */}
      <div className="relative">
        <button
          type="button"
          className="h-10 w-10 flex items-center justify-center rounded-full overflow-hidden border border-gray-300 hover:shadow-lg transition duration-300"
          onClick={handleProfileClick}
        >
          <img
            src={userData.avatar}
            alt="profile"
            className="h-full w-full object-cover"
          />
        </button>

        <Transition
          show={showDropdown}
          enter="transition ease-out duration-300 transform"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-200 transform"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          {() => (
            <div
              ref={dropdownRef}
              className="absolute right-0 mt-2 w-72 bg-white/90 backdrop-blur-lg rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 p-4"
            >
              <div className="py-2 text-center">
                <img
                  src={userData.avatar}
                  alt="profile"
                  className="mx-auto mb-2 h-16 w-16 rounded-full border border-gray-300 object-cover shadow-md"
                />
                <div className="text-sm font-semibold text-gray-700 hover:underline">
                  <Link to={`/profile`}>{userData.name}</Link>
                </div>
                <div className="text-sm text-gray-500">{userData.email}</div>
              </div>
              <hr className="my-2 border-gray-300" />
              <button
                type="button"
                className="block w-full px-4 py-2 text-center text-sm text-red-500 hover:bg-gray-100 rounded-md transition duration-300"
                onClick={logout}
                disabled={loggingOut}
              >
                {loggingOut ? "Logging out..." : <div className="flex items-center justify-center">Logout <IoLogOutOutline className="ml-2" /></div>}
              </button>
            </div>
          )}
        </Transition>
      </div>
    </nav>
  );
};

export default memo(Navbar);

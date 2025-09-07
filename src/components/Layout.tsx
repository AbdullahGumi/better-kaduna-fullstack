"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import EventList from "./events/EventList";
import { useAuth } from "../lib/auth";

const TikTokIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M34.353 17.327C37.4397 19.5413 41.2211 20.8442 45.3051 20.8442V12.9573C44.5322 12.9574 43.7613 12.8765 43.0051 12.7158V18.9239C38.9214 18.9239 35.1405 17.621 32.053 15.4068V31.5018C32.053 39.5533 25.5492 46.0799 17.5268 46.0799C14.5334 46.0799 11.7512 45.1717 9.44006 43.6141C12.0779 46.3209 15.7565 48 19.8263 48C27.8492 48 34.3534 41.4734 34.3534 33.4216V17.327H34.353ZM37.1904 9.37002C35.6129 7.64048 34.5772 5.40538 34.353 2.93438V1.91995H32.1735C32.7221 5.06059 34.5934 7.74377 37.1904 9.37002ZM14.5142 37.4356C13.6329 36.2759 13.1566 34.8572 13.1587 33.3985C13.1587 29.7161 16.1336 26.7303 19.8037 26.7303C20.4877 26.7301 21.1675 26.8352 21.8194 27.0428V18.9796C21.0576 18.8748 20.2888 18.8303 19.5203 18.8466V25.1226C18.868 24.9151 18.1878 24.8096 17.5037 24.8103C13.8335 24.8103 10.8589 27.7958 10.8589 31.4787C10.8589 34.0828 12.3458 36.3374 14.5142 37.4356Z"
      fill="#FF004F"
    />
    <path
      d="M32.0529 15.4067C35.1404 17.6209 38.9213 18.9237 43.005 18.9237V12.7156C40.7255 12.2283 38.7075 11.0328 37.1903 9.37002C34.5931 7.74361 32.722 5.06043 32.1733 1.91995H26.4482V33.4213C26.4352 37.0937 23.4655 40.0673 19.8032 40.0673C17.6451 40.0673 15.7279 39.0349 14.5136 37.4356C12.3454 36.3374 10.8585 34.0827 10.8585 31.4789C10.8585 27.7963 13.8331 24.8105 17.5032 24.8105C18.2064 24.8105 18.8842 24.9204 19.5199 25.1228V18.8468C11.6384 19.0102 5.2998 25.473 5.2998 33.4214C5.2998 37.3892 6.87827 40.9861 9.44013 43.6143C11.7513 45.1717 14.5335 46.08 17.5268 46.08C25.5494 46.08 32.0531 39.5531 32.0531 31.5018V15.4067H32.0529Z"
      fill="black"
    />
    <path
      d="M43.0051 12.7156V11.037C40.9495 11.0401 38.9343 10.4624 37.1903 9.36987C38.7342 11.0661 40.7671 12.2357 43.0051 12.7156ZM32.1734 1.91997C32.1211 1.61982 32.0809 1.3177 32.053 1.01443V0H24.148V31.5016C24.1354 35.1735 21.1658 38.1471 17.5033 38.1471C16.428 38.1471 15.4128 37.891 14.5137 37.4358C15.7279 39.0349 17.6452 40.0671 19.8033 40.0671C23.4652 40.0671 26.4354 37.0938 26.4482 33.4214V1.91997H32.1734ZM19.5203 18.8468V17.0598C18.8598 16.9692 18.1938 16.9237 17.5271 16.924C9.50383 16.9239 3 23.4508 3 31.5016C3 36.5491 5.55612 40.9974 9.44034 43.614C6.87848 40.986 5.30002 37.3889 5.30002 33.4213C5.30002 25.473 11.6385 19.0102 19.5203 18.8468Z"
      fill="#00F2EA"
    />
  </svg>
);

const TwitterIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M36.6526 3.80782H43.3995L28.6594 20.6548L46 43.5798H32.4225L21.7881 29.6759L9.61989 43.5798H2.86886L18.6349 25.56L2 3.80782H15.9222L25.5348 16.5165L36.6526 3.80782ZM34.2846 39.5414H38.0232L13.8908 7.63408H9.87892L34.2846 39.5414Z"
      fill="white"
    />
  </svg>
);

const InstagramIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_17_27)">
      <path
        d="M24 4.32187C30.4125 4.32187 31.1719 4.35 33.6938 4.4625C36.0375 4.56562 37.3031 4.95938 38.1469 5.2875C39.2625 5.71875 40.0688 6.24375 40.9031 7.07812C41.7469 7.92188 42.2625 8.71875 42.6938 9.83438C43.0219 10.6781 43.4156 11.9531 43.5188 14.2875C43.6313 16.8187 43.6594 17.5781 43.6594 23.9813C43.6594 30.3938 43.6313 31.1531 43.5188 33.675C43.4156 36.0188 43.0219 37.2844 42.6938 38.1281C42.2625 39.2438 41.7375 40.05 40.9031 40.8844C40.0594 41.7281 39.2625 42.2438 38.1469 42.675C37.3031 43.0031 36.0281 43.3969 33.6938 43.5C31.1625 43.6125 30.4031 43.6406 24 43.6406C17.5875 43.6406 16.8281 43.6125 14.3063 43.5C11.9625 43.3969 10.6969 43.0031 9.85313 42.675C8.7375 42.2438 7.93125 41.7188 7.09688 40.8844C6.25313 40.0406 5.7375 39.2438 5.30625 38.1281C4.97813 37.2844 4.58438 36.0094 4.48125 33.675C4.36875 31.1438 4.34063 30.3844 4.34063 23.9813C4.34063 17.5688 4.36875 16.8094 4.48125 14.2875C4.58438 11.9437 4.97813 10.6781 5.30625 9.83438C5.7375 8.71875 6.2625 7.9125 7.09688 7.07812C7.94063 6.23438 8.7375 5.71875 9.85313 5.2875C10.6969 4.95938 11.9719 4.56562 14.3063 4.4625C16.8281 4.35 17.5875 4.32187 24 4.32187ZM24 0C17.4844 0 16.6688 0.028125 14.1094 0.140625C11.5594 0.253125 9.80625 0.665625 8.2875 1.25625C6.70312 1.875 5.3625 2.69062 4.03125 4.03125C2.69063 5.3625 1.875 6.70313 1.25625 8.27813C0.665625 9.80625 0.253125 11.55 0.140625 14.1C0.028125 16.6687 0 17.4844 0 24C0 30.5156 0.028125 31.3312 0.140625 33.8906C0.253125 36.4406 0.665625 38.1938 1.25625 39.7125C1.875 41.2969 2.69063 42.6375 4.03125 43.9688C5.3625 45.3 6.70313 46.125 8.27813 46.7344C9.80625 47.325 11.55 47.7375 14.1 47.85C16.6594 47.9625 17.475 47.9906 23.9906 47.9906C30.5063 47.9906 31.3219 47.9625 33.8813 47.85C36.4313 47.7375 38.1844 47.325 39.7031 46.7344C41.2781 46.125 42.6188 45.3 43.95 43.9688C45.2812 42.6375 46.1063 41.2969 46.7156 39.7219C47.3063 38.1938 47.7188 36.45 47.8313 33.9C47.9438 31.3406 47.9719 30.525 47.9719 24.0094C47.9719 17.4938 47.9438 16.6781 47.8313 14.1188C47.7188 11.5688 47.3063 9.81563 46.7156 8.29688C46.125 6.70312 45.3094 5.3625 43.9688 4.03125C42.6375 2.7 41.2969 1.875 39.7219 1.26562C38.1938 0.675 36.45 0.2625 33.9 0.15C31.3313 0.028125 30.5156 0 24 0Z"
        fill="#fff"
      />
      <path
        d="M24 11.6719C17.1938 11.6719 11.6719 17.1938 11.6719 24C11.6719 30.8062 17.1938 36.3281 24 36.3281C30.8062 36.3281 36.3281 30.8062 36.3281 24C36.3281 17.1938 30.8062 11.6719 24 11.6719ZM24 31.9969C19.5844 31.9969 16.0031 28.4156 16.0031 24C16.0031 19.5844 19.5844 16.0031 24 16.0031C28.4156 16.0031 31.9969 19.5844 31.9969 24C31.9969 28.4156 28.4156 31.9969 24 31.9969Z"
        fill="#fff"
      />
      <path
        d="M39.6937 11.1844C39.6937 12.7782 38.4 14.0625 36.8156 14.0625C35.2219 14.0625 33.9375 12.7688 33.9375 11.1844C33.9375 9.59065 35.2313 8.30627 36.8156 8.30627C38.4 8.30627 39.6937 9.60003 39.6937 11.1844Z"
        fill="#fff"
      />
    </g>
    <defs>
      <clipPath id="clip0_17_27">
        <rect width="48" height="48" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const FacebookIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_17_24)">
      <path
        d="M48 24C48 10.7453 37.2547 0 24 0C10.7453 0 0 10.7453 0 24C0 35.255 7.74912 44.6995 18.2026 47.2934V31.3344H13.2538V24H18.2026V20.8397C18.2026 12.671 21.8995 8.8848 29.9194 8.8848C31.44 8.8848 34.0637 9.18336 35.137 9.48096V16.129C34.5706 16.0694 33.5866 16.0397 32.3645 16.0397C28.4294 16.0397 26.9088 17.5306 26.9088 21.4061V24H34.7482L33.4013 31.3344H26.9088V47.8243C38.7926 46.3891 48.001 36.2707 48.001 24H48Z"
        fill="#0866FF"
      />
      <path
        d="M33.4003 31.3344L34.7472 24H26.9078V21.4061C26.9078 17.5306 28.4285 16.0397 32.3635 16.0397C33.5856 16.0397 34.5696 16.0694 35.136 16.129V9.48096C34.0627 9.1824 31.439 8.8848 29.9184 8.8848C21.8986 8.8848 18.2016 12.671 18.2016 20.8397V24H13.2528V31.3344H18.2016V47.2934C20.0582 47.7542 22.0003 48 23.999 48C24.983 48 25.9536 47.9395 26.9069 47.8243V31.3344H33.3994H33.4003Z"
        fill="white"
      />
    </g>
    <defs>
      <clipPath id="clip0_17_24">
        <rect width="48" height="48" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

// Social media configuration
const socialMediaLinks = [
  {
    href: "https://x.com/better_kaduna?s=11",
    iconComponent: TwitterIcon,
    ariaLabel: "Follow us on X (Twitter)",
  },
  {
    href: "https://www.instagram.com/better_kaduna?igsh=cGt0cW5mOXpweDcx&utm_source=qr",
    iconComponent: InstagramIcon,
    ariaLabel: "Follow us on Instagram",
  },
  {
    href: "https://www.tiktok.com/@better_kaduna?_t=ZS-8zWY4CId3di&_r=1",
    iconComponent: TikTokIcon,
    ariaLabel: "Follow us on TikTok",
  },
  {
    href: "https://www.facebook.com/profile.php?id=100081016866975",
    iconComponent: FacebookIcon,
    ariaLabel: "Follow us on Facebook",
  },
];

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
  };

  const handleMobileNavClick = () => {
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Determine if we're on the home page
  const isHomePage = pathname === "/";

  return (
    <div className="min-h-screen bg-white font-serif flex flex-col">
      {/* Navbar */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" aria-label="Better Kaduna Home">
            <img
              src="https://res.cloudinary.com/dob19lapx/image/upload/v1756322927/logo_pvnwq1.png"
              alt="Better Kaduna Logo"
              className="h-24 max-w-full"
            />
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex space-x-6" role="navigation">
              <Link
                href="/about"
                className="text-kaduna-gray hover:text-green-800 transition-colors"
              >
                About Us
              </Link>
              <Link
                href="/facts"
                className="text-kaduna-gray hover:text-green-800 transition-colors"
              >
                Facts About Kaduna
              </Link>
              <Link
                href="/mdas"
                className="text-kaduna-gray hover:text-green-800 transition-colors"
              >
                Inside Kaduna MDAs
              </Link>
              <Link
                href="/contact"
                className="text-kaduna-gray hover:text-green-800 transition-colors"
              >
                Contact Us
              </Link>
              {user && user.role === "admin" && (
                <Link
                  href="/admin"
                  className="text-kaduna-gray hover:text-green-800 transition-colors"
                >
                  Admin Dashboard
                </Link>
              )}
            </nav>
            {user && user.role !== "guest" ? (
              <button
                onClick={handleLogout}
                className="text-kaduna-gray hover:text-green-800"
                aria-label="Logout"
              >
                Logout
              </button>
            ) : (
              <div className="flex space-x-4">
                <Link
                  href="/login"
                  className="text-kaduna-gray hover:text-green-800"
                  aria-label="Login"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="text-kaduna-gray hover:text-green-800"
                  aria-label="Register"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-kaduna-gray hover:text-green-800"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={
                  isMenuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
        </div>
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white shadow-md">
            <nav className="flex flex-col p-4 space-y-2" role="navigation">
              <Link
                href="/"
                className="text-kaduna-gray hover:text-green-800"
                onClick={handleMobileNavClick}
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-kaduna-gray hover:text-green-800"
                onClick={handleMobileNavClick}
              >
                About Us
              </Link>
              <Link
                href="/facts"
                className="text-kaduna-gray hover:text-green-800"
                onClick={handleMobileNavClick}
              >
                Facts About Kaduna
              </Link>
              <Link
                href="/mdas"
                className="text-kaduna-gray hover:text-green-800"
                onClick={handleMobileNavClick}
              >
                Inside Kaduna MDAs
              </Link>
              <Link
                href="/contact"
                className="text-kaduna-gray hover:text-green-800"
                onClick={handleMobileNavClick}
              >
                Contact Us
              </Link>
              {user && user.role === "admin" && (
                <Link
                  href="/admin"
                  className="text-kaduna-gray hover:text-green-800"
                  onClick={handleMobileNavClick}
                >
                  Admin Dashboard
                </Link>
              )}
              {user && user.role !== "guest" ? (
                <button
                  onClick={() => {
                    handleLogout();
                    handleMobileNavClick();
                  }}
                  className="text-kaduna-gray hover:text-green-800 text-left"
                  aria-label="Logout"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-kaduna-gray hover:text-green-800 text-left"
                    aria-label="Login"
                    onClick={handleMobileNavClick}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="text-kaduna-gray hover:text-green-800 text-left"
                    aria-label="Register"
                    onClick={handleMobileNavClick}
                  >
                    Register
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </header>
      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 md:py-8 flex flex-col md:flex-row flex-grow">
        <div className={isHomePage ? "w-full md:w-2/3 pr-0 md:pr-8" : "w-full"}>
          {children}
        </div>
        {isHomePage && (
          <aside className="w-full md:w-1/3 mt-8 md:mt-0">
            <div className="sticky top-28">
              <EventList />
            </div>
          </aside>
        )}
      </main>
      {/* Footer */}
      <footer className="bg-green-800 text-white py-6 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <img
            src="https://res.cloudinary.com/dob19lapx/image/upload/v1756322927/logo_pvnwq1.png"
            alt="Better Kaduna Logo"
            className="h-24 max-w-full mx-auto mb-4"
          />
          <p>&copy; 2025 Better Kaduna. All rights reserved.</p>
          <nav className="mt-2 space-x-4" role="navigation">
            <Link href="/about" className="hover:underline text-white">
              About Us
            </Link>
            <Link href="/facts" className="hover:underline text-white">
              Facts About Kaduna
            </Link>
            <Link href="/mdas" className="hover:underline text-white">
              Inside Kaduna MDAs
            </Link>
            <Link href="/contact" className="hover:underline text-white">
              Contact Us
            </Link>
            {user && user.role === "admin" && (
              <Link href="/admin" className="hover:underline text-white">
                Admin Dashboard
              </Link>
            )}
          </nav>
          {/* Social Media Links */}
          <div className="mt-4 flex justify-center space-x-6">
            {socialMediaLinks.map((link) => {
              const IconComponent = link.iconComponent;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-green-200 transition-colors"
                  aria-label={link.ariaLabel}
                >
                  <IconComponent />
                </a>
              );
            })}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

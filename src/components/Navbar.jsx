import React, { useState } from "react";
import { navbarStyles as s } from "../assets/dummyStyles";
import { Circle, Menu, X } from "lucide-react";

const Navbar = () => {
  const [openMenu, setOpenMenu] = useState(false);
  return (
    <div className={s.nav}>
      <div className={s.innerContainer}>
        <a href="#top" className={s.logo}>
          FooTBall
        </a>

        {/* decktop nav  */}
        <div className={s.desktopNav}>
          <a href="#match-center" className={s.desktopNavLink}>
            Matches
          </a>
          <a href="#standings" className={s.desktopNavLink}>
            Standings
          </a>
          <a href="#fixtures" className={s.desktopNavLink}>
            Fixtures
          </a>
        </div>
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <a href="#live" className={s.liveButton}>
            <Circle size={7} className={s.liveIcon} />
            <span className={s.liveTextFull}>Live Stream</span>
            <span className={s.liveTextShort}>Live</span>
          </a>

          {/* mobile hanburger  */}
          <button
            className={s.hamburgerButton}
            onClick={() => setOpenMenu(!openMenu)}
          >
            {openMenu ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* mobile menu overlar  */}
      {openMenu && (
        <div className={s.mobileMenu}>
          {[
            ["#match-center", "Match"],
            ["#standings", "Standings"],
            ["#fixtures", "Fixtures"],
          ].map(([href, label]) => (
            <a
              href={href}
              key={href}
              className={s.mobileMenuLink}
              onClick={() => setOpenMenu(false)}
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default Navbar;

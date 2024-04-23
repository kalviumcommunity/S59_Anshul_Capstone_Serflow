import React from "react";
import { Link } from "react-router-dom";
import "./HomeNav.css";
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

function HomeNav() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div
      className="navbar md:w-full md:fixed z-10 md:flex md:flex-row md:justify-center shadow-sm"
      style={{ background: "rgb(245,245,245)" }}
    >
      <div className="HomeNav ">
        <nav
          className="flex justify-between items-center h-16  text-black relative  font-mono w-full "
          role="navigation"
        >
          <Link to={"/"} className="pl-8">
            <img src="logo-no-background.svg" className="h-10" alt="" />
          </Link>
          <div className="px-4 cursor-pointer md:hidden">
            <Button
              id="basic-button"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </Button>
          </div>
          <div className="pr-8 md:block hidden">
            <Link to={"/about"} className="p-4">
              About
            </Link>
            <Link to={"/faq"} className="p-4">
              FAQ
            </Link>
            <Link to={"/contact"} className="p-4">
              Contact
            </Link>
          </div>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <Link to={"/about"} className="">
              <MenuItem onClick={handleClose}>About</MenuItem>
            </Link>
            <Link to={"/faq"} className="">
            <MenuItem onClick={handleClose}>FAQ</MenuItem>
            </Link>
            <Link to={"/contact"} className="">
            <MenuItem onClick={handleClose}>Contact</MenuItem>
            </Link>
          </Menu>
        </nav>
      </div>
    </div>
  );
}

export default HomeNav;

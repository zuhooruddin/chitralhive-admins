import { styled } from "@mui/material";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react"; // component props interface

// styled component
const StyledLink = styled("a", {
  shouldForwardProp: (prop) => prop !== "active_route",
})(({ theme, active_route }) => ({
  position: "relative",
  transition: "color 150ms ease-in-out",
  color: active_route === "active" ? theme.palette.primary.main : "inherit",
  "&:hover": {
    color: `${theme.palette.primary.main} !important`,
  },
}));

const NavLink = ({ href, children, style, className, ...props }) => {
  const { pathname } = useRouter();

  const checkRouteMatch = () => {
    if (href === "/") return pathname === href;
    return pathname.includes(href);
  }; // active route

  const currentRoute = checkRouteMatch();
  return (
    <StyledLink
      component={Link}
      href={href}
      style={style}
      className={clsx(className)}
      active_route={currentRoute ? "active" : ""}
      {...props}
    >
      {children}
    </StyledLink>
  );
};

export default NavLink;

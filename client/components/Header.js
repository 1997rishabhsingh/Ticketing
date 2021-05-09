import { Navbar, NavbarBrand, Nav, NavItem, NavLink } from "reactstrap";
import Link from "next/link";

const Header = ({ currentUser }) => {
  const links = [
    {
      label: "Sign Up",
      href: "/auth/signup",
      show: !currentUser
    },
    {
      label: "Sign In",
      href: "/auth/signin",
      show: !currentUser
    },
    {
      label: "Sign Out",
      href: "/auth/signout",
      show: !!currentUser
    }
  ];

  return (
    <Navbar
      color="light"
      light
      expand="md"
      className="p-3 justify-content-between"
    >
      <Link href="/">
        <NavbarBrand style={{ cursor: "pointer" }}>Ticketing</NavbarBrand>
      </Link>
      <Nav>
        {links.map(
          (l) =>
            l.show && (
              <Link key={l.label} href={l.href}>
                <NavItem style={{ cursor: "pointer" }}>
                  <NavLink>{l.label}</NavLink>
                </NavItem>
              </Link>
            )
        )}
      </Nav>
    </Navbar>
  );
};

export default Header;

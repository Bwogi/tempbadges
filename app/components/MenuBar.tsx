'use client';

import { useState } from 'react';
import { Menu, Button, Icon, Sidebar } from 'semantic-ui-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useClerk, useUser } from '@clerk/nextjs';

const MenuBar = () => {
  const pathname = usePathname();
  const { signOut } = useClerk();
  const { isSignedIn, user } = useUser();
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const handleSignOut = () => {
    signOut();
  };

  const menuItems = (
    <>
      <Menu.Item
        as={Link}
        href="/"
        active={pathname === '/'}
        onClick={() => setSidebarVisible(false)}
      >
        Home
      </Menu.Item>
      {isSignedIn && (
        <Menu.Item
          as={Link}
          href="/badges"
          active={pathname === '/badges'}
          onClick={() => setSidebarVisible(false)}
        >
          Badge Management
        </Menu.Item>
      )}
    </>
  );

  const authItems = (
    <>
      {isSignedIn ? (
        <>
          <Menu.Item>
            <span>Welcome, {user?.firstName || 'User'}</span>
          </Menu.Item>
          <Menu.Item>
            <Button 
              negative 
              onClick={handleSignOut}
              size='small'
            >
              Logout
            </Button>
          </Menu.Item>
        </>
      ) : (
        <Menu.Item
          as={Link}
          href="/sign-in"
          onClick={() => setSidebarVisible(false)}
        >
          Sign In
        </Menu.Item>
      )}
    </>
  );

  return (
    <>
      {/* Desktop Menu */}
      <Menu fixed="top" inverted className="desktop-menu" style={{ marginBottom: '2rem' }}>
        {menuItems}
        <Menu.Menu position="right">
          {authItems}
        </Menu.Menu>
      </Menu>

      {/* Mobile Menu */}
      <Menu fixed="top" inverted className="mobile-menu" style={{ marginBottom: '2rem' }}>
        <Menu.Item onClick={() => setSidebarVisible(true)}>
          <Icon name="bars" />
        </Menu.Item>
        <Menu.Item header>Badge Management</Menu.Item>
      </Menu>

      {/* Mobile Sidebar */}
      <Sidebar
        as={Menu}
        animation='overlay'
        inverted
        vertical
        visible={sidebarVisible}
        onHide={() => setSidebarVisible(false)}
        style={{ paddingTop: '4rem' }}
      >
        {menuItems}
        {authItems}
      </Sidebar>
    </>
  );
};

export default MenuBar;

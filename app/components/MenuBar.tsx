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

  const menuItems = (isMobile: boolean) => (
    <>
      <Menu.Item
        as={Link}
        href="/"
        active={pathname === '/'}
        onClick={() => isMobile && setSidebarVisible(false)}
      >
        <Icon name='home' className='hidden md:inline' />
        Home
      </Menu.Item>
      {isSignedIn && (
        <Menu.Item
          as={Link}
          href="/badges"
          active={pathname === '/badges'}
          onClick={() => isMobile && setSidebarVisible(false)}
        >
          <Icon name='id card' className='hidden md:inline' />
          Badge Management
        </Menu.Item>
      )}
    </>
  );

  const authItems = (isMobile: boolean) => (
    <>
      {isSignedIn ? (
        <>
          <Menu.Item>
            <Icon name='user' className='hidden md:inline' />
            <span>Welcome, {user?.firstName || 'User'}</span>
          </Menu.Item>
          <Menu.Item>
            <Button 
              negative 
              onClick={handleSignOut}
              size='small'
              icon
              labelPosition='left'
            >
              <Icon name='sign-out' />
              Logout
            </Button>
          </Menu.Item>
        </>
      ) : (
        <Menu.Item
          as={Link}
          href="/sign-in"
          onClick={() => isMobile && setSidebarVisible(false)}
        >
          <Icon name='sign in' className='hidden md:inline' />
          Sign In
        </Menu.Item>
      )}
    </>
  );

  return (
    <>
      {/* Desktop Menu */}
      <Menu fixed="top" inverted className="desktop-menu">
        {menuItems(false)}
        <Menu.Menu position="right">
          {authItems(false)}
        </Menu.Menu>
      </Menu>

      {/* Mobile Menu */}
      <Menu fixed="top" inverted className="mobile-menu">
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
        {menuItems(true)}
        {authItems(true)}
      </Sidebar>
    </>
  );
};

export default MenuBar;

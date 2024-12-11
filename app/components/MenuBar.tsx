'use client';

import { Menu, Button } from 'semantic-ui-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useClerk, useUser } from '@clerk/nextjs';

const MenuBar = () => {
  const pathname = usePathname();
  const { signOut } = useClerk();
  const { isSignedIn, user } = useUser();

  const handleSignOut = () => {
    signOut();
  };

  return (
    <Menu fixed="top" inverted style={{ marginBottom: '2rem' }}>
      <Menu.Item
        as={Link}
        href="/"
        active={pathname === '/'}
      >
        Home
      </Menu.Item>
      {isSignedIn && (
        <Menu.Item
          as={Link}
          href="/badges"
          active={pathname === '/badges'}
        >
          Badge Management
        </Menu.Item>
      )}
      <Menu.Menu position="right">
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
          >
            Sign In
          </Menu.Item>
        )}
      </Menu.Menu>
    </Menu>
  );
};

export default MenuBar;

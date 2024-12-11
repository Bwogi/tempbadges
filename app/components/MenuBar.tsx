'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useClerk, useUser } from '@clerk/nextjs';
import { Dialog } from '@headlessui/react';
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  IdentificationIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

const MenuBar = () => {
  const pathname = usePathname();
  const { signOut } = useClerk();
  const { isSignedIn, user } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/', icon: HomeIcon },
    ...(isSignedIn ? [{ name: 'Badge Management', href: '/badges', icon: IdentificationIcon }] : []),
  ];

  const handleSignOut = () => {
    signOut();
  };

  return (
    <header className="bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="text-xl font-semibold">Badge System</span>
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                'flex items-center text-sm font-semibold leading-6',
                pathname === item.href
                  ? 'text-indigo-600'
                  : 'text-gray-900 hover:text-gray-600'
              )}
            >
              <item.icon className="h-5 w-5 mr-1.5" aria-hidden="true" />
              {item.name}
            </Link>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
          {isSignedIn ? (
            <>
              <div className="flex items-center text-sm font-semibold text-gray-900">
                <UserCircleIcon className="h-5 w-5 mr-1.5" />
                {user?.firstName || 'User'}
              </div>
              <button
                onClick={handleSignOut}
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              href="/sign-in"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign in
            </Link>
          )}
        </div>
      </nav>
      <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="text-xl font-semibold">Badge System</span>
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={clsx(
                      'flex items-center -mx-3 rounded-lg px-3 py-2 text-base font-semibold leading-7',
                      pathname === item.href
                        ? 'text-indigo-600 bg-gray-50'
                        : 'text-gray-900 hover:bg-gray-50'
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <item.icon className="h-6 w-6 mr-2" aria-hidden="true" />
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="py-6">
                {isSignedIn ? (
                  <>
                    <div className="flex items-center mb-4 text-base font-semibold text-gray-900">
                      <UserCircleIcon className="h-6 w-6 mr-2" />
                      {user?.firstName || 'User'}
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <Link
                    href="/sign-in"
                    className="w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign in
                  </Link>
                )}
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
};

export default MenuBar;

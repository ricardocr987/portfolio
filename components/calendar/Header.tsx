'use client'

import Link from 'next/link';
import { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import Button from './Button';

const routes = [
    { label: 'Home', route: '/' },
    { label: 'Book a meeting', route: '/meeting' },
    { label: 'Contact', route: '/contact' },
    { label: 'Sign in', route: '/signIn' }
]

export const Header = () => {
    const [isHeaderOpen, setIsHeaderOpen] = useState(false);

    const toggleHeader = () => {
        setIsHeaderOpen(!isHeaderOpen);
    };

    return (
        <header className="bg-blue-500 text-white p-4">
            <div className="container mx-auto flex items-center justify-between">
                <Link className="text-zinc-900 hover:text-zinc-700" href={"/"}>
                    <h3 className="text-2xl font-bold">LOGO</h3>
                </Link>
                <nav className={`md:flex space-x-4 ${isHeaderOpen ? '' : 'hidden'}`}>
                    {routes.map((route) => (
                        <Link key={route.route} className="text-zinc-900 hover:text-zinc-700" href={route.route}>
                            {route.label}
                        </Link>
                    ))}
                </nav>
                <Button
                    className="md:hidden nav-btn"
                    onClick={toggleHeader}
                >
                    {isHeaderOpen ? <FaTimes /> : <FaBars />}
                </Button>
            </div>
        </header>
    );
}
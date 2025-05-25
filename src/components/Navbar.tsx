import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Icons } from '@/components/icons';

export const Navbar = () => {
  return (
    <nav className="bg-[#2F6B4A] text-white">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <img src="/images/logo.svg" alt="EcoStep" className="w-8 h-8" />
            <span className="text-xl font-bold">EcoStep</span>
          </Link>
          
          <div className="flex items-center space-x-8">
            <Link to="/dashboard">
              <Button variant="ghost" className="text-white">
                <Icons.home className="w-5 h-5 mr-2" />
                Dashboard
              </Button>
            </Link>
            <Link to="/tracking">
              <Button variant="ghost" className="text-white bg-[#408860]">
                <Icons.track className="w-5 h-5 mr-2" />
                Track
              </Button>
            </Link>
            <Link to="/progress">
              <Button variant="ghost" className="text-white">
                <Icons.progress className="w-5 h-5 mr-2" />
                Progress
              </Button>
            </Link>
            <Link to="/achievements">
              <Button variant="ghost" className="text-white">
                <Icons.trophy className="w-5 h-5 mr-2" />
                Achievements
              </Button>
            </Link>
            <Link to="/settings">
              <Button variant="ghost" className="text-white">
                <Icons.settings className="w-5 h-5 mr-2" />
                Settings
              </Button>
            </Link>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="font-medium">sakshi</div>
              <div className="text-sm opacity-75">Level 1</div>
            </div>
            <Avatar>
              <AvatarImage src="/images/avatar.jpg" alt="User" />
              <AvatarFallback>SK</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </nav>
  );
}; 
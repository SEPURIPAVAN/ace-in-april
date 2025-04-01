
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Home, FileText, UserCog, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <nav className="bg-slate-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          Ace in April
        </Link>
        
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-1 hover:text-blue-300">
            <Home size={18} />
            <span>Home</span>
          </Link>
          
          <Link to="/submit" className="flex items-center space-x-1 hover:text-blue-300">
            <FileText size={18} />
            <span>Submit</span>
          </Link>
          
          {user.role === 'admin' && (
            <Link to="/admin" className="flex items-center space-x-1 hover:text-blue-300">
              <UserCog size={18} />
              <span>Admin</span>
            </Link>
          )}
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={logout}
            className="flex items-center space-x-1 hover:text-red-300"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

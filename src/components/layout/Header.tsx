import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { LogOut, Settings, User } from 'lucide-react';
import authService from '../../lib/auth';

const Header: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      try {
        const currentUser = await authService.auth.me();
        setUser(currentUser);
      } catch (error) {
        console.log('User not authenticated');
      }
    };
    getUser();
  }, []);

  const handleLogout = () => {
    authService.auth.logout();
  };

  const getInitials = (user: any) => {
    if (user?.displayName) {
      return user.displayName
        .split(' ')
        .map((word: string) => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 
            className="text-2xl font-bold text-blue-600 cursor-pointer"
            onClick={() => navigate('/')}
          >
            TaskSphere
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          {user && (
            <>
              <div className="hidden sm:block text-sm text-gray-600">
                <span className="font-medium">
                  {user.displayName || user.email || 'User'}
                </span>
                <div className="text-xs text-green-600">● Authenticated</div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-blue-600 text-white">
                        {getInitials(user)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.displayName || 'User'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                      <p className="text-xs text-green-600">✓ Authenticated</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem disabled>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile (Coming Soon)</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings (Coming Soon)</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
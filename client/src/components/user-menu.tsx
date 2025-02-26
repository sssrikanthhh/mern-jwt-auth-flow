import {
  Menubar,
  MenubarContent,
  MenubarMenu,
  MenubarTrigger,
  MenubarItem
} from '@/components/ui/menubar';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { signout } from '@/lib/api';
import { queryClient } from '@/config/query-client';

export default function UserMenu() {
  const navigate = useNavigate();

  const { mutate: signoutUser } = useMutation({
    mutationFn: signout,
    onSettled: () => {
      queryClient.clear();
      navigate('/signin');
    }
  });

  return (
    <Menubar className='absolute right-5 top-5 border-none'>
      <MenubarMenu>
        <MenubarTrigger>
          <Avatar>
            <AvatarImage src='https://github.com/shadcn.png' alt='@shadcn' />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem onClick={() => navigate('/')}>Profile</MenubarItem>
          <MenubarItem onClick={() => navigate('/settings')}>
            Settings
          </MenubarItem>
          <MenubarItem onClick={() => signoutUser()}>Logout</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}

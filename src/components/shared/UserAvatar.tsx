
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserRole } from '@/types';

interface UserAvatarProps {
  name: string;
  image?: string;
  role?: UserRole;
  size?: 'sm' | 'md' | 'lg';
}

const UserAvatar: React.FC<UserAvatarProps> = ({ 
  name, 
  image,
  role = 'patient',
  size = 'md'
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-16 w-16 text-lg'
  };
  
  const roleColors = {
    patient: 'bg-blue-100 text-blue-800',
    doctor: 'bg-purple-100 text-purple-800',
    intern: 'bg-green-100 text-green-800'
  };
  
  return (
    <Avatar className={sizeClasses[size]}>
      <AvatarImage src={image} alt={name} />
      <AvatarFallback className={roleColors[role]}>
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;

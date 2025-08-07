
import React, { createContext, useContext, ReactNode } from 'react';
import { useUserProfile, useUserType } from '@/hooks/useSupabaseData';

interface DataContextType {
  userProfile: any;
  userType: string | null;
  isAdmin: boolean;
  isOfficial: boolean;
  isLoading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useDataContext must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const { data: userProfile, isLoading: profileLoading, error: profileError } = useUserProfile();
  const { data: userType, isLoading: typeLoading, error: typeError } = useUserType();

  const isLoading = profileLoading || typeLoading;
  const isAdmin = userType === 'admin';
  const isOfficial = userType === 'official';

  // Log any errors
  if (profileError) console.error('Profile error:', profileError);
  if (typeError) console.error('Type error:', typeError);

  const value: DataContextType = {
    userProfile,
    userType,
    isAdmin,
    isOfficial,
    isLoading,
  };

  // Don't render children if there are critical errors
  if (profileError || typeError) {
    console.log('DataProvider rendering with errors, continuing anyway...');
  }

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

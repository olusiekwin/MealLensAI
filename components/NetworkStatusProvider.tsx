import React, { createContext, useContext, useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';

interface NetworkStatusContextProps {
  isOffline: boolean;
}

const NetworkStatusContext = createContext<NetworkStatusContextProps>({ isOffline: false });

export const NetworkStatusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOffline(!(state.isConnected && state.isInternetReachable));
    });
    // Initial check
    NetInfo.fetch().then(state => {
      setIsOffline(!(state.isConnected && state.isInternetReachable));
    });
    return unsubscribe;
  }, []);

  return (
    <NetworkStatusContext.Provider value={{ isOffline }}>
      {children}
    </NetworkStatusContext.Provider>
  );
};

export const useNetworkStatus = () => useContext(NetworkStatusContext);

import React, { useEffect, useState } from 'react';
import { Platform, View, ActivityIndicator, Text } from 'react-native';

interface StylesheetLoaderProps {
  children: React.ReactNode;
  timeout?: number;
}

export default function StylesheetLoader({ children, timeout = 15000 }: StylesheetLoaderProps) {
  const [isLoaded, setIsLoaded] = useState(Platform.OS !== 'web');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      return;
    }

    const timeoutId = setTimeout(() => {
      console.warn('Stylesheet loading timed out, continuing anyway');
      setIsLoaded(true);
    }, timeout);

    const checkStylesheets = () => {
      const sheets = document.styleSheets;
      let loaded = true;
      let totalRules = 0;
      
      for (let i = 0; i < sheets.length; i++) {
        try {
          const rules = sheets[i].cssRules;
          totalRules += rules.length;
          // Just accessing cssRules will throw if the stylesheet isn't loaded
        } catch (e) {
          // Only consider it not loaded if it's a security error (stylesheet not loaded)
          // Ignore other errors like CORS issues
          if (e.name === 'SecurityError') {
            loaded = false;
            break;
          }
        }
      }

      // Additional check to ensure we have some CSS rules loaded
      if (loaded && totalRules > 0) {
        clearTimeout(timeoutId);
        setIsLoaded(true);
      } else {
        // Use a longer interval to reduce CPU usage
        setTimeout(checkStylesheets, 100);
      }
    };

    // Start checking
    checkStylesheets();

    // Cleanup
    return () => {
      clearTimeout(timeoutId);
    };
  }, [timeout]);

  if (!isLoaded) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF'
      }}>
        <ActivityIndicator size="large" color="#000000" />
        <Text style={{
          marginTop: 10,
          fontSize: 16,
          color: '#666666'
        }}>
          Loading application...
        </Text>
      </View>
    );
  }

  return <>{children}</>;
} 
import React, { useEffect, useState } from 'react';
import { Platform, View, ActivityIndicator, Text } from 'react-native';
import FontFaceObserver from 'fontfaceobserver';

interface FontLoaderProps {
  children: React.ReactNode;
  fonts?: { family: string; weight?: string; style?: string }[];
  timeout?: number;
}

// Preload fonts using CSS for web platform
const preloadFonts = (fonts: { family: string; weight?: string; style?: string }[]) => {
  if (Platform.OS !== 'web') return;

  // Create style element if it doesn't exist
  let styleEl = document.getElementById('font-loader-style');
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'font-loader-style';
    document.head.appendChild(styleEl);
  }

  // Add @font-face rules
  const fontFaces = fonts.map(font => `
    @font-face {
      font-family: '${font.family}';
      font-weight: ${font.weight || '400'};
      font-style: ${font.style || 'normal'};
      font-display: swap;
    }
  `).join('\n');

  styleEl.textContent = fontFaces;
};

export default function FontLoader({ 
  children, 
  fonts = [], 
  timeout = 3000 // Reduced timeout to 3 seconds
}: FontLoaderProps) {
  const [fontsLoaded, setFontsLoaded] = useState(Platform.OS !== 'web');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (Platform.OS !== 'web' || fonts.length === 0) {
      setFontsLoaded(true);
      return;
    }

    // Preload fonts using CSS
    preloadFonts(fonts);

    const loadFonts = async () => {
      try {
        // Create a timeout promise
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Font loading timed out')), timeout);
        });

        const fontPromises = fonts.map(font => {
          const observer = new FontFaceObserver(
            font.family,
            {
              weight: font.weight || '400',
              style: font.style || 'normal',
            }
          );

          return observer.load(null, timeout).catch((error: Error) => {
            console.warn(`Failed to load font ${font.family} (${font.weight}):`, error.message);
            return null;
          });
        });

        // Race between font loading and timeout
        await Promise.race([
          Promise.all(fontPromises),
          timeoutPromise
        ]);
        
        setFontsLoaded(true);
      } catch (error) {
        console.warn('Font loading error:', error instanceof Error ? error.message : 'Unknown error');
        // Continue with system fonts
        setError('Using system fonts');
        setFontsLoaded(true);
      }
    };

    loadFonts();
  }, [fonts, timeout]);

  // Don't show loading indicator, just render with system fonts
  if (!fontsLoaded) {
    return children;
  }

  return (
    <>
      {error && Platform.OS === 'web' && (
        <View style={{
          position: 'absolute',
          top: 0,
          right: 0,
          padding: 4,
          backgroundColor: '#FFF3CD',
          borderColor: '#FFE69C',
          borderWidth: 1,
          zIndex: 9999,
          opacity: 0.9,
        }}>
          <Text style={{ 
            color: '#664D03',
            fontSize: 12,
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          }}>{error}</Text>
        </View>
      )}
      {children}
    </>
  );
} 
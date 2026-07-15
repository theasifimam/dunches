import { DarkTheme, DefaultTheme, ThemeProvider as NavigationProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { ThemeProvider, useAppTheme } from '@/context/ThemeContext';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

function RootLayoutContent() {
  const { theme, isDark } = useAppTheme();

  return (
    <NavigationProvider value={isDark ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="signin" options={{ presentation: 'modal', title: 'Sign In', headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal', headerShown: false }} />
        <Stack.Screen name="food-detail" options={{ presentation: 'modal', title: 'Food Detail', headerShown: false }} />
      </Stack>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </NavigationProvider>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <ThemeProvider>
          <BottomSheetModalProvider>
            <RootLayoutContent />
          </BottomSheetModalProvider>
        </ThemeProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}

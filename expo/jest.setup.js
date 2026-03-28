import 'react-native-gesture-handler/jestSetup';

// Mock expo-router
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  },
  useLocalSearchParams: jest.fn(() => ({})),
  Stack: {
    Screen: jest.fn(),
  },
  Tabs: {
    Screen: jest.fn(),
  },
}));

// Mock expo modules
jest.mock('expo-splash-screen', () => ({
  preventAutoHideAsync: jest.fn(),
  hideAsync: jest.fn(),
}));

jest.mock('expo-status-bar', () => ({
  StatusBar: jest.fn(() => null),
}));

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: jest.fn(({ children }) => children),
}));

jest.mock('expo-image', () => ({
  Image: jest.fn(() => null),
}));

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: jest.fn(({ children }) => children),
  SafeAreaProvider: jest.fn(({ children }) => children),
  useSafeAreaInsets: jest.fn(() => ({ top: 0, bottom: 0, left: 0, right: 0 })),
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Mock lucide-react-native
jest.mock('lucide-react-native', () => ({
  Plus: jest.fn(() => null),
  Home: jest.fn(() => null),
  Heart: jest.fn(() => null),
  Clock: jest.fn(() => null),
  Settings: jest.fn(() => null),
  ArrowLeft: jest.fn(() => null),
  Send: jest.fn(() => null),
  Play: jest.fn(() => null),
  Share: jest.fn(() => null),
  User: jest.fn(() => null),
  Crown: jest.fn(() => null),
  HelpCircle: jest.fn(() => null),
  MessageCircle: jest.fn(() => null),
  LogOut: jest.fn(() => null),
  ChevronRight: jest.fn(() => null),
  Lock: jest.fn(() => null),
  Bell: jest.fn(() => null),
  X: jest.fn(() => null),
  FileText: jest.fn(() => null),
  Palette: jest.fn(() => null),
}));

// Mock react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => ({
  GestureHandlerRootView: jest.fn(({ children }) => children),
  PanGestureHandler: jest.fn(({ children }) => children),
  State: {
    END: 'END',
  },
}));

// Silence the warning: Animated: `useNativeDriver` is not supported
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
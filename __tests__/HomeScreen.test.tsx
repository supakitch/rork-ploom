import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { router } from 'expo-router';
import HomeScreen from '@/app/(tabs)/index';

// Mock the hooks
jest.mock('@/hooks/useStories', () => ({
  useStories: jest.fn(() => ({
    stories: [],
    toggleFavorite: jest.fn(),
    refreshStories: jest.fn(),
    isLoading: false,
  })),
}));

jest.mock('@/hooks/useAuth', () => ({
  useAuth: jest.fn(() => ({
    user: {
      fullName: 'John Doe',
    },
  })),
}));

// Mock console.log to track calls
const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    consoleSpy.mockClear();
  });

  afterAll(() => {
    consoleSpy.mockRestore();
  });

  it('renders correctly', () => {
    const { getByText } = render(<HomeScreen />);
    
    expect(getByText('Hello, John!')).toBeTruthy();
    expect(getByText('What story shall we create today?')).toBeTruthy();
    expect(getByText('Your Stories')).toBeTruthy();
  });

  it('shows empty state when no stories exist', () => {
    const { getByText } = render(<HomeScreen />);
    
    expect(getByText('No stories yet')).toBeTruthy();
    expect(getByText('Tap the + button to create your first magical story!')).toBeTruthy();
  });

  it('renders add story button with correct accessibility', () => {
    const { getByTestId, getByLabelText } = render(<HomeScreen />);
    
    const addButton = getByTestId('add-story-button');
    expect(addButton).toBeTruthy();
    
    const accessibleButton = getByLabelText('Create new story');
    expect(accessibleButton).toBeTruthy();
  });

  it('logs message and navigates when add story button is pressed', async () => {
    const { getByTestId } = render(<HomeScreen />);
    
    const addButton = getByTestId('add-story-button');
    fireEvent.press(addButton);

    // Check that console.log was called
    expect(consoleSpy).toHaveBeenCalledWith('Add Story pressed');
    
    // Check that navigation was triggered
    await waitFor(() => {
      expect(router.push).toHaveBeenCalledWith('/story-creation');
    });
  });

  it('calls router.push with correct route on button press', () => {
    const { getByTestId } = render(<HomeScreen />);
    
    const addButton = getByTestId('add-story-button');
    fireEvent.press(addButton);

    expect(router.push).toHaveBeenCalledTimes(1);
    expect(router.push).toHaveBeenCalledWith('/story-creation');
  });
});
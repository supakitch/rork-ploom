import { by, device, element, expect as detoxExpect } from 'detox';

describe('HomeScreen E2E', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should display home screen correctly', async () => {
    await detoxExpect(element(by.text('Hello, Storyteller!'))).toBeVisible();
    await detoxExpect(element(by.text('What story shall we create today?'))).toBeVisible();
    await detoxExpect(element(by.text('Your Stories'))).toBeVisible();
  });

  it('should navigate to story creation when add button is tapped', async () => {
    // Tap the floating action button
    await element(by.id('add-story-button')).tap();
    
    // Verify navigation to story creation screen
    await detoxExpect(element(by.text('Create Your Story'))).toBeVisible();
  });

  it('should show empty state when no stories exist', async () => {
    await detoxExpect(element(by.text('No stories yet'))).toBeVisible();
    await detoxExpect(element(by.text('Tap the + button to create your first magical story!'))).toBeVisible();
  });

  it('should allow pull to refresh', async () => {
    // Perform pull to refresh gesture
    await element(by.id('stories-scroll-view')).swipe('down', 'slow', 0.8);
    
    // The refresh should complete without errors
    await detoxExpect(element(by.text('Your Stories'))).toBeVisible();
  });
});
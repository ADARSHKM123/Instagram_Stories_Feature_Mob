import React from 'react';
import { render, fireEvent, act, waitFor } from '@testing-library/react-native';
import App from './App';

jest.mock('./stories.json', () => ({
  stories: [
    { id: 1, uri: 'test-uri-1' },
    { id: 2, uri: 'test-uri-2' },
  ],
}));

describe('App', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders story list', async () => {
    const { findAllByTestId } = render(<App />);
    
    await waitFor(async () => {
      const stories = await findAllByTestId(/story-thumbnail-/);
      expect(stories.length).toBe(2);
    }, { timeout: 5000 });
  });

  it('opens story viewer on thumbnail press', async () => {
    const { getByTestId, findByTestId } = render(<App />);
    
    // Wait for stories to load
    await waitFor(() => getByTestId('story-thumbnail-0'));
    
    await act(async () => {
      fireEvent.press(getByTestId('story-thumbnail-0'));
      jest.advanceTimersByTime(1000); // Advance timers for animations
    });

    await waitFor(() => {
      expect(findByTestId('story-viewer')).toBeTruthy();
    }, { timeout: 5000 });
  });
});
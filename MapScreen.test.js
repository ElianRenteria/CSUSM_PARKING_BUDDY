import React from 'react';
import renderer from 'react-test-renderer';

import MapScreen from './screens/MapScreen';

import { render, fireEvent } from '@testing-library/react-native';


describe('MapScreen', () => {
  test('renders correctly', () => {
    const { getByText } = render(<MapScreen />);
    
    // Adjust these assertions based on your component's content
    expect(getByText('Listview')).toBeTruthy();
    expect(getByText('Park')).toBeTruthy();
  });

  test('clicking on "Park" button triggers alert', () => {
    const { getByText } = render(<MapScreen />);
    
    fireEvent.press(getByText('Park'));
    
    // Adjust this assertion based on your component's behavior
    expect(getByText('Are you sure you want to park here?')).toBeTruthy();
  });

  // Add more tests based on your component's behavior
});

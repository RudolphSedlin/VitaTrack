import { renderRouter, screen } from 'expo-router/testing-library';
import { View } from 'react-native';
import Index from '..';
import QueryModel from '@/components/QueryModel';

jest.mock('@fortawesome/react-native-fontawesome', () => ({
    FontAwesomeIcon: ''
}))

it('router has index', async () => {
  const MockComponent = jest.fn(() => <View />);

  renderRouter(
    {
      index: jest.fn(() => <Index />),
      '/camerascreen': jest.fn(() => <QueryModel />),
    },
    {
      initialUrl: '/',
    }
  );

  expect(screen).toHavePathname('/');
});

it('router is on camera', async () => {
    const MockComponent = jest.fn(() => <View />);
  
    renderRouter(
      {
        index: jest.fn(() => <Index />),
        '/camerascreen': jest.fn(() => <QueryModel />),
      },
      {
        initialUrl: '/camerascreen',
      }
    );
    
    expect(screen).toHavePathname('/camerascreen');
  });

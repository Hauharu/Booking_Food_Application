import 'react-native-gesture-handler';
import React from 'react'
import { ThemeManager, Colors } from 'react-native-ui-lib';
import Navigation from './src/navigation/Navigation';
import { legacy_createStore as createStore } from 'redux';
import { Provider } from 'react-redux';
import reducer from './src/store/reducer'

Colors.loadColors({
  primary: '#0A8791',
  yellow: '#FBA83C',
  green: '#24C869',
  grey: '#C2C2CB',
  black: '#0E122B',
});

const buttonTheme = {
  backgroundColor: Colors.primary,
  borderRadius: 10,
  height: 50,
  labelStyle: {
    fontWeight: 'bold',
    color: 'white',
  },
};
ThemeManager.setComponentTheme('Button', buttonTheme);

const store = createStore(reducer)

export default function App() {
  return (
    <Provider store={store}>
      <Navigation />
    </Provider>
  );
}
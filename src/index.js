import 'babel-polyfill'

import React from 'react';
import { render } from 'react-dom';
import './styles/GroceryListApp.css'
import Root from './containers/Root';

render(
  <Root />,
   document.getElementById('root')
);

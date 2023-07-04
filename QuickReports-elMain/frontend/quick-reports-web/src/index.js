import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import LoginView from './pages/loginView'
import reportWebVitals from './reportWebVitals';
import {createBrowserHistory} from 'history'
import {Router} from 'react-router-dom'
import { createMuiTheme, ThemeProvider} from '@material-ui/core/styles'
import black from '@material-ui/core/styles/'

const history = createBrowserHistory()

const theme = createMuiTheme({
  palette: {
    primary: {
      main:'#000000',
    },
    secondary:{
      main:'#6EC1E4',
    }
  },
})

ReactDOM.render(
    <ThemeProvider theme={theme}>
      <Router history = {history}>
        <App history={history} />
      </Router>
    </ThemeProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import Search from './components/Search/Search';

class App extends Component {
  state = {};

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Search />

          <Switch>
            <Route exact path="/" component={Search} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;

import React, { Component } from 'react';
import './App.css';
import Search from './components/Search';

class App extends Component {
  state = {
    geolocationCoords: '',
  }

  componentDidMount() {
    if (navigator.geolocation) {
      const watcher = navigator.geolocation.getCurrentPosition(this.displayLocationInfo, this.handleLocationError);
    }
  }

  displayLocationInfo = (position) => {
    const lng = position.coords.longitude;
    const lat = position.coords.latitude;

    this.setState({
      geolocationCoords: [lng, lat],
    })
  }

  handleLocationError = (error) => {
    if (error.code) {
      this.setState({
        geolocationCoords: '',
        geoErrorMessage: error.message
      })
    }
  }

  render() {
    if (this.state.geolocationCoords) {
      return (
        <div className="App">
          <Search coords={this.state.geolocationCoords} />
        </div>
      );
    } else {
      return <p>has not geo</p>
    }
  }
}

export default App;

import React from 'react';

class Search extends React.Component {
  state = {
    geolocationCoords: {},
    city: '',
  }

  getGeolocation = () => {
    if (navigator.geolocation) {
      const watcher = navigator.geolocation.getCurrentPosition(this.displayLocationInfo, this.handleLocationError);
    }
  }

  displayLocationInfo = (position) => {
    const lng = position.coords.longitude;
    const lat = position.coords.latitude;

    this.setState({
      geolocationCoords: {
        longitude: lng,
        latitude: lat,
      },
    })
  }

  handleLocationError = (error) => {
    if (error.code) {
      this.setState({
        geolocationCoords: {},
        geoErrorMessage: error.message
      })
    }
  }

  handleCityChange = (e) => {
    this.setState({
      city: e.target.value,
    })

    const APIkey = '';




  }

  handleFormSubmit = e => {
    fetch(`https://developers.zomato.com/api/v2.1/cities?user-key=0c5fa99210a162d7e2e0c83f51d8c61a?q=krakow`).then(data => data.json()).then(res => console.log(res)).catch(err => {
      console.log(err)
    });
  }


  render() {
    return (
      <div>
        {JSON.stringify(this.state, null, 0)}
        <div className="search">
          <button onClick={this.getGeolocation}>Get coords</button>
          <input
            type="text"
            value={this.state.city}
            onChange={this.handleCityChange}
          />
        </div>

      </div>
    )
  }
}

export default Search;
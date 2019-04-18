import React from 'react';

class Search extends React.Component {
  state = {

  }

  componentDidMount() {
    this.setState({
      coords: {
        longitude: this.props.coords[0],
        latitude: this.props.coords[1],
      }
    })
  }

  render() {
    return (
      <div>
        safas
      </div>
    )
  }
}

export default Search;
import React, { Component } from "react";

class PokeMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      googleMapRef: React.createRef(),
    };
    this.createGoogleMap = this.createGoogleMap.bind(this);
    this.createMarker = this.createMarker.bind(this);
  }

  componentDidMount() {
    let latLng = new google.maps.LatLng(32.7157, -117.1611)
    let googleMap = new window.google.maps.Map(this.state.googleMapRef.current, {
      zoom: 12,
      center: latLng,
      disableDefaultUI: true,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [
            { visibility: 'off' }
          ]
        }
      ] 
    })
    let latlngbounds = new google.maps.LatLngBounds();
    this.props.locations.map((coordinates) => { 
      let split = coordinates.split(",");
      let markerLatLng = new google.maps.LatLng(parseFloat(split[0]), parseFloat(split[1]))
      latlngbounds.extend(markerLatLng);
      let marker = new window.google.maps.Marker({
        position: markerLatLng,
        map: googleMap,
        title: "test marker!",
        visible: true
      })
      marker.setMap(googleMap);
    })
    if (this.props.locations.length) {
      googleMap.fitBounds(latlngbounds);
    }

  }

  createGoogleMap()
  {
    
    }
    

  createMarker(latLng) {
    
  }

  render() {

    return (
      <div className="location-map">
        <div id="google-map"
        ref={this.state.googleMapRef}
        style={{ width: '100%', height: '100%' }}>
        </div>
      </div>
    );
  }
}

export default PokeMap;

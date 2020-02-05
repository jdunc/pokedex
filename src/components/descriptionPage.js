import React, { Component } from "react";
import PokeMap from './map';

class Description extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
  }

  render() {
    const { id } = this.props.match.params;
    if (parseInt(id) < 1 || parseInt(id) > 151) {
      window.location = "/"
    }
    const index = parseInt(id) - 1;
    const pokemon = this.props.pokemon[index];
    if (!pokemon) {
      return(<div>loader...</div>)
    }
    return (
      <div className="description-page">
        <div className="information">
          <div className="image">
            <img src={pokemon.info ? pokemon.info.sprites.front_default : ""} />
            {pokemon.name}
          </div>
          <div className={"details"}>
            <div>
              Height: {pokemon.info.height}
            </div>
            <div>
              Weight: {pokemon.info.weight}
            </div>
            <div>
              In Bag: {pokemon.inBag || "no"}
            </div>
            <div>
              Type: {pokemon.info.types.map(type => { return <span><a>{type.type.name}</a> </span>})}
            </div>
            <div>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </div>
          </div>
        </div>
        <div className="map">
          <PokeMap locations={pokemon.info.locations}/>
        </div>
      </div>
    );
  }
}

export default Description;

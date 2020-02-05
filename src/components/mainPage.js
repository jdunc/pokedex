import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import MainPageAvatar from "./mainPageAvatar";
class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pokemonSearch: ""
    };
  }

  componentDidMount() {}

  render() {
    var patt = new RegExp(this.state.pokemonSearch);
    return (
      <div>
        <div className="text-input-container">
          <input
            style={{ width: "50%", height: 30 }}
            placeholder={"Search for a Pokemon"}
            val={this.state.pokemonSearch}
            onChange={e => {
              this.setState({ pokemonSearch: e.target.value });
            }}
          />
        </div>
        <div className="main-page-pokemon">
          {this.props.pokemon.map((pokemon, index) => {
            if (!this.state.pokemonSearch.length || patt.test(pokemon.name)) {
              return (
                <MainPageAvatar
                  id={index}
                  image={pokemon.info ? pokemon.info.sprites.front_default : ""}
                  name={pokemon.name}
                />
              );
            }
            return "";
          })}
        </div>
      </div>
    );
  }
}

export default MainPage;

import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import MainPageAvatar from "./mainPageAvatar";
class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pokemonSearch: "",
      selected: "all"
    };
    this.updatedPokemonSelection = this.updatedPokemonSelection.bind(this);
  }

  updatedPokemonSelection(e) {
    this.setState({
      selected: e.target.className
    });
  }

  componentDidMount() {}

  render() {
    let patt = new RegExp(this.state.pokemonSearch);
    let pokemonToRender =
      this.state.selected === "all" ? this.props.pokemon : this.props.myPokemon;
    return (
      <div>
        <div
          onClick={this.updatedPokemonSelection}
          className={`toggle-my-pokemon selected-${this.state.selected}`}
        >
          <div className="shadow">
            <div className={`all`}>All</div>
            <div className={`bag`}>Bag</div>
          </div>
        </div>
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
          {pokemonToRender.map((pokemon, index) => {
            let hidden = "hidden";
            if (!this.state.pokemonSearch.length || patt.test(pokemon.name)) {
              hidden = "";
            }
            return (
              <MainPageAvatar
                hidden={hidden}
                id={index}
                image={pokemon.info ? pokemon.info.sprites.front_default : ""}
                name={pokemon.name}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

export default MainPage;

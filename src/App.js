import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import MainPage from "./components/mainPage";
import "./styles/app.scss";
import Description from "./components/descriptionPage";
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      pokemon: []
    };
    this.loadLocalStorage = this.loadLocalStorage.bind(this);
    this.saveLocalStorage = this.saveLocalStorage.bind(this);
    this.addStatsToPokemon = this.addStatsToPokemon.bind(this);
  }

  componentDidMount() {
    this.loadLocalStorage();
  }

  saveLocalStorage() {
    window.localStorage.setItem("pokemon", JSON.stringify(this.state.pokemon));
    window.localStorage.setItem(
      "myPokemon",
      JSON.stringify(this.state.myPokemon)
    );
  }

  loadLocalStorage() {
    let localPokemon = window.localStorage.getItem("pokemon");
    let myLocalPokemon = window.localStorage.getItem("myPokemon");
    let pokemon = localPokemon ? JSON.parse(localPokemon) : [];
    let myPokemon = myLocalPokemon ? JSON.parse(myLocalPokemon) : [];
    console.log("pokemon:", pokemon);
    this.setState({
      pokemon,
      myPokemon
    });
    if (!pokemon.length) {
      fetch("https://pokeapi.co/api/v2/pokemon/?limit=151")
        .then(res => res.json())
        .then(
          result => {
            if (result.results && result.results.length) {
              this.setState({
                isLoaded: true,
                pokemon: result.results
              });
              this.saveLocalStorage();
              this.addStatsToPokemon(0, result.results);
            }
          },
          error => {
            this.setState({
              isLoaded: true,
              error
            });
          }
        );
    } else {
      this.addStatsToPokemon(0, pokemon);
    }
  }

  async addStatsToPokemon(startingIndex, pokemon) {
    let failedIndex = null;
    for (let i = startingIndex; i < pokemon.length; i++) {
      if (!pokemon[i].info) {
        let response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${i + 1}`
        );
        if (!response.ok) {
          failedIndex = i;
          break;
        }
        let json = await response.json();
        pokemon[i].info = json;
      }
    }
    this.setState({ pokemon });
    this.saveLocalStorage();
    console.log("failedIndex", failedIndex);
    if (failedIndex) {
      setTimeout(() => {
        this.addStatsToPokemon(failedIndex);
      }, 1005);
    }
  }

  render() {
    return (
      <Router>
        <Switch>
          <Route path="/detail/:id">
            <Description
              pokemon={this.state.pokemon}
              myPokemon={this.state.myPokemon}
            />
          </Route>
          <Route path="/">
            <MainPage
              pokemon={this.state.pokemon}
              myPokemon={this.state.myPokemon}
            />
          </Route>
        </Switch>
      </Router>
    );
  }
}

export default App;

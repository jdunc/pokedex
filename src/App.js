import React, { Component } from "react";
import { HashRouter as Router, Switch, Route, Link } from "react-router-dom";
import MainPage from "./components/mainPage";
import "./styles/app.scss";
import Description from "./components/descriptionPage";
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      loading: true,
      pokemon: []
    };
    this.loadLocalStorage = this.loadLocalStorage.bind(this);
    this.saveLocalStorage = this.saveLocalStorage.bind(this);
    this.addStatsToPokemon = this.addStatsToPokemon.bind(this);
    this.toggleBagPokemon = this.toggleBagPokemon.bind(this);
  }

  componentDidMount() {
    this.loadLocalStorage();
  }

  componentWillUnmount() {
    this.saveLocalStorage();
  }

  saveLocalStorage() {
    let { pokemon, myPokemon } = this.state;
    if (pokemon && pokemon.length) {
      window.localStorage.setItem(
        "pokemon",
        JSON.stringify(this.state.pokemon)
      );
    }
    if (myPokemon && myPokemon.length) {
      window.localStorage.setItem(
        "myPokemon",
        JSON.stringify(this.state.myPokemon)
      );
    }
  }

  loadLocalStorage() {
    let localPokemon = window.localStorage.getItem("pokemon");
    let myLocalPokemon = window.localStorage.getItem("myPokemon");
    let pokemon =
      localPokemon && typeof localPokemon !== "undefined"
        ? JSON.parse(localPokemon)
        : [];
    let myPokemon =
      myLocalPokemon && typeof myLocalPokemon !== "undefined"
        ? JSON.parse(myLocalPokemon)
        : [];
    this.setState({
      pokemon,
      myPokemon
    });
    if (!pokemon || pokemon.length !== 151) {
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
      // check to make sure we have all the stats for every pokemon
      this.addStatsToPokemon(0, pokemon);
    }
  }

  async addStatsToPokemon(startingIndex, pokemon) {
    let failedIndex = null;
    let needsUpdated = [];
    let endIndex = startingIndex + 80 > 151 ? 151 : startingIndex + 80;
    for (let i = startingIndex; i < endIndex; i++) {
      if (!pokemon[i].info) {
        needsUpdated.push(i);
      }
    }
    let results = await Promise.all(
      needsUpdated.map(async pokemonIndex => {
        let response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${pokemonIndex + 1}`
        );
        let locationsRequest = await fetch(
          `https://api.craft-demo.net/pokemon/${pokemonIndex + 1}`,
          {
            headers: new Headers({
              "x-api-key": "HHko9Fuxf293b3w56zAJ89s3IcO9D5enaEPIg86l"
            })
          }
        );
        let locations = await locationsRequest.json();
        locations = locations.locations;
        let json = await response.json();
        let { height, weight, types, moves, sprites, abilities } = json;
        // filter out the version_group_details of the move
        moves = moves.map(move => {
          return move.move;
        });
        return {
          index: pokemonIndex,
          height,
          weight,
          types,
          moves,
          sprites,
          abilities,
          locations
        };
      })
    );
    results.forEach(result => {
      pokemon[result.index].info = result;
    });
    this.setState({ pokemon });
    this.saveLocalStorage();
    if (endIndex < 151) {
      setTimeout(() => {
        this.addStatsToPokemon(endIndex, pokemon);
      }, 1005);
    } else {
      this.setState({ loading: false });
    }
  }

  // async addStatsToPokemon(startingIndex, pokemon) {
  //   let failedIndex = null;
  //   let needsUpdated = [];
  //   let endIndex = startingIndex + 80 > 151 ? 151 : startingIndex + 80;
  //   for (let i = startingIndex; i < pokemon.length; i++) {
  //     if (!pokemon[i].info) {
  //       needsUpdated.push(i);
  //       let response = await fetch(
  //         `https://pokeapi.co/api/v2/pokemon/${i + 1}`
  //       );
  //       if (!response.ok) {
  //         failedIndex = i;
  //         break;
  //       }
  //       let locationsRequest = await fetch(
  //         `https://api.craft-demo.net/pokemon/${i + 1}`,
  //         {
  //           headers: new Headers({
  //             "x-api-key": "HHko9Fuxf293b3w56zAJ89s3IcO9D5enaEPIg86l"
  //           })
  //         }
  //       );
  //       let locations = await locationsRequest.json();
  //       locations = locations.locations;

  //       let json = await response.json();
  //       let { height, weight, types, moves, sprites, abilities } = json;
  //       // filter out the version_group_details of the move
  //       moves = moves.map(move => {
  //         return move.move;
  //       });
  //       pokemon[i].info = {
  //         height,
  //         weight,
  //         types,
  //         moves,
  //         sprites,
  //         abilities,
  //         locations
  //       };
  //     }
  //   }
  //   this.setState({ pokemon });
  //   this.saveLocalStorage();
  //   if (failedIndex) {
  //     setTimeout(() => {
  //       this.addStatsToPokemon(failedIndex);
  //     }, 1005);
  //   } else {
  //     this.setState({ loading: false });
  //   }
  // }

  toggleBagPokemon(index, bagged) {
    let { pokemon, myPokemon } = this.state;
    pokemon[index].inBag = bagged;
    if (bagged) {
      myPokemon.push(pokemon[index]);
    } else {
      let sliceIndex = myPokemon.findIndex(thisPokemon => {
        return thisPokemon.name === pokemon[index].name;
      });
      myPokemon.splice(sliceIndex, 1);
    }
    this.setState({ pokemon, myPokemon });
    this.saveLocalStorage();
  }

  render() {
    const { loading } = this.state;
    return (
      <Router>
        <Switch>
          <Route
            path="/detail/:id"
            render={props => (
              <Description
                {...props}
                pokemon={this.state.pokemon}
                myPokemon={this.state.myPokemon}
                loading={loading}
                toggle={this.toggleBagPokemon}
              />
            )}
          />
          <Route path="/">
            <MainPage
              pokemon={this.state.pokemon}
              myPokemon={this.state.myPokemon}
              loading={loading}
            />
          </Route>
        </Switch>
      </Router>
    );
  }
}

export default App;

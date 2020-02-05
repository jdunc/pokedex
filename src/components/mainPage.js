import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import MainPageAvatar from "./mainPageAvatar";
class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    return (
      <div>
        <div className="main-page-pokemon">
          {this.props.pokemon.map((pokemon, index) => {
            return (
              <MainPageAvatar
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

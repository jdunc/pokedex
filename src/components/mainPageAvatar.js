import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

class MainPageAvatar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    return (
      <Link to={`/${this.props.id}`} className="avatar-container">
        <div className="avatar-image">
          <img src={this.props.image} />
        </div>
        <p>{this.props.name}</p>
      </Link>
    );
  }
}

export default MainPageAvatar;

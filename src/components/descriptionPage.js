import React, { Component } from "react";

class Description extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    console.log('this.props:', this.props)
  }

  render() {
    console.log('this.props:', this.props)
    return (
      <div className="description-page">
        here is the description page
      </div>
    );
  }
}

export default Description;

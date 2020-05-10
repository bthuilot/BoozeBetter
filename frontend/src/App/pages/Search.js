import React, { Component } from "react";

class Search extends Component {
  // Initialize the state
  constructor(props) {
    super(props);
    this.state = {
      recipes: [],
      page: 1,
    };
  }

  // Fetch the list on first mount
  componentDidMount() {
    this.getList();
  }

  // Retrieves the list of items from the Express app
  getList = () => {
    fetch("/api/recipes/search")
      .then((res) => res.json())
      .then((response) => this.setState({ response }));
  };

  render() {
    const { recipes } = this.state;

    return (
      <div className="App">
        <h1>List of Items</h1>
        {/* Check to see if any items are found*/}
        {recipes.length ? (
          <div>
            {/* Render the list of items */}
            {recipes}
          </div>
        ) : (
          <div>
            <h2>Server didn't respond</h2>
          </div>
        )}
      </div>
    );
  }
}

export default Search;

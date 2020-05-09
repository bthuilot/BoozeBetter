import React, { Component } from 'react';

class List extends Component {
  // Initialize the state
  constructor(props){
    super(props);
    this.state = {
      response: ""
    }
  }

  // Fetch the list on first mount
  componentDidMount() {
    this.getList();
  }

  // Retrieves the list of items from the Express app
  getList = () => {
    fetch('/login')
    .then(res => res.json())
    .then(response => this.setState({ response }))
  }

  render() {
    const { response } = this.state;

    return (
      <div className="App">
        <h1>List of Items</h1>
        {/* Check to see if any items are found*/}
        {response.length ? (
          <div>
            {/* Render the list of items */}
            {response}
          </div>
        ) : (
          <div>
            <h2>Server didn't respond</h2>
          </div>
        )
      }
      </div>
    );
  }
}

export default List;
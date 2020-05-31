import React, { Component } from "react";
import {
  Alert,
  Row,
  Col,
  InputGroup,
  FormControl,
  Button,
} from "react-bootstrap";

import "./SearchBar.css";

class SearchBar extends Component {
  constructor() {
    super();
    this.state = {
      tags: [],
      alert: null,
    };
  }

  showAlert = (text) => {
    this.setState({ alert: text });
  };

  containsCaseInsentive(arr, value) {
    return arr.some((item) => item.toUpperCase() === value.toUpperCase());
  }

  keyPressed = (event) => {
    if (event.key == "Enter") {
      const value = event.target.value.trim().replace(/\s+/g, " ");
      event.target.value = "";
      if (this.containsCaseInsentive(this.state.tags, value)) {
        this.showAlert("This item has already been added");
      } else {
        this.setState({ tags: this.state.tags.concat(value) });
      }
    }
  };

  getSearchQuery = () => {
    return this.state.tags.map((item) => encodeURIComponent(item)).join("+");
  };

  removeTag = (index) => {
    let newTags = this.state.tags.filter((val, i) => i !== index);
    this.setState({ tags: newTags });
  };

  render() {
    return (
      <Col>
        <Row>
          <Col className="align-item-center justify-content-center text-center">
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Start writing some items"
                aria-label="Start writing some items"
                aria-describedby="basic-addon2"
                onKeyPress={this.keyPressed}
              />
              <InputGroup.Append>
                <Button
                  variant="outline-secondary"
                  href={"/search?q=" + this.getSearchQuery()}
                >
                  <span role="img" aria-label="sheep">
                    🔎
                  </span>
                </Button>
              </InputGroup.Append>
            </InputGroup>
            <p>
              <small>Psstt... Press enter to separate terms</small>
            </p>
          </Col>
        </Row>
        <Row>
          <Col>
            {this.state.alert && (
              <Alert
                variant="warning"
                dismissible
                onClose={() => {
                  this.showAlert(null);
                }}
              >
                {this.state.alert}
              </Alert>
            )}
          </Col>
        </Row>
        <div className="container horizontal-scrollable">
          <Row className="justify-content-left">
            {this.state.tags.map((tag, index) => {
              return (
                <Col key={index} xs={6} md={2}>
                  <Alert
                    variant="dark"
                    dismissible
                    onClose={() => {
                      this.removeTag(index);
                    }}
                  >
                    {tag}
                  </Alert>
                </Col>
              );
            })}
          </Row>
        </div>
      </Col>
    );
  }
}
export default SearchBar;

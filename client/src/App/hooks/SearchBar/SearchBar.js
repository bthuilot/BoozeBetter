import React, { useState } from 'react';
import { Alert, Row, Col, InputGroup, FormControl, Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

import './SearchBar.css';

function containsCaseInsentive(arr, value) {
  return arr.some((item) => item.toUpperCase() === value.toUpperCase());
}

function onChange(event, tags, setTags, setCurrentSearch) {
  const val = event.target.value;
  const lastChar = val.length > 1 ? val.substr(val.length - 1, val.length) : '';
  if (lastChar === ',') {
    setCurrentSearch('');
    event.target.value = '';
    return addNewItem(val, tags, setTags);
  }
  if (lastChar.match(/[a-z\S]*/) === null) {
    event.target.value = val.substr(0, val.length - 1);
    return 'Please use characters A-Z or Space only';
  }
  setCurrentSearch(event.target.value);
  return null;
}

function resetPage(setTerms, setCurrentSearch, setAlert, history) {
  setTerms([]);
  setAlert({
    show: false,
    text: '',
  });
  setCurrentSearch('');
}

function addNewItem(val, tags, setTags) {
  const value = val.slice(0, -1).trim().replace(/\s+/g, ' ');
  if (containsCaseInsentive(tags, value)) {
    return 'That item has already been added';
  }
  setTags(tags.concat(value));
  return null;
}

function getSearchQuery(tags, currentSearch) {
  tags.push(currentSearch);
  return tags.map((item) => encodeURIComponent(item)).join(',');
}

function removeTag(index, tags, setTags) {
  const newTags = tags.filter((val, i) => i !== index);
  setTags(newTags);
}

function renderAlert(alert, setAlert) {
  if (alert.show) {
    return (
      <Alert
        variant="warning"
        dismissible
        onClose={() => {
          setAlert({ show: false });
        }}
      >
        {alert.text}
      </Alert>
    );
  }
  return <></>;
}

export function SearchBar(props) {
  const history = useHistory();
  const [currentSearch, setCurrentSearch] = useState('');
  const [tags, setTags] = useState([]);
  const [alert, setAlert] = useState({
    show: false,
    text: '',
  });
  const { whiteText } = props;


  return (
    <Col>
      <Row>
        <Col className="align-item-center justify-content-center text-center">
          <InputGroup className="mb-3">
            <FormControl
              placeholder="Start writing some items"
              aria-label="Start writing some items"
              aria-describedby="basic-addon2"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  history.push(`/search?q=${getSearchQuery(tags, currentSearch)}`)
                  resetPage(setTags, setCurrentSearch, setAlert);
                }
              }}
              onChange={(e) => {
                const error = onChange(e, tags, setTags, setCurrentSearch);
                if (error != null) {
                  setAlert({
                    text: error,
                    show: true,
                  });
                }
              }}
            />
            <InputGroup.Append>
              <Button variant="outline-secondary" onClick={() => {
                  history.push(`/search?q=${getSearchQuery(tags, currentSearch)}`)
                  resetPage(setTags, setCurrentSearch, setAlert);
              }}>
                <span role="img" aria-label="search">
                  🔎
                </span>
              </Button>
            </InputGroup.Append>
          </InputGroup>
          <p>
            <small className={whiteText && 'text-white'}>
              Psstt... use commas to separate terms
            </small>
          </p>
        </Col>
      </Row>
      <Row>
        <Col>{renderAlert(alert, setAlert)}</Col>
      </Row>
      <div className="container horizontal-scrollable">
        <Row className="justify-content-left">
          {tags.map((tag, index) => {
            return (
              <Col key={index} xs={6} md={2}>
                <Alert
                  className="alert-orange"
                  dismissible
                  onClose={() => {
                    removeTag(index, tags, setTags);
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

import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { Alert, Row, Col } from 'react-bootstrap';

export function Sidebar(props) {
  const [tags, setTags] = useState([...props.tags]);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    setReload(false);
    setTags([...props.tags]);
  }, [props.tags, reload]);

  if (reload) {
    return (
      <Redirect push to={`/search?q=${tags.map((item) => encodeURIComponent(item)).join(',')}`} />
    );
  }

  return (
    <div className="p-3 bg-light text-center h-100">
      <h5 className="">Tags</h5>
      <div className="nav flex-column">
        <Row>
          {tags.map((tag, index) => {
            return (
              <Col xs={6} className="" key={index}>
                <Alert
                  className="alert-orange"
                  dismissible
                  onClose={() => {
                    setTags(
                      tags.filter((_, i) => {
                        return index !== i;
                      })
                    );
                    setReload(true);
                  }}
                >
                  {tag}
                </Alert>
              </Col>
            );
          })}
        </Row>
      </div>
    </div>
  );
}

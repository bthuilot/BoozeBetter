import React from "react";
import { render } from "@testing-library/react";
import App from "./App/App";

test("renders learn react link", () => {
  const linkElement = getByText(/Cocktail Finder/i);
  expect(linkElement).toBeInTheDocument();
});

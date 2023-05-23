import React from "react";
import { render, cleanup } from "@testing-library/react";
import App from "../api-integration/App";

describe("App component", () => {
    afterEach(cleanup);

    it("renders without crashing", () => {
        const { container } = render(<App />);
        expect(container).toBeInTheDocument();
    });

    // Add more tests here for your App component
});
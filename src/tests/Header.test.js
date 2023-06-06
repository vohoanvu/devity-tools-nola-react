/* eslint-disable no-undef */
/* eslint-disable jest/no-jasmine-globals */
import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import Header from "../components/Header";

describe("Header", () => {
    it("renders the expected navigation buttons", () => {
        render(<Header />);
        expect(screen.getByText("Devity")).toBeInTheDocument();
        expect(screen.getByText("OpenAI")).toBeInTheDocument();
        expect(screen.getByText("Links")).toBeInTheDocument();
        expect(screen.getByText("Clipboard")).toBeInTheDocument();
        expect(screen.getByText("Notes")).toBeInTheDocument();
        expect(screen.getByText("Libraries")).toBeInTheDocument();
    });
});

describe("Header Component", () => {
    it("calls the onNavigateClicked function with the expected argument when a navigation button is clicked", () => {
        const onNavigateClicked = jasmine.createSpy();
        render(<Header onNavigateClicked={onNavigateClicked} />);
        fireEvent.click(screen.getByText("Devity"));
        expect(onNavigateClicked).toHaveBeenCalledWith("DEVITY");
    });
});

import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import ConfirmationDialog from "../components/ConfirmationDialog";

// Create a separate div element for unit testing.
const modalRoot = document.createElement("div");
modalRoot.setAttribute("id", "root");

describe("ConfirmationDialog", () => {
    it("renders the dialog correctly with the given props", () => {
        render(
            <ConfirmationDialog
                title="Test Title"
                message="Test Message"
                isDialogOpen={true}
                modalType={null}
                onModalCloseCallback={null}
                appElementId="#root"
            />,
            { container: document.body.appendChild(modalRoot) }
        );

        expect(screen.getByText("Test Title")).toBeInTheDocument();
        expect(screen.getByText("Test Message")).toBeInTheDocument();
        expect(screen.getByText("Close Modal")).toBeInTheDocument();
    });

    it("calls the onModalCloseCallback when the close button is clicked", async () => {
        const handleClose = jest.fn();

        render(
            <ConfirmationDialog
                title="Test Title"
                message="Test Message"
                isDialogOpen={true}
                modalType={null}
                onModalCloseCallback={handleClose}
                appElementId="#root"
            />,
            { container: document.body.appendChild(modalRoot) }
        );

        fireEvent.click(screen.getByText("Close Modal"));
    
        await waitFor(() => expect(handleClose).toHaveBeenCalled());
    });

    it("does not render the close button for modalType 429", () => {
        render(
            <ConfirmationDialog
                title="Test Title"
                message="Test Message"
                isDialogOpen={true}
                modalType={429}
                onModalCloseCallback={null}
                appElementId="#root"
            />,
            { container: document.body.appendChild(modalRoot) }
        );

        expect(screen.queryByText("Close Modal")).not.toBeInTheDocument();
    });

    it("does not render the close button for modalType 401", () => {
        render(
            <ConfirmationDialog
                title="Test Title"
                message="Test Message"
                isDialogOpen={true}
                modalType={401}
                onModalCloseCallback={null}
                appElementId="#root"
            />,
            { container: document.body.appendChild(modalRoot) }
        );

        expect(screen.queryByText("Close Modal")).not.toBeInTheDocument();
    });

    it("renders the close button for modalType 402", () => {
        render(
            <ConfirmationDialog
                title="Test Title"
                message="Test Message"
                isDialogOpen={true}
                modalType={402}
                onModalCloseCallback={null}
                appElementId="#root"
            />,
            { container: document.body.appendChild(modalRoot) }
        );

        expect(screen.getByText("Close Modal")).toBeInTheDocument();
    });
});
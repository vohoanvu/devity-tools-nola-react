import React, { useContext } from "react";
import { render, screen, act } from "@testing-library/react";
import { UserProvider, UserContext } from "../api-integration/UserContext";
import { BrowserRouter as Router } from "react-router-dom";
import axios from "axios";
import Cookies from "universal-cookie";
const cookies = new Cookies();
jest.mock("axios");
jest.mock("universal-cookie");

const mockAxiosGet = jest.spyOn(axios, "get");
const mockAxiosPost = jest.spyOn(axios, "post");

afterEach(() => {
    jest.clearAllMocks();
});



describe("UserContext tests", () => {
    //test case 1
    test("Renders children components correctly", () => {
        const ChildComponent = () => <p data-testid="child-component">Child Component</p>;
        const setIs402ModalOpen = jest.fn(); // Add this line to create a mock function

        render(
            <Router>
                <UserProvider axios={{}} setIs402ModalOpen={setIs402ModalOpen}>
                    <ChildComponent />
                </UserProvider>
            </Router>
        );

        const childComponent = screen.getByTestId("child-component");
        // Assert that ChildComponent is rendered
        expect(childComponent).toBeInTheDocument();
    });

    //test case 2
    test("Renders children components with correct default values", () => {
        const ChildComponent = () => {
            const { userProfile, activePanel } = useContext(UserContext);
            return (
                <>
                    <p data-testid="user-profile">{JSON.stringify(userProfile)}</p>
                    <p data-testid="active-panel">{activePanel}</p>
                </>
            );
        };
        const setIs402ModalOpen = jest.fn();

        render(
            <Router>
                <UserProvider axios={{}} setIs402ModalOpen={setIs402ModalOpen}>
                    <ChildComponent />
                </UserProvider>
            </Router>
        );

        // Assert that userProfile and activePanel have correct default values
        const userProfile = screen.getByTestId("user-profile");
        expect(userProfile.textContent).toBe("{}");

        const activePanel = screen.getByTestId("active-panel");
        expect(activePanel.textContent).toBe(localStorage.getItem("curr_view") ?? "");
    });


    // Test case 3
    test("UserProvider handles the authentication process as expected", async () => {
        const token = "fake-token";
        const bearer = "Devity fake-bearer";
        const setIs402ModalOpen = jest.fn();

        // Simulate API response for POST /api/sessions
        mockAxiosPost.mockResolvedValue({
            data: { id: "fake-bearer", expires: new Date() },
        });

        // Simulate API response for GET /api/profile
        mockAxiosGet.mockResolvedValue({
            data: { name: "John Doe", email: "john.doe@example.com" },
        });

        // Render component with token
        window.history.pushState({}, "", `/?token=${token}`);
        render(
            <Router>
                <UserProvider axios={axios} setIs402ModalOpen={setIs402ModalOpen}>
                    <div />
                </UserProvider>
            </Router>
        );

        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 0));
        });

        // Assert that axios.post is called with the correct token
        expect(mockAxiosPost).toHaveBeenCalledWith("/api/sessions", { token });

        // Assert that axios.get is called to fetch user
        expect(mockAxiosGet).toHaveBeenCalledWith("/api/profile");

        // Render component with bearer
        jest
            .spyOn(window.document, "cookie", "get")
            .mockImplementation(() => `devity-token=${bearer}`);

        render(
            <Router>
                <UserProvider axios={axios} setIs402ModalOpen={setIs402ModalOpen}>
                    <div />
                </UserProvider>
            </Router>
        );

        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 0));
        });

        // Assert that axios.get is called to fetch user with bearer
        expect(mockAxiosGet).toHaveBeenCalledTimes(2); // Should be called twice (once for the token, another for the bearer)
    });


    // Test case 4
    test("AuthenticateUser and fetchUser function as expected", async () => {
        const TestChildComponent = () => {
            const { userProfile } = useContext(UserContext);
            return (
                <div>
                    <p data-testid="user-profile">{JSON.stringify(userProfile)}</p>
                </div>
            );
        };

        // Mock the cookies.get() method
        const cookiesGet = jest.fn().mockReturnValue("fake-bearer");
        // Temporarily replace the original method with our mock function
        const originalMethod = cookies.get;
        cookies.get = cookiesGet;

        const fetchUserResponse = { name: "John Doe", email: "john.doe@example.com" };
        const setIs402ModalOpen = jest.fn();

        // Simulate API response for GET /api/profile
        mockAxiosPost.mockResolvedValue({
            data: { id: "fake-bearer", expires: new Date() },
        });

        mockAxiosGet.mockResolvedValue({ data: fetchUserResponse });

        window.history.pushState({}, "", "/?token=fake-token");
        render(
            <Router>
                <UserProvider axios={axios} setIs402ModalOpen={setIs402ModalOpen}>
                    <TestChildComponent />
                </UserProvider>
            </Router>
        );

        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 0));
        });

        // Assert that AuthenticateUser function is called to authenticate the user
        expect(mockAxiosPost).toHaveBeenCalled();

        // Assert that fetchUser function is called to fetch the user
        expect(mockAxiosGet).toHaveBeenCalled();

        // Verify axios.post and axios.get were called with the correct arguments
        expect(mockAxiosPost).toHaveBeenCalledWith("/api/sessions", { token: "fake-token" });
        expect(mockAxiosGet).toHaveBeenCalledWith("/api/profile");

        // Assert that the fetched user is saved in the UserContext
        const userProfileElement = screen.getByTestId("user-profile");
        expect(JSON.parse(userProfileElement.textContent)).toEqual(fetchUserResponse);

        // Restore the original method
        cookies.get = originalMethod;
    });
});
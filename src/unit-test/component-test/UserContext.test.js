// import React from "react";
// import { render, waitFor } from "@testing-library/react";
// import { UserProvider, UserContext } from "../../api-integration/UserContext";
// import axios from "axios";
// import Cookies from "universal-cookie";

// jest.mock("axios");
// jest.mock("universal-cookie");

// const mockSetIs402ModalOpen = jest.fn();
// const userProfileData = {
//     id: "1",
//     name: "John Doe",
//     email: "john.doe@example.com",
// };

// const apiResponse = {
//     data: userProfileData,
// };

// // Mocking useLocation hook
// jest.mock("react-router-dom", () => ({
//     ...jest.requireActual("react-router-dom"),
//     useLocation: () => ({
//         search: "",
//     }),
// }));

// function renderUserProvider() {
//     const utils = render(
//         <UserProvider axios={axios} setIs402ModalOpen={mockSetIs402ModalOpen}>
//             <UserContext.Consumer>
//                 {({ userProfile }) => <div data-testid="userProfile">{JSON.stringify(userProfile)}</div>}
//             </UserContext.Consumer>
//         </UserProvider>
//     );

//     // eslint-disable-next-line testing-library/prefer-screen-queries
//     const getUserProfile = () => JSON.parse(utils.getByTestId("userProfile").textContent);
//     return {
//         ...utils,
//         getUserProfile,
//     };
// }

// describe("UserContext", () => {
//     afterEach(() => {
//         jest.clearAllMocks();
//     });

//     test("fetch and display the user profile", async () => {
//         axios.get.mockImplementationOnce(() => Promise.resolve(apiResponse));
//         Cookies.mockImplementationOnce(() => ({
//             get: () => "Devity fakeToken",
//         }));

//         const { getUserProfile } = renderUserProvider();

//         await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
//         expect(axios.get).toHaveBeenCalledWith("/api/profile");
//         expect(getUserProfile()).toEqual(userProfileData);
//     });

//     test("handle token from URL and call AuthenticateUser", async () => {
//         const token = "newToken";
//         const fakeBearer = "Devity fakeBearer";
//         const fakeExpiresDate = new Date("2030-12-31T00:00:00.000Z");
//         Cookies.mockImplementationOnce(() => ({
//             get: () => null,
//             set: jest.fn(),
//             remove: jest.fn(),
//         }));

//         // Modify useLocation mock to return a URL with token
//         jest.mock("react-router-dom", () => ({
//             ...jest.requireActual("react-router-dom"),
//             useLocation: () => ({
//                 search: `?token=${token}`,
//             }),
//         }));

//         axios.post.mockImplementationOnce(() => Promise.resolve({ data: { id: fakeBearer, expires: fakeExpiresDate } }));
//         axios.get.mockImplementationOnce(() => Promise.resolve(apiResponse));

//         const { getUserProfile } = renderUserProvider();

//         await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));

//         expect(axios.post).toHaveBeenCalledWith("/api/sessions", { token });
//         expect(axios.defaults.headers.common["Authorization"]).toBe(fakeBearer);
//         expect(getUserProfile()).toEqual(userProfileData);
//     });
// });
import React from "react";
import { render, screen } from "@testing-library/react";
import { UserProvider } from "../../api-integration/UserContext";

describe("UserContext tests", () => {
    test("Renders children components correctly", () => {
        const ChildComponent = () => <p data-testid="child-component">Child Component</p>;

        render(
            <UserProvider>
                <ChildComponent />
            </UserProvider>
        );

        const childComponent = screen.getByTestId("child-component");
        // Assert that ChildComponent is rendered
        expect(childComponent).toBeInTheDocument();
    });
});
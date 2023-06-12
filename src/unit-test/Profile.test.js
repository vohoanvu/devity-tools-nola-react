import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import Profile from "../components/Profile";

const defaultState = {
    UserProfileReducer: {
        userProfileData: {
            name: "",
            profession: ""
        },
        openAiApiKey: ""
    }
};
  
const mockStore = configureMockStore([thunk]);

const renderProfile = (store) => {
    return render(
        <Provider store={store}>
            <Profile COOKIE_NAME="cookies" axios={{}} />
        </Provider>
    );
};

describe("Profile", () => {
    let store;
  
    beforeEach(() => {
        store = mockStore(defaultState);
    });

    it("displays editable fields for username, profession, and API Key", () => {
        renderProfile(store);

        expect(screen.getByText(/000-000-000-000/i)).toBeInTheDocument();
        expect(screen.getByText("Select Profession")).toBeInTheDocument();
    });

    it("calls handleCopyClick for session-token-btn", () => {
        Object.defineProperty(navigator, "clipboard", {
            writable: true,
            value: {
                writeText: jest.fn(() => Promise.resolve())
            }
        });
        renderProfile(store);

        fireEvent.click(screen.getByTestId("session-token-btn"));
        expect(navigator.clipboard.writeText).toHaveBeenCalled();
    });
});
import ConfigData from "../../config.json";

const initialState = { 
    openAiApiKey: localStorage.getItem("openai-api-key") ?? "",
    selectedGptModel: localStorage.getItem("gpt-model") ?? ConfigData.OPENAI_GPT_MODEL,
    userProfileData: {}
};

export default function UserProfileReducer(state = initialState, action) 
{ 
    switch (action.type) 
    { 
    case "SET_OPENAI_API_KEY": 
        return { 
            ...state, 
            openAiApiKey: action.payload
        };
    case "SET_GPT_MODEL": 
        return { 
            ...state, 
            selectedGptModel: action.payload
        };
    case "SET_USER_PROFILE": 
        return { 
            ...state, 
            userProfileData: action.payload
        };
    default: 
        return state; 
    } 
}

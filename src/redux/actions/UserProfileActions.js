export function setOpenAiApiKey(data)
{
    return { 
        type: "SET_OPENAI_API_KEY", 
        payload: data 
    };
}

export function setGptModel(data)
{
    return { 
        type: "SET_GPT_MODEL", 
        payload: data 
    };
}

export function setUserProfileData(data)
{
    return { 
        type: "SET_USER_PROFILE", 
        payload: data
    };
}


const initialState = { 
    exampleData: null 
}; 

export default function exampleReducer(state = initialState, action) 
{ 
    switch (action.type) 
    { 
    case "SET_EXAMPLE_DATA": 
        return { 
            ...state, 
            exampleData: action.payload 
        }; 
    default: 
        return state; 
    } 
}

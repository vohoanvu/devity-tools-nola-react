const initialState = {
    noteContents: []
};

export default function WidgetNotesReducer(state=initialState, action)
{
    switch (action.type) 
    { 
    case "SET_NOTE_CONTENT": 
        return { 
            ...state, 
            noteContents: action.payload
        };
    default: 
        return state;
    }
}
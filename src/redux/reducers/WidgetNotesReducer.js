const initialState = {
    noteContents: [],
    isTinyEditorReady: false
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
    case "SET_ISTINYEDITORREADY_FLAG":
        return { 
            ...state, 
            isTinyEditorReady: action.payload
        };
    default: 
        return state;
    }
}
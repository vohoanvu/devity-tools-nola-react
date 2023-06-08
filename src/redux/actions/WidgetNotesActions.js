export function setNoteContents(data)
{
    return { 
        type: "SET_NOTE_CONTENT", 
        payload: data 
    };
}

export function setIsTinyEditorReady(data)
{
    return {
        type: "SET_ISTINYEDITORREADY_FLAG",
        payload: data
    }
}
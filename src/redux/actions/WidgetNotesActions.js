export function setNoteContents(data)
{
    return { 
        type: "SET_NOTE_CONTENT", 
        payload: data 
    };
}
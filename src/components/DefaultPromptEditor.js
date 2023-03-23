import React, { useState, useEffect } from "react";
import JSONInput from "react-json-editor-ajrm";
const defaultData = [
    {"role": "system", "content": "You are a helpful programming assistant that have more than 20 years of software engineering experience and are an enterprise software solution architect."},
    {"role": "user", "content": "Help me fix this Docker error:\n'{errorLogsText}'"},
    {"role": "assistant", "content": "The error message indicates that the connection to the Kafka broker at 172.18.0.8:9092 is being refused. This suggests that the Kafka server may not be accessible from the container where your Razor UI application is running.\nTo troubleshoot this issue, you can try the following steps:\n"},
    {"role": "user", "content": "Write React code for this Confirmation Dialog feature"},
    {"role": "assistant", "content": "Here is an example:\n<code-block>"},
    {"role": "user", "content": "Generate step-by-step instructions on how to configure and build ASP.NET Core Microservice system with Docker"},
    {"role": "assistant", "content": "Please specify what kind of software system that you want to build as microservice! But here is an example:\n 1. Install Docker"},
    {"role": "user", "content": "<devity-input-text>"}
];
 
export default function DefaultPromptEditor({ input })
{
    const [jsonData, setJsonData] = useState(defaultData);

    useEffect(() =>{
    }, []);

    const handleJsonDataChange = (data) => {
        setJsonData(data.jsObject);
    };
    
    const getFinalData = () => {
        const finalData = [...jsonData];
        finalData.forEach((data) => {
            if (data.content.includes("<devity-input-text>")) {
                data.content = data.content.replace("<devity-input-text>", input);
            }
        });
        return finalData;
    };

    const handleSave = () => {
        localStorage.setItem("defaultChatPrompt", JSON.stringify(getFinalData()));
    };

    return (
        <div>
            <JSONInput
                id="json-editor"
                height="100vh"
                width="100%"
                onChange={handleJsonDataChange}
                colors={{
                    string: "#DAA520",
                }}
                placeholder={defaultData}
            />
            <pre>{JSON.stringify(getFinalData(), null, 2)}</pre>
            <button onClick={handleSave}>Save</button>
        </div>
    );
}

import React, { useState, useEffect } from "react";
import { Configuration, OpenAIApi } from "openai";
import btn_image_config from "../../img/d_btn_ctrl_config.png";
import "../../css/chatgpt.css";
const defaultData = [
    {"role": "system", "content": "You are a helpful programming assistant that have more than 20 years of software engineering experience and are an enterprise software solution architect."},
    {"role": "user", "content": "Help me fix this Docker error:\n'{errorLogsText}'"},
    {"role": "assistant", "content": "The error message indicates that the connection to the Kafka broker at 172.18.0.8:9092 is being refused. This suggests that the Kafka server may not be accessible from the container where your Razor UI application is running.\nTo troubleshoot this issue, you can try the following steps:\n"},
    {"role": "user", "content": "Write React code for this Confirmation Dialog feature"},
    {"role": "assistant", "content": "Here is an example:\n<code-block>"},
    {"role": "user", "content": "Generate step-by-step instructions on how to configure and build ASP.NET Core Microservice system with Docker"},
    {"role": "assistant", "content": "Please specify what kind of software system that you want to build as microservice! But here is an example:\n 1. Install Docker"},
];

export default function DevityChatGPT()
{
    const [apiKey, setApiKey] = useState("");
    const [prompt, setPrompt] = useState(defaultData);
    const [answers, setAnswers] = useState({}); //{"role": "assistant","content": "\n\nHello there, how may I assist you today?"}
    const [inputText, setInputText] = useState("");
    const [tokenCount, setTokenCount] = useState(0);
    const [copySuccess, setCopySuccess] = useState(false);

    useEffect(() =>{
        //setPrompt(localStorage.getItem("defaultChatPrompt"));
    }, []);

    const handleInputTextChange = (event) => {
        setInputText(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const configuration = new Configuration({
            apiKey: apiKey,
        });
        const openai = new OpenAIApi(configuration);
        const userMessage = {
            "role" : "user",
            "content": inputText
        };
        prompt.push(userMessage);

        try {
            const CompletionResponse = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: prompt,
            });

            setAnswers(CompletionResponse.data.choices[0].message);

            setInputText("");
            setTokenCount(tokenCount + CompletionResponse.data.choices[0].tokens_used);
        }
        catch (error) {
            console.log(error);
        }
    };

    const handleClearMessages = () => 
    {
        setPrompt([]);
        setTokenCount(0);
    };

    const handleCopyClick = () => {
        navigator.clipboard.writeText(answers.content);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 1500);
    };

    return (
        <div className="p-panel border" style={{display:"none"}} data-panel="CHATGPT">
            <div className="p-chrome">
                <img src={btn_image_config} className="gear" alt="devity gear" />
            </div>

            <div className="api-login">
                <form>
                    <label>
                    API Key:
                        <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
                    </label>
                </form>
                {
                    tokenCount > 0 && <div>Tokens Used: {tokenCount}</div>
                }
            </div>

            <div className="output-completion">
                <pre>
                    <code>{answers.content}</code>
                </pre>
                <button onClick={handleCopyClick}>
                    {copySuccess ? "Copied!" : "Copy"}
                </button>
            </div>
            
            <div className="input-prompt">
                <form onSubmit={handleSubmit}>
                    <label>
                        Enter Prompt:
                        <input type="text" value={inputText} onChange={handleInputTextChange} />
                    </label>
                    <button type="submit">Submit</button>
                </form>
                <button onClick={handleClearMessages}>Clear Messages</button>
            </div>
        </div>
    );
}
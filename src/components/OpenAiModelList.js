import React, { useState, useEffect } from "react";
import "../css/chatgpt.css";
//import { Configuration, OpenAIApi } from "openai";
const chatCompletionModels = ["gpt-4", "gpt-4-0314", "gpt-4-32k", "gpt-4-32k-0314", "gpt-3.5-turbo", "gpt-3.5-turbo-0301"];

const OpenAIModelList = (props) => {
    const [models, setModels] = useState([]);
    const [currentModel, setCurrentModel] = useState("gpt-3.5-turbo");
    //const OPENAI_API_KEY = localStorage.getItem("openai-api-key") ?? "";

    useEffect(() => {
        setModels(chatCompletionModels);
    }, [])

    // const fetchOpenAIModels = async () => {
    //     const configuration = new Configuration({
    //         apiKey: OPENAI_API_KEY,
    //     });
    //     const openai = new OpenAIApi(configuration);
    //     try {
    //         const response = await openai.listModels();
    //         console.log("Response...", response);
    //         if (response.data && response.data.data) {
    //             let chatCompatibleModels = response.data.data.filter(model => 
    //                 chatCompletionModels.includes(model.id));
    //             setModels(chatCompatibleModels);
    //         } else {
    //             console.error("Failed to fetch models!")
    //         }
    //     } catch (error) {
    //         console.error("An error occurred while fetching model list:", error.response)
    //     }
    // }

    return (
        <div>
            <select 
                value={currentModel} 
                onChange={(e)=> {
                    setCurrentModel(e.target.value);
                    props.updateOpenAiModel(e.target);
                }}>
                {
                    models.map((modelName, index)=> (
                        <option key={index} value={modelName}>{modelName}</option>
                    ))
                }
            </select>
        </div>
    )
}

export default OpenAIModelList
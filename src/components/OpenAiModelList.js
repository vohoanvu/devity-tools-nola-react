import React, { useState, useEffect } from "react";
import "../css/chatgpt.css";
import { Configuration, OpenAIApi } from "openai";
import btn_copy from "../img/btn_copy.png";
import $ from "jquery";

const OpenAIModelList = () => {
    const [models, setModels] = useState([])

    // Get the API key from your environment variables
    const OPENAI_API_KEY = localStorage.getItem("openai-api-key") ?? "";

    useEffect(() => {
        const getModels = async () => {
            const configuration = new Configuration({
                apiKey: OPENAI_API_KEY,
            });
            const openai = new OpenAIApi(configuration);
            try {
                // const response = await openai.get("https://api.openai.com/v1/models", {
                //     headers: {
                //         "Content-Type": "application/json",
                //         Authorization: `Bearer ${OPENAI_API_KEY}`,
                //     },
                // })
                const response = await openai.listModels();
                console.log("Response...", response);
                if (response.data && response.data.data) {
                    setModels(response.data.data)
                } else {
                    console.error("Failed to fetch models!")
                }
            } catch (error) {
                console.error("An error occurred while fetching model list:", error.response)
            }
        }

        getModels()
    }, [OPENAI_API_KEY])

    function handleCopyClick(data,i) 
    {
        $("span.openai-model-"+i).animate({ opacity: "0.1" }, "fast");
        $("span.openai-model-"+i).animate({ opacity: "1" }, "fast");

        navigator.clipboard.writeText(data).then(function() {
            console.log(data);
        }, function(err) {
            console.error("Async: Could not copy text: ", err);
        });
    }

    return (
        <div>
            <ul>
                <h2 style={{ marginLeft: "-19px"}}>OpenAI Model List</h2>
                {
                    models.map((modelObject, index) => (
                        <div className="copy-container" key={index}>
                            <label ><span className={"openai-model-"+{index}}>{modelObject.id}</span></label>
                            <button
                                onClick={()=>handleCopyClick(modelObject.id, index)} 
                                title="Copy to clipboard" 
                                className="copy-clipboard-btn">
                                <img src={btn_copy} alt="Copy to clipboard"/>
                            </button>
                        </div>
                        
                    ))
                }
            </ul>
        </div>
    )
}

export default OpenAIModelList
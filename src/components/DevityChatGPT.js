import React, { useState, useEffect, useRef } from "react";
import { Configuration, OpenAIApi } from "openai";
import "../css/index.css";
import btn_image_config from "../img/d_btn_ctrl_config.png";
import send_chat_btn from "../img/send_chat.png";
import ai_btn_save from "../img/save_btn_original.png";
import "../css/chatgpt.css";
import $ from "jquery";
import ConfigData from "../config.json";
const defaultPrompt = [
    {"role": "system", "content": "You are a helpful programming assistant that have more than 20 years of software engineering experience and are an enterprise software solution architect."},
    {"role": "user", "content": "Help me fix this Docker error:\n\n```errorLogsText```"},
    {"role": "assistant", "content": "The error message indicates that the connection to the Kafka broker at 172.18.0.8:9092 is being refused. This suggests that the Kafka server may not be accessible from the container where your Razor UI application is running.\nTo troubleshoot this issue, you can try the following steps:\n"},
    {"role": "user", "content": "Write React code for this Confirmation Dialog feature"},
    {"role": "assistant", "content": "Here is an example:\n\n```code-block```"}
    //{"role": "user", "content": "Generate step-by-step instructions on how to configure and build ASP.NET Core Microservice system with Docker"},
    //{"role": "assistant", "content": "Please specify what kind of software system that you want to build as microservice! But here is an example:\n 1. Install Docker"}
];
const testAnswers = [
    // {"role": "user", "content": "Please write Hello World program in PHP."},
    // {"role": "assistant", "content": "Sure, here are sample Hello World programs in PHP and JavaScript:\n\nPHP:\n```php\n<?php\necho \"Hello World!\";\n?>\n```\n\nJavaScript:\n```javascript\nconsole.log(\"Hello World!\");\n```\n\nNote: The PHP code needs to be saved in a file with .php extension and be run on a web server with PHP installed. The JavaScript code can be saved in a file with .js extension and be run on a web browser."},
    // {"role": "user", "content": "Now write Hello World program in C# and JavaScript."},
    // {"role": "assistant", "content": "Sure! Here is the 'Hello World' code in C#:\n\n```csharp\nusing System;\n\nclass Program {\n  static void Main(string[] args) {\n    Console.WriteLine(\"Hello World\");\n    Console.ReadKey();\n  }\n}\n```\n\nAnd here is the 'Hello World' code in JavaScript:\n\n```javascript\nconsole.log('Hello World');\n``` \n\nBoth of these code snippets will output \"Hello World\" to the console."},
    {"role": "user", "content": "Write Hello World program in Ruby."},
    {"role": "assistant", "content": "Here's the Hello World program in Ruby:\n\n```ruby\nputs \"Hello, world!\"\n```\n\nThis code will output \"Hello, world!\" to the console." },
    {"role": "user", "content": "Write Hello World program in Ruby on Rails."},
    {
        "role": "assistant",
        "content": "Here is the \"Hello, World!\" code in Ruby on Rails:\n\n1. First, make sure you have Ruby and Rails installed on your computer.\n2. Open a terminal or command prompt and type the following command:\n\n   ```\n   rails new hello_world\n   ```\n\n3. This will create a new Rails application with the name \"hello_world\".\n4. Navigate into the newly created directory by typing:\n\n   ```\n   cd hello_world\n   ```\n\n5. Open the file `config/routes.rb` in your favorite text editor, and enter the following code:\n\n   ```ruby\n   Rails.application.routes.draw do\n     root 'application#hello'\n   end\n   ```\n\n6. This code sets up a route that maps the root URL '/' to the `hello` action of the `application` controller.\n7. Open the file `app/controllers/application_controller.rb` in your text editor and add the following method:\n\n   ```ruby\n   class ApplicationController < ActionController::Base\n     def hello\n       render html: \"Hello, World!\"\n     end\n   end\n   ```\n\n8. This code adds an action named `hello` to the `ApplicationController` that simply renders the text \"Hello, World!\".\n9. Start the Rails server by typing:\n\n   ```\n   rails server\n   ```\n\n10. Open your web browser and navigate to `http://localhost:3000`. You should see the text \"Hello, World!\" displayed on the page.\n\nThat's it! You've written and executed your first Ruby on Rails application."
    },
    {"role": "user", "content": "Write Hello World program in Java"},
    {
        "role": "assistant",
        "content": "Here's the code to print \"Hello, World!\" in Java:\n\n```java\npublic class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println(\"Hello, World!\");\n    }\n}\n```\n\nThis code creates a Java class called `HelloWorld` with a `main` method that outputs the string \"Hello, World!\" to the console using the `System.out.println` method."
    },
    {"role": "user", "content": "Suggest to me 3 Spotify Premium playlists for focused programming session"},
    {
        "role": "assistant",
        "content": "Here are three playlists on Spotify that I recommend for a focused programming session:\n\n1. \"Deep Focus\" - This playlist features instrumental tracks with slow, calming rhythms to help you concentrate while you work.\n\n2. \"Chill Tracks\" - This playlist has a mix of electronic, hip-hop, and indie tracks that are relaxing and enjoyable while working.\n\n3. \"Lo-fi Beats\" - Lo-fi hip-hop beats are known for their calm and chill vibe that can boost your productivity and focus during work. This playlist features plenty of lo-fi tracks perfect for a programming session."
    },
    {
        "role": "user",
        "content": "I'm a developer who wants to learn about nx-dotnet. Can you suggest the three best introductory videos on youtube about nx-dotnet?"
    },
    {
        "role": "assistant",
        "content": "Sure, here are three good videos on YouTube that provide an introduction to nx-dotnet:\n\n1. **Getting Started with Nx and .NET Core**: This video by John Papa, one of the creators of Nx, provides an excellent introduction to using Nx with .NET Core. He covers the basics of Nx, shows how to set up a new Nx workspace with .NET Core, and provides examples of using Nx commands to generate and test code. \n\nLink: https://www.youtube.com/watch?v=CAzE5flnrdc\n\n2. **Building Full-stack Web Apps with Nx and ASP.NET Core**: This video by Stephen Fluin provides an overview of using Nx to develop full-stack web applications with ASP.NET Core. He covers how to create an Nx workspace, generate an ASP.NET Core application, and build and test the app with Nx commands. \n\nLink: https://www.youtube.com/watch?v=vxtl5X5zu5M\n\n3. **Nx Workspaces and .NET Core: Best Practices**: This video by Jeremy Likness provides an in-depth look at using Nx with .NET Core and covers best practices for organizing your code and setting up your workspace. He also provides examples of using Nx commands to manage dependencies, generate code, and test your application.\n\nLink: https://www.youtube.com/watch?v=iilDwBaVTfg"
    },
    {
        "role": "user",
        "content": "now regenerate the same response for the same prompt, but this time you write the hyperlink text extracted from the content response in the markdown format like [link-title-description](https://www.youtube.com/watch?)"
    },
    {
        "role": "assistant",
        "content": "Sure, here are the three best introductory videos on `nx-dotnet`:\n\n1. [Nx for .NET Developers - How to Use Nx with .NET Core Projects - YouTube](https://www.youtube.com/watch?v=KjZp-Vxqroo&ab_channel=nrwl%3ANext)\n2. [Angular + .NET + NX = The Perfect Trio (Angular Conf 2020) - YouTube](https://www.youtube.com/watch?v=JuuF92H1mXE&ab_channel=Angular)\n3. [Practical Full-stack Development with Nx, Node, and React - YouTube](https://www.youtube.com/watch?v=F4EzRM4iFbc&ab_channel=nrwl%3ANext)\n\nHere's the same response written in markdown format:\n\n1. [Nx for .NET Developers - How to Use Nx with .NET Core Projects - YouTube](https://www.youtube.com/watch?v=KjZp-Vxqroo&ab_channel=nrwl%3ANext)\n2. [Angular + .NET + NX = The Perfect Trio (Angular Conf 2020) - YouTube](https://www.youtube.com/watch?v=JuuF92H1mXE&ab_channel=Angular)\n3. [Practical Full-stack Development with Nx, Node, and React - YouTube](https://www.youtube.com/watch?v=F4EzRM4iFbc&ab_channel=nrwl%3ANext)"
    }
];


export default function DevityChatGPT({ axios, isAINoteCreated, setIsAINoteCreated, setIsDataLimitModalOpen })
{
    const [apiKey, setApiKey] = useState(localStorage.getItem("openai-api-key"));
    const [prompt, setPrompt] = useState(defaultPrompt);
    const [messages, setMessages] = useState(testAnswers); //[{"role": "assistant","content": "\n\nHello there, how may I assist you today?"}]
    const [inputText, setInputText] = useState("");
    const [tokenCount, setTokenCount] = useState(0);
    const [error, setError] = useState({
        status: 200,
        message: ""
    });
    const messagesEndRef = useRef(null);

    useEffect(() =>{
        const handleLocalStorageChange = () => {
            const newApiKey = localStorage.getItem("openai-api-key");
            if (newApiKey !== undefined && newApiKey !== null && newApiKey !== "") {
                setApiKey(newApiKey);
                setError({ status: 200, message: "" });
            } else {
                setError({
                    status: 401,
                    message: "Your API Key is not in your user profile. Please visit your profile and enter an API Key."
                });
            }
        }
        
        handleLocalStorageChange();
        window.addEventListener("storageUpdated", handleLocalStorageChange);
        window.addEventListener("storage", handleLocalStorageChange); // this Event is meant for localStorage removal in the browser UI

        return () => {
            window.removeEventListener("storageUpdated", handleLocalStorageChange);
            window.removeEventListener("storage", handleLocalStorageChange);
        };
    }, [apiKey]);


    const handleInputTextChange = (event) => {
        setInputText(event.target.value);
    };

    const handleChatSubmit = async (event) => {
        handleClearMessages();
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
        setMessages(prevs => [...prevs, userMessage]);
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

        
        //Calling OpenAI API
        $("div[data-panel=CHATGPT] .gear").addClass("rotate");
        await openai.createChatCompletion({
            model: localStorage.getItem("gpt-model") ?? ConfigData.OPENAI_GPT_MODEL,
            messages: prompt,
        }).then(response => {
            console.log("ChatCompletions response....", response);
            return response.data;
        }).then(result => {
            console.log("ChatCompletions result....", result.choices[0].message);
            setMessages(prevMsg => [...prevMsg, result.choices[0].message] );
            setTokenCount(tokenCount + result.usage.total_tokens);
            setInputText("");
            $("div[data-panel=CHATGPT] .gear").removeClass("rotate");
        }).catch(error => {
            //console.log("error.response: ",error.response);
            //console.log("error.message: ",error.message);
            setError({
                status: error.response.status,
                message: error.response.data.error.message
            });
            $("div[data-panel=CHATGPT] .gear").removeClass("rotate");
        });
    };

    const handleClearMessages = () => 
    {
        setPrompt(defaultPrompt);
        setInputText("");
        $(".input-prompt textarea").focus();
    };

    const handleCopyClick = (codeContent) => {
        navigator.clipboard.writeText(codeContent);
    };

    async function handleAIConversationSave() {
        await saveAIResponseAsNoteWidget($("div.output-completion").html());
    }

    async function handleAISingleMessageSave(index) {
        await saveAIResponseAsNoteWidget($(`#ai-single-answer-${index+1}`).html());
    }

    async function saveAIResponseAsNoteWidget(htmlContent) {
        let jsonObject = {};
        jsonObject["NOTES"] = "<div class='ai-conversation'><p>" + htmlContent + "</p></div>";

        let currentNoteWidgets = $("div[data-panel=NOTES]").find(".w-container min border");
        
        const newNoteWidget = {
            w_content: JSON.stringify(jsonObject),
            name: localStorage.getItem("gpt-model") ?? ConfigData.OPENAI_GPT_MODEL,
            order: currentNoteWidgets.length+1,
            w_type: "NOTES",
            height : 300,
            width: 300
        }

        $("div[data-panel=CHATGPT] .gear").addClass("rotate");
        await axios.post("/api/widgets/", { ...newNoteWidget })
            .then(response => {
                return response.data;
            })
            .then(result => {
                if (result.id) {
                    setIsAINoteCreated(!isAINoteCreated);
                    console.log("Created AI NOTE widget.", result);
                    $("div[data-panel=CHATGPT] .gear").removeClass("rotate");
                    $("#nav_notes").addClass("lightning-animation");
                }
            })
            .catch(err => {
                console.log(err.response);
                if (err.response && err.response.status === 402) {
                    setIsDataLimitModalOpen(true);
                }
                $("div[data-panel=CHATGPT] .gear").removeClass("rotate");
            });
    }

    function replaceURLandMarkdownWithHTMLLinks(text) {
        var markdownExp = /\[([^[]+)\]\(([^)]+)\)/g;
        var urlExp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi;
        if (markdownExp.test(text)) {
            return text.replace(markdownExp, "<a target='_blank' rel='noreferrer' href='$2'>$1</a>");
        } else {
            return text.replace(urlExp, "<a target='_blank' rel='noreferrer' href='$1'>$1</a>");
        }
    }

    function renderAICompletionText(content) {
        const codeBlockRegex = /```[\s\S]*?```/g;
        const splitInput = content.split(codeBlockRegex);
        const codeBlocks = content.match(codeBlockRegex);
        let result = [];
        //separating code-blocks from the AI-generated text 
        for (let i = 0; i < splitInput.length; i++) {
            //normal human-text answer
            if (splitInput[i]) {
                
                const lines = splitInput[i].split("\n");
                const formattedText = i === 0 ? 
                    lines.map((line,y) => {
                        let firstLineTextJSX = y === 0 ? 
                            <span style={{ display: "inline-flex"}} key={i}>{line}</span> : 
                            <p key={i} dangerouslySetInnerHTML={{ __html: replaceURLandMarkdownWithHTMLLinks(line) }}/>
                        return firstLineTextJSX;
                    }) :
                    lines.map((line,i) => <p key={i} dangerouslySetInnerHTML={{ __html: replaceURLandMarkdownWithHTMLLinks(line) }}/>);
                result.push(...formattedText);
            }

            //code-block answer
            if (codeBlocks && codeBlocks[i]) {
                let language = codeBlocks[i].match(/```(\S*)/)[1];
                let codeContent = codeBlocks[i].replace(/```\S*\n/, "").replace(/\n```/, "");
                result.push(
                    <pre>
                        <div className="code-block-window border">
                            <div className="code-block-chrome">
                                <span>{language}</span>
                                <button
                                    title="copy to clipboard" 
                                    onClick={() => handleCopyClick(codeContent)}>
                                    Copy
                                </button>
                            </div>
                            <div className="code-block-div">
                                <code className="code-block-content">{codeContent}</code>
                            </div>
                        </div>
                    </pre>
                );
            }
        }
        
        return result;
    }

    return (
        <div className="p-panel border" style={{display:"none"}} data-panel="CHATGPT">
            <div className="p-chrome">
                <img src={btn_image_config} className="gear" alt="devity gear" />
                <div className="gpt-api-info">
                    <label style={{marginLeft:"10px"}}> Tokens Used: {tokenCount} |</label>
                    <label style={{marginLeft:"10px"}}> GPT Model Used: {localStorage.getItem("gpt-model") ?? ConfigData.OPENAI_GPT_MODEL}</label>
                </div>
                <button title="Save AI conversation">
                    <img
                        onClick={() => {
                            handleAIConversationSave();
                        }}
                        src={ai_btn_save} 
                        alt="save widget"
                        aria-hidden="true"/>
                </button>
            </div>


            <div className="flex-container">
                <div className="output-completion">
                    <ul className="ai-chat-output">
                        {
                            messages.length !== 0 ? messages.map((msg, index) => {
                                let result = msg.role === "user" ? (
                                    <li key={index}>
                                        <label>You: <span>{msg.content}</span></label>
                                        <button id="ai-save-single" title="Save single AI answer">
                                            <img
                                                onClick={() => handleAISingleMessageSave(index)}
                                                src={ai_btn_save}
                                                alt="save widget"
                                                aria-hidden="true"/>
                                        </button>
                                    </li>
                                ) : (
                                    <li id={`ai-single-answer-${index}`} key={index}>
                                        {
                                            renderAICompletionText(msg.content).map((part, index) => {
                                                if (index === 0) {
                                                    return (<label key={index}>OpenAI: {part}</label>)
                                                } else {
                                                    return (<div key={index}>{part}</div>)
                                                }
                                            })
                                        }
                                    </li>
                                );
                                
                                return result;
                            }) : (
                                <li><h1>Welcome to ChatGPT using {localStorage.getItem("gpt-model") ?? ConfigData.OPENAI_GPT_MODEL}</h1></li>
                            )
                        }
                        {
                            error.status !== 200 && (
                                <li>
                                    <span style={{ color: "red" }}>Status: {error.status}</span>
                                    <br/>
                                    <span style={{ color: "red" }}>Message: {error.message}</span>
                                </li>
                            )
                        }
                        <div ref={messagesEndRef}/>
                    </ul>
                </div>
                
                <div className="input-prompt">
                    <form onSubmit={handleChatSubmit}>
                        <textarea 
                            id="ai-chatbox"
                            value={inputText} 
                            onChange={handleInputTextChange} 
                            placeholder="Type your question..."
                            onKeyDown={(e) => {
                                if (e.shiftKey && e.key === "Enter") {
                                    return; // do nothing, let the new line be added
                                }
                                if (e.key === "Enter") {
                                    handleChatSubmit(e);
                                }
                            }}
                            style={{ resize: "both" }} // Make the textarea resizable
                        />
                        <button type="submit" title="send chat">
                            <img src={send_chat_btn} alt="send-chat button" className="send-chat-btn-img"/>
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
}
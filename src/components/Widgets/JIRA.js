import React, { useState, useEffect } from "react";
import "../../css/App.css";
import $ from "jquery";
import JiraCredentials from "../JiraCredentials";

const JiraTicket = ({ widget, sendContentToParent, activePanel, isConfigsChanged, axios }) => {
    const [tickets, setTickets] = useState([]);
    const [assignedOrMentioned, setAssignedOrMentioned] = useState("");
    const [ticketTypes, setTicketTypes] = useState([]);
    const [ticketStatuses, setTicketStatuses] = useState([]);
    const [priorities, setPriorities] = useState([]);
    const [showConfigurations, setShowConfigurations] = useState(true);
    const [jiraSearchtError, setJiraSearchError] = useState({
        code: 0,
        errMessages: []
    });
    const [jiraPriorityErrors, setJiraPriorityErrors] = useState({
        code: 0,
        errMessages: []
    });

    useEffect(() => {
        if (activePanel && activePanel !== "DEVITY") return;

        const reloadJiraContent = () => getJiraConfigurationsContent(widget.id).then(configs => {
            const apiToken = localStorage.getItem("jira_token");
            const domain = localStorage.getItem("jira_domain");
            const email = localStorage.getItem("jira_user_id");
            console.log("Saved Jira Configs...", configs);
            if (apiToken && domain && email) {
                fetchJiraTickets(apiToken, domain, email, configs["DUTY"], configs["ISSUETYPES"], configs["STATUSES"], configs["PRIORITIES"]);
            } else {
                setJiraSearchError({
                    code: 401,
                    errMessages: ["Missing JIRA credentials. Please fill out Jira credentials in the Configs form above!"]
                });
            }
        });

        reloadJiraContent();
        const jiraInterval = setInterval(() => {
            reloadJiraContent();
        }, 5 * 60 * 1000);

        return () => {
            clearInterval(jiraInterval);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isConfigsChanged, activePanel, widget.id]);

    async function getJiraConfigurationsContent(w_id) {
        return await axios.get("/api/widgets/"+ w_id)
            .then((res) => {
                //transform JIRA widget content
                let configsContent = JSON.parse(res.data.w_content);
                //configurations are empty
                if (!configsContent["DUTY"] && configsContent["ISSUETYPES"].length === 0 && configsContent["STATUSES"].length === 0 && configsContent["PRIORITIES"].length === 0) {
                    setShowConfigurations(true);
                    return configsContent;
                } else {
                    setShowConfigurations(false);
                    setAssignedOrMentioned(configsContent["DUTY"]);
                    setTicketTypes(configsContent["ISSUETYPES"]);
                    setTicketStatuses(configsContent["STATUSES"]);
                    setPriorities(configsContent["PRIORITIES"]);
                }
                return configsContent;
            })
            .catch((err) => console.log(err));
    }

    async function fetchJiraTickets(apiToken, domain, email, duty, types, statuses, priorities) {
        const encodedEmail = email.replace("@", "\\u0040");
        
        const jqlParams = initializeJQLquery(encodedEmail, duty, types, statuses, priorities);
        const postBody = {
            uri: `${domain}/rest/api/3/search`,
            email: email,
            api_token: apiToken,
            jql_querystring: jqlParams
        };
        await axios.post("/api/proxy/jira", postBody)
            .then(response => {
                console.log("JIRA tickets res list: ", response.data.data.issues);
                console.log("JIRA ticket res status: ", response.status);
                if (response.status === 200) {
                    setJiraSearchError({code: 200})
                }
                return response.data.data.issues;
            })
            .then(issues => {
                setTickets(issues);
            })
            .catch(error => {
                console.log(error);
                const errMsgList = [ error.response.status === 400 ? "Bad Request! Please check your credentials" : error.message ];
                if (!error.response.data.success) {
                    errMsgList.push("Status from JIRA=>> "+error.response.data.message);
                }
                setJiraSearchError({
                    code: error.response.status,
                    errMessages: errMsgList
                });
            });

        // await axios.get(`https://${domain}/rest/api/3/search`, { headers, params: jqlParams })
        //     .then(response => {
        //         console.log("JIRA response: ", response.data.issues);
        //         if (response.status === 200) setJiraRequestError({code: response.status});
        //         return response.data.issues;
        //     }).then(issues => {
        //         setTickets(issues);
        //     })
        //     .catch(error => {
        //         console.log(error);
        //         const msgList = error.response.data.errorMessages ?? [error.response.data];
        //         error.response.data.warningMessages.length !== 0 && msgList.push(error.response.data.warningMessages);
        //         setJiraRequestError({
        //             code: error.response.status,
        //             errMessages: msgList
        //         });
        //     });
    }

    // Below is a cleaner way to do the above initializeJQLquery() method
    function initializeJQLquery(encodedEmail, duty, ticketTypes, statuses, priorities) {
        console.log("initializeJQLquery() called...", duty, ticketTypes, statuses, priorities);
        let jqlQuery = "";
        if (duty === "assigned") {
            //console.log("JQL duty is: ASSIGNED");
            jqlQuery = `assignee=${encodedEmail}`;
        } else if (duty === "mentioned") {
            //console.log("JQL duty is: MENTIONED");
            jqlQuery = `text ~ ${encodedEmail}`;
        } else {
            console.log("fetching all tickets from Jira...");
        }

        const params = [
            {name: "issuetype", value: ticketTypes},
            {name: "status", value: statuses},
            {name: "priority", value: priorities}
        ];

        params.forEach(param => {
            if (param.value.length > 0) {
                jqlQuery += ` and ${param.name} in ("${param.value.join("\",\"")}")`;
            }
        });

        return {jql: jqlQuery};
    }

    function toggleShowConfigurations() {
        setShowConfigurations(!showConfigurations);
    }

    return (
        <div className="w_overflowable">
            <button type="button" className="link-button" onClick={toggleShowConfigurations}>Configs</button>
            {
                showConfigurations && (
                    <JiraConfigurations 
                        widget={widget}
                        sendContentToParent={sendContentToParent}
                        assignedOrMentioned={assignedOrMentioned}
                        setAssignedOrMentioned={setAssignedOrMentioned}
                        ticketTypes={ticketTypes}
                        setTicketTypes={setTicketTypes}
                        ticketStatuses={ticketStatuses}
                        setTicketStatuses={setTicketStatuses}
                        priorities={priorities}
                        setPriorities={setPriorities}
                        axios={axios}
                        isConfigsChanged={isConfigsChanged}
                        setJiraPriorityErrors={setJiraPriorityErrors}/>
                )
            }
            {
                tickets.length !== 0 ? <JiraIssuesTable issues={tickets} jiraDomain={localStorage.getItem("jira_domain")}/> : (
                    <div>
                        <h3>NO TICKETS FOUND!</h3>
                    </div>
                )
            }
            {
                (jiraSearchtError.code === 0 || jiraPriorityErrors.code === 0) && (
                    <div style={{ display: "flex", justifyContent: "center"}}>
                        <div className="loader"></div>
                    </div>
                )
            }
            { 
                jiraSearchtError.code !== 200 && jiraSearchtError.code !== 0 &&
                (
                    <div>
                        <h4 style={{ color: "red" }}>JIRA Search request failed with Status: {jiraSearchtError.code}</h4>
                        <ul>
                            {
                                jiraSearchtError.errMessages?.map((message, index) => <li key={index}>{message}</li>) 
                            }
                        </ul>
                    </div>
                )
            }
            {
                jiraPriorityErrors.code !== 200 && jiraPriorityErrors.code !== 0 &&
                (
                    <div>
                        <h4 style={{ color: "red" }}>JIRA Priority request failed with Status: {jiraPriorityErrors.code}</h4>
                        <ul>
                            {
                                jiraPriorityErrors.errMessages?.map((message, index) => <li key={index}>{message}</li>) 
                            }
                        </ul>
                    </div>
                )
            }
        </div>
    );
}

export default JiraTicket;


function JiraConfigurations(props) 
{
    const [configsContentObj, setConfigsContentObj] = useState({
        DUTY: props.assignedOrMentioned,
        ISSUETYPES: props.ticketTypes,
        STATUSES: props.ticketStatuses,
        PRIORITIES: props.priorities
    });
    const [jiraWidget, setJiraWidget] = useState({});
    const [priorityOptions, setPriorityOptions] = useState([]);
    const axios = props.axios;
    const jira_token_uri = "https://id.atlassian.com/manage-profile/security/api-tokens";

    useEffect(() => {
        async function fetchPriorities() {
            const apiToken = localStorage.getItem("jira_token");
            const domain = localStorage.getItem("jira_domain");
            const email = localStorage.getItem("jira_user_id");
            // const headers = {
            //     "Content-Type": "application/json",
            //     "Authorization": `Basic ${btoa(`${email}:${apiToken}`)}`
            // };
            // await axios.get(`https://${domain}/rest/api/3/priority/search`, { headers })
            //     .then(response => {
            //         if (response.status === 200) {
            //             let priorityOptions = response.data.values.map(prio => {
            //                 return { id: prio.id, name: prio.name };
            //             });
            //             setPriorityOptions(priorityOptions);
            //         }
            //     })
            //     .catch(error => console.log(error));
            const postBody = {
                uri: `${domain}/rest/api/3/priority/search`,
                email: email,
                api_token: apiToken
            }
            await axios.post("/api/proxy/jira", postBody)
                .then(response => {
                    console.log("Jira Prirorities: ", response);
                    if (response.status === 200) {
                        let priorityOptions = response.data.data.values.map(prio => {
                            return { id: prio.id, name: prio.name };
                        });
                        setPriorityOptions(priorityOptions);
                        props.setJiraPriorityErrors({ code: 200 });
                    }
                })
                .catch(error => {
                    console.log(error);
                    const errMsgList = [ error.response.status === 400 ? "Bad Request! Please check your credentials" : error.message ];
                    if (!error.response.data.success) {
                        errMsgList.push("Status from JIRA=>> "+error.response.data.message);
                    }
                    props.setJiraPriorityErrors({
                        code: error.response.status,
                        errMessages: errMsgList
                    });
                });
        }

        setJiraWidget(props.widget);
        fetchPriorities();
        $(`#save-btn-${props.widget.id}`).hide();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [axios, props.widget, props.isConfigsChanged]);
    

    function handleDutyChange(changeEvent) {
        $(`#save-btn-${props.widget.id}`).show();
        props.setAssignedOrMentioned(changeEvent.target.value);
        configsContentObj.DUTY = changeEvent.target.value;

        configsContentObj.ISSUETYPES = props.ticketTypes;
        configsContentObj.STATUSES = props.ticketStatuses;
        configsContentObj.PRIORITIES = props.priorities;
        setConfigsContentObj(configsContentObj);
        sendContentToParent();
    }

    function handleTicketTypeChange(changeEvent) {
        $(`#save-btn-${props.widget.id}`).show();
        let options = [...props.ticketTypes];
        if (changeEvent.target.checked) {
            options.push(changeEvent.target.value);
        } else {
            options = options.filter(o => o !== changeEvent.target.value);
        }
        props.setTicketTypes(options);
        configsContentObj.ISSUETYPES = options;

        configsContentObj.DUTY = props.assignedOrMentioned;
        configsContentObj.STATUSES = props.ticketStatuses;
        configsContentObj.PRIORITIES = props.priorities;
        setConfigsContentObj(configsContentObj);
        sendContentToParent();
    }

    function handleStatusChange(changeEvent) {
        $(`#save-btn-${props.widget.id}`).show();
        let options = [...props.ticketStatuses];
        if(changeEvent.target.checked) {
            options.push(changeEvent.target.value);
        } else {
            options = options.filter(o => o !== changeEvent.target.value);
        }
        props.setTicketStatuses(options);
        configsContentObj.STATUSES = options;

        configsContentObj.DUTY = props.assignedOrMentioned;
        configsContentObj.ISSUETYPES = props.ticketTypes;
        configsContentObj.PRIORITIES = props.priorities;
        setConfigsContentObj(configsContentObj);
        sendContentToParent();
    }

    function handlePriorityChange(changeEvent) {
        $(`#save-btn-${props.widget.id}`).show();
        let options = [...props.priorities];
        if(changeEvent.target.checked) {
            options.push(changeEvent.target.value);
        } else {
            options = options.filter(o => o !== changeEvent.target.value);
        }
        props.setPriorities(options);
        configsContentObj.PRIORITIES = options;

        configsContentObj.DUTY = props.assignedOrMentioned;
        configsContentObj.ISSUETYPES = props.ticketTypes;
        configsContentObj.STATUSES = props.ticketStatuses;
        setConfigsContentObj(configsContentObj);
        sendContentToParent();
    }

    function sendContentToParent() {
        const putBody = {
            ...jiraWidget,
            w_content: JSON.stringify(configsContentObj)
        }
        props.sendContentToParent(putBody, null, null);
    }

    return (
        <div>
            <div>
                <h3>Atlassian API Credentials (Jira &amp; Confluence)</h3>
                <p>
                    You can create a token in Atlassian Cloud
                    <a href={jira_token_uri} target="_blank" rel="noreferrer"> here</a>
                </p>
                <JiraCredentials 
                    sendContentToDevityPanels={sendContentToParent} 
                    widgetId={props.widget.id}/>
            </div>
            <form>
                <div className="duty">
                    <label>
                        <input 
                            type="radio" 
                            value="assigned" 
                            checked={props.assignedOrMentioned === "assigned"}
                            onChange={handleDutyChange}
                        />
                        Your Assigned Tickets
                    </label>
                    <label>
                        <input 
                            type="radio" 
                            value="mentioned" 
                            checked={props.assignedOrMentioned === "mentioned"}
                            onChange={handleDutyChange}
                        />
                        Your Mentioned Tickets
                    </label>
                </div>
                <h4>Jira Ticket Type</h4>
                <div className="jira-ticket-type">
                    <label>
                        <input 
                            type="checkbox" 
                            value="Task" 
                            checked={props.ticketTypes.includes("Task")}
                            onChange={handleTicketTypeChange}
                        />
                        Task
                    </label>
                    <br />
                    <label>
                        <input 
                            type="checkbox" 
                            value="Bug" 
                            checked={props.ticketTypes.includes("Bug")}
                            onChange={handleTicketTypeChange}
                        />
                        Bug
                    </label>
                    <br />
                    <label>
                        <input 
                            type="checkbox" 
                            value="Story" 
                            checked={props.ticketTypes.includes("Story")}
                            onChange={handleTicketTypeChange}
                        />
                        Story
                    </label>
                    <br />
                    <label>
                        <input 
                            type="checkbox" 
                            value="Epic" 
                            checked={props.ticketTypes.includes("Epic")}
                            onChange={handleTicketTypeChange}
                        />
                        Epic
                    </label>
                </div>
                <h4>Ticket Status</h4>
                <div className="ticket-statuses">
                    <label>
                        <input 
                            type="checkbox" 
                            value="Backlog" 
                            checked={props.ticketStatuses.includes("Backlog")}
                            onChange={handleStatusChange}
                        />
                        Backlog
                    </label>
                    <br />
                    <label>
                        <input 
                            type="checkbox" 
                            value="Selected for Development" 
                            checked={props.ticketStatuses.includes("Selected for Development")}
                            onChange={handleStatusChange}
                        />
                        Selected For Development
                    </label>
                    <br />
                    <label>
                        <input 
                            type="checkbox" 
                            value="In Progress" 
                            checked={props.ticketStatuses.includes("In Progress")}
                            onChange={handleStatusChange}
                        />
                        In Progress
                    </label>
                    <br />
                    <label>
                        <input 
                            type="checkbox" 
                            value="Done" 
                            checked={props.ticketStatuses.includes("Done")}
                            onChange={handleStatusChange}
                        />
                        Done
                    </label>
                </div>
                <h4>Ticket priorities</h4>
                <div className="ticket-priorities">
                    {
                        priorityOptions.length !== 0 && priorityOptions && priorityOptions.map(option => (
                            <div key={option.id}>
                                <label>
                                    <input 
                                        type="checkbox" 
                                        value={option.name} 
                                        checked={props.priorities.includes(option.name)}
                                        onChange={handlePriorityChange}
                                    />
                                    {option.name}
                                </label>
                                <br />
                            </div>
                        ))
                    }
                </div>
            </form>
        </div>
        
    );
}


function JiraIssuesTable({ issues, jiraDomain }) 
{
    useEffect(() => {
    }, []);

    function formatDate(jsonDateTime) {
        const date = new Date(jsonDateTime);
        const month = date.toLocaleString("en-US", { month: "short" });
        const day = date.getDate();
        const year = date.getFullYear();
        return `${month}-${day}-${year}`;
    }

    return (
        <table className="issue-horizontal">
            <thead className="issue-horizontal">
                <tr>
                    <th>Key</th>
                    <th>Summary</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Reporter</th>
                    <th>Resolution</th>
                    <th>Created</th>
                    <th>Updated</th>
                    <th>Due</th>
                </tr>
            </thead>
            <tbody className="issue-horizontal">
                {
                    issues.map((issue) => (
                        <tr key={issue.id}>
                            <td>{issue.key}</td>
                            <td>
                                <a href={`https://${jiraDomain}/browse/${issue.key}`} target="_blank" rel="noreferrer">{issue.fields.summary}</a>
                            </td>
                            <td>{issue.fields.issuetype.name}</td>
                            <td>{issue.fields.status.name}</td>
                            <td>{issue.fields.priority.name}</td>
                            <td>{issue.fields.reporter.displayName}</td>
                            <td>{issue.fields.resolution ? issue.fields.resolution.name : "Unresolved"}</td>
                            <td>{formatDate(issue.fields.created)}</td>
                            <td>{formatDate(issue.fields.updated)}</td>
                            <td>{issue.fields.duedate ? formatDate(issue.fields.duedate) : ""}</td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
    );
}
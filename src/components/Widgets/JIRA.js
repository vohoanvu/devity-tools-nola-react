import React, { useState, useEffect } from "react";
import axios from "axios";
import CONFIG from "../../config.json";
import "../../css/App.css";
import $ from "jquery";
const sso_url = CONFIG.SSO_URL;
const devity_api = CONFIG.DEVITY_API;

const JiraTicket = ({ widget, sendContentToParent, activePanel, isConfigsChanged }) => {
    const [tickets, setTickets] = useState([]);
    const [assignedOrMentioned, setAssignedOrMentioned] = useState("");
    const [ticketTypes, setTicketTypes] = useState([]);
    const [ticketStatuses, setTicketStatuses] = useState([]);
    const [priorities, setPriorities] = useState([]);
    const [showConfigurations, setShowConfigurations] = useState(true);
    const [jiraRequestError, setJiraRequestError] = useState({
        code: 0,
        errMessages: []
    });

    useEffect(() => {
        if (activePanel && activePanel !== "DEVITY") return;

        getJiraConfigurationsContent(widget.id).then(configs => {

            const apiToken = localStorage.getItem("jira_token");
            const domain = localStorage.getItem("jira_domain");
            const email = localStorage.getItem("jira_user_id");
        
            if (apiToken && domain && email) {
                fetchJiraTickets(apiToken, domain, email, configs["duty"], configs["issueTypes"], configs["statuses"], configs["priorities"]);
            } else {
                setJiraRequestError({
                    code: 401,
                    errMessages: ["Missing JIRA credentials. Please fill out Jira credentials in Profile"]
                });
                setTickets([]);
            }
        });
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isConfigsChanged, activePanel, widget.id]);

    async function fetchJiraTickets(apiToken, domain, email, duty, types, statuses, priorities) {
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Basic ${btoa(`${email}:${apiToken}`)}`
        };
        const encodedEmail = email.replace("@", "\\u0040");
        
        const jqlParams = initializeJQLquery(encodedEmail, duty, types, statuses, priorities);

        await axios.get(`https://${domain}/rest/api/3/search`, { headers, params: jqlParams })
            .then(response => {
                console.log("JIRA response: ", response.data.issues);
                if (response.status === 200) setJiraRequestError({code: response.status});
                return response.data.issues;
            }).then(issues => {
                setTickets(issues);
            })
            .catch(error => {
                console.log(error);
                const msgList = error.response.data.errorMessages ?? [error.response.data];
                error.response.data.warningMessages.length !== 0 && msgList.push(error.response.data.warningMessages);
                setJiraRequestError({
                    code: error.response.status,
                    errMessages: msgList
                });
            });
    }

    async function getJiraConfigurationsContent(w_id) {
        return await axios.get(devity_api + "/api/widgets/"+ w_id)
            .then((res) => {
                if (res.status === 401) window.location.replace(sso_url);
                //console.log("Get JIRA widget");
                //console.log(res.data);
                return res.data;
            }).then(result => {
                //transform JIRA widget content
                let configsContent = JSON.parse(result.w_content);
                console.log("JIRA widget content: ", configsContent);
                //configurations are empty
                if (!configsContent["duty"] && configsContent["issueTypes"].length === 0 && configsContent["statuses"].length === 0 && configsContent["priorities"].length === 0) {
                    setShowConfigurations(true);
                    return configsContent;
                } else {
                    setShowConfigurations(false);
                    setAssignedOrMentioned(configsContent["duty"]);
                    setTicketTypes(configsContent["issueTypes"]);
                    setTicketStatuses(configsContent["statuses"]);
                    setPriorities(configsContent["priorities"]);
                }
                return configsContent;
            })
            .catch((err) => console.log(err));
    }

    // function initializeJQLquery(encodedEmail) {
    //     var jqlParams = {
    //         jql: `assignee=${encodedEmail}`
    //     };
    //     const ticketTypesString = ticketTypes.join("\",\"");
    //     const ticketStatusesString = ticketStatuses.join("\",\"");
    //     const ticketPrioritiesString = priorities.join("\",\"");
    //     //Assigned Only Tickets
    //     if (assignedOrMentioned === "assigned" && ticketTypesString.length > 0 && ticketStatusesString.length > 0 && ticketPrioritiesString.length > 0) {
    //         jqlParams.jql += ` and issuetype in (${ticketTypesString}) and status in ("${ticketStatusesString}") and priority in ("${ticketPrioritiesString}")`;
    //     }

    //     if (assignedOrMentioned === "assigned" && ticketTypesString.length > 0 && ticketStatusesString.length > 0 && ticketPrioritiesString.length === 0) {
    //         jqlParams.jql += ` and issuetype in ("${ticketTypesString}") and status in ("${ticketStatusesString}")`;
    //     }

    //     if (assignedOrMentioned === "assigned" && ticketTypesString.length > 0 && ticketStatusesString.length === 0 && ticketPrioritiesString.length > 0) {
    //         jqlParams.jql += ` and issuetype in ("${ticketTypesString}") and priority in ("${ticketPrioritiesString}")`;
    //     }

    //     if (assignedOrMentioned === "assigned" && ticketTypesString.length === 0 && ticketStatusesString.length > 0 && ticketPrioritiesString.length > 0) {
    //         jqlParams.jql += ` and status in ("${ticketStatusesString}") and priority in ("${ticketPrioritiesString}")`;
    //     }

    //     if (assignedOrMentioned === "assigned" && ticketTypesString.length > 0 && ticketStatusesString.length === 0 && ticketPrioritiesString.length === 0) {
    //         jqlParams.jql += ` and issuetype in ("${ticketTypesString}")`;
    //     }

    //     if (assignedOrMentioned === "assigned" && ticketTypesString.length === 0 && ticketStatusesString.length > 0 && ticketPrioritiesString.length === 0) {
    //         jqlParams.jql += ` and status in ("${ticketStatusesString}")`;
    //     }

    //     if (assignedOrMentioned === "assigned" && ticketTypesString.length === 0 && ticketStatusesString.length === 0 && ticketPrioritiesString.length > 0) {
    //         jqlParams.jql += ` and priority in ("${ticketPrioritiesString}")`;
    //     }


    //     //Mentioned Only Tickets
    //     if (assignedOrMentioned === "mentioned" && ticketTypesString.length > 0 && ticketStatusesString.length > 0 && ticketPrioritiesString.length > 0) {
    //         jqlParams.jql = `text ~ ${encodedEmail} and issuetype in (${ticketTypesString}) and status in ("${ticketStatusesString}") and priority in ("${ticketPrioritiesString}")`;
    //     }

    //     if (assignedOrMentioned === "mentioned" && ticketTypesString.length > 0 && ticketStatusesString.length > 0 && ticketPrioritiesString.length === 0) {
    //         jqlParams.jql = `text ~ ${encodedEmail} and issuetype in ("${ticketTypesString}") and status in ("${ticketStatusesString}")`;
    //     }

    //     if (assignedOrMentioned === "mentioned" && ticketTypesString.length > 0 && ticketStatusesString.length === 0 && ticketPrioritiesString.length > 0) {
    //         jqlParams.jql = `text ~ ${encodedEmail} and issuetype in ("${ticketTypesString}") and priority in ("${ticketPrioritiesString}")`;
    //     }

    //     if (assignedOrMentioned === "mentioned" && ticketTypesString.length === 0 && ticketStatusesString.length > 0 && ticketPrioritiesString.length > 0) {
    //         jqlParams.jql = `text ~ ${encodedEmail} and status in ("${ticketStatusesString}") and priority in ("${ticketPrioritiesString}")`;
    //     }

    //     if (assignedOrMentioned === "mentioned" && ticketTypesString.length > 0 && ticketStatusesString.length === 0 && ticketPrioritiesString.length === 0) {
    //         jqlParams.jql = `text ~ ${encodedEmail} and issuetype in (${ticketTypesString})`;
    //     } 

    //     if (assignedOrMentioned === "mentioned" && ticketTypesString.length === 0 && ticketStatusesString.length > 0 && ticketPrioritiesString.length === 0) {
    //         jqlParams.jql = `text ~ ${encodedEmail} and status in ("${ticketStatusesString}")`;
    //     }

    //     if (assignedOrMentioned === "mentioned" && ticketTypesString.length === 0 && ticketStatusesString.length === 0 && ticketPrioritiesString.length > 0) {
    //         jqlParams.jql = `text ~ ${encodedEmail} and priority in ("${ticketPrioritiesString}")`;
    //     }

    //     if (assignedOrMentioned === "mentioned" && ticketTypesString.length === 0 && ticketStatusesString.length === 0 && ticketPrioritiesString.length === 0) {
    //         jqlParams.jql = `text ~ ${encodedEmail}`;
    //     }

    //     return jqlParams;
    // }



    // Below is a cleaner way to do the above initializeJQLquery() method, but its not yet tested
    function initializeJQLquery(encodedEmail, duty, ticketTypes, statuses, priorities) {
        console.log("initializeJQLquery() called...", duty, ticketTypes, statuses, priorities);
        let jqlQuery = "";
        if (duty === "assigned") {
            console.log("JQL duty is: ASSIGNED");
            jqlQuery = `assignee=${encodedEmail}`;
        } else if (duty === "mentioned") {
            console.log("JQL duty is: MENTIONED");
            jqlQuery = `text ~ ${encodedEmail}`;
        } else {
            console.log("ERROR: JQL duty is neither assigned nor mentioned...");
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
                        setPriorities={setPriorities}/>
                )
            }
            {
                tickets.length !== 0 ? <JiraIssuesTable issues={tickets} jiraDomain={localStorage.getItem("jira_domain")}/> : 
                    (
                        <div> 
                            <h3>No tickets found!</h3>
                        </div>
                    )
            }
            { 
                jiraRequestError.code !== 200 && 
                (
                    <div>
                        <h4 style={{ color: "red" }}>JIRA request failed with Status: {jiraRequestError.code}</h4>
                        <ul>
                            {
                                jiraRequestError.errMessages?.map((message, index) => <li key={index}>{message}</li>) 
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
        duty: "",
        issueTypes: [],
        statuses: [],
        priorities: []
    });
    const [jiraWidget, setJiraWidget] = useState({});
    const [priorityOptions, setPriorityOptions] = useState([]);

    useEffect(() => {
        async function fetchPriorities() {
            const apiToken = localStorage.getItem("jira_token");
            const domain = localStorage.getItem("jira_domain");
            const email = localStorage.getItem("jira_user_id");
            const headers = {
                "Content-Type": "application/json",
                "Authorization": `Basic ${btoa(`${email}:${apiToken}`)}`
            };
            await axios.get(`https://${domain}/rest/api/3/priority/search`, { headers })
                .then(response => {
                    if (response.status === 200) {
                        let priorityOptions = response.data.values.map(prio => {
                            return { id: prio.id, name: prio.name };
                        });
                        setPriorityOptions(priorityOptions);
                    }
                })
                .catch(error => console.log(error));
        }

        setJiraWidget(props.widget);
        fetchPriorities();
    }, [props.widget]);
    

    function handleDutyChange(changeEvent) {
        $(`#save-btn-${props.widget.id}`).show();
        props.setAssignedOrMentioned(changeEvent.target.value);
        configsContentObj.duty = changeEvent.target.value;

        configsContentObj.issueTypes = props.ticketTypes;
        configsContentObj.statuses = props.ticketStatuses;
        configsContentObj.priorities = props.priorities;
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
        configsContentObj.issueTypes = options;

        configsContentObj.duty = props.assignedOrMentioned;
        configsContentObj.statuses = props.ticketStatuses;
        configsContentObj.priorities = props.priorities;
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
        configsContentObj.statuses = options;

        configsContentObj.duty = props.assignedOrMentioned;
        configsContentObj.issueTypes = props.ticketTypes;
        configsContentObj.priorities = props.priorities;
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
        configsContentObj.priorities = options;

        configsContentObj.duty = props.assignedOrMentioned;
        configsContentObj.issueTypes = props.ticketTypes;
        configsContentObj.statuses = props.ticketStatuses;
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
                    {/* <label>
                        <input 
                            type="checkbox" 
                            value="Highest" 
                            checked={props.priorities.includes("Highest")}
                            onChange={handlePriorityChange}
                        />
                        Highest
                    </label>
                    <br />
                    <label>
                        <input 
                            type="checkbox" 
                            value="High" 
                            checked={props.priorities.includes("High")}
                            onChange={handlePriorityChange}
                        />
                        High
                    </label>
                    <br />
                    <label>
                        <input 
                            type="checkbox" 
                            value="Medium" 
                            checked={props.priorities.includes("Medium")}
                            onChange={handlePriorityChange}
                        />
                        Medium
                    </label>
                    <br />
                    <label>
                        <input 
                            type="checkbox" 
                            value="Low" 
                            checked={props.priorities.includes("Low")}
                            onChange={handlePriorityChange}
                        />
                        Low
                    </label>
                    <br />
                    <label>
                        <input 
                            type="checkbox" 
                            value="Lowest" 
                            checked={props.priorities.includes("Lowest")}
                            onChange={handlePriorityChange}
                        />
                        Lowest
                    </label> */}
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
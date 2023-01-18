import React, { useState, useEffect } from "react";
import axios from "axios";
import JiraConfigurations from "./JiraConfigurationsForm";
import JiraIssueTable from "./JiraIssueTable";
import CONFIG from "../../config.json";
import "../../css/App.css";
const sso_url = CONFIG.SSO_URL;
const devity_api = CONFIG.DEVITY_API;

const JiraTicket = ({ widget, sendContentToParent, activePanel, isConfigsChanged }) => {
    const [tickets, setTickets] = useState([]);
    const [assignedOrMentioned, setAssignedOrMentioned] = useState("");
    const [ticketTypes, setTicketTypes] = useState([]);
    const [ticketStatuses, setTicketStatuses] = useState([]);
    const [priorities, setPriorities] = useState([]);
    const [showConfigurations, setShowConfigurations] = useState(true);

    useEffect(() => {
        if ((activePanel && activePanel !== "DEVITY") || (activePanel === "DEVITY" && tickets.length !== 0)) return;

        getJiraConfigurationsContent(widget.id).then(configs => {

            const apiToken = localStorage.getItem("jira_token");
            const domain = localStorage.getItem("jira_domain");
            const email = localStorage.getItem("jira_user_id");
        
            if (apiToken && domain && email) {
                fetchJiraTickets(apiToken, domain, email, configs["duty"], configs["issueTypes"], configs["statuses"], configs["priorities"]);
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
                return response.data.issues;
            }).then(issues => {
                setTickets(issues);
            })
            .catch(error => {
                console.log(error);
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
                //configurations are empty
                if (!configsContent["duty"] && configsContent["issueTypes"].length === 0 && configsContent["statuses"].length === 0 && configsContent["priorities"].length === 0) {
                    setShowConfigurations(true);
                    console.log("Are we here... ", configsContent);
                    return;
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
            console.log("Error: JQL duty is not assigned nor mentioned...");
            jqlQuery = `assignee=${encodedEmail} or text ~ ${encodedEmail}`;
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
                tickets.length !== 0 ? <JiraIssueTable issues={tickets} jiraDomain={localStorage.getItem("jira_domain")}/> : 
                    (
                        <div> 
                            <h3>No tickets found! Please fill out JIRA credentials in Profile OR Jira Configurations above</h3>
                        </div>
                    )
            }
        </div>
    );
}

export default JiraTicket;
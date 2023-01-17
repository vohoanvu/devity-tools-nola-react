import React, { useState, useEffect } from "react";
import axios from "axios";
import JiraConfigurations from "./JiraConfigurations";
import JiraIssueTable from "./JiraIssueTable";
import $ from "jquery";

const JiraTicket = ({ apiToken, domain, email, widgetId}) => {
    const [tickets, setTickets] = useState([]);
    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Basic ${btoa(`${email}:${apiToken}`)}`
    };
    const [assignedOrMentioned, setAssignedOrMentioned] = useState("assigned");
    const [ticketTypes, setTicketTypes] = useState([]);
    const [ticketStatuses, setTicketStatuses] = useState([]);
    const [priorities, setPriorities] = useState([]);

    useEffect(() => {
        if (apiToken && domain && email) {
            fetchJiraTickets();
        }
        $(`#save-btn-${widgetId}`).hide();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [apiToken, domain, email, assignedOrMentioned, ticketTypes, ticketStatuses, priorities]);

    async function fetchJiraTickets() {
        const encodedEmail = email.replace("@", "\\u0040");
        
        const jqlParams = initializeJQLquery(encodedEmail);

        await axios.get(`https://${domain}/rest/api/3/search`, { headers, params: jqlParams })
            .then(response => {
                console.log("JIRA response: ", response.data.issues);
                setTickets(response.data.issues);
            })
            .catch(error => {
                console.log(error);
            });
    }

    function initializeJQLquery(encodedEmail) {
        var jqlParams = {
            jql: `assignee=${encodedEmail}`
        };
        const ticketTypesString = ticketTypes.join("\",\"");
        const ticketStatusesString = ticketStatuses.join("\",\"");
        const ticketPrioritiesString = priorities.join("\",\"");
        //Assigned Only Tickets
        if (assignedOrMentioned === "assigned" && ticketTypesString.length > 0 && ticketStatusesString.length > 0 && ticketPrioritiesString.length > 0) {
            jqlParams.jql += `and issuetype in (${ticketTypesString}) and status in ("${ticketStatusesString}") and priority in ("${ticketPrioritiesString}")`;
        }

        if (assignedOrMentioned === "assigned" && ticketTypesString.length > 0 && ticketStatusesString.length > 0 && ticketPrioritiesString.length === 0) {
            jqlParams.jql += ` and issuetype in ("${ticketTypesString}") and status in ("${ticketStatusesString}")`;
        }

        if (assignedOrMentioned === "assigned" && ticketTypesString.length > 0 && ticketStatusesString.length === 0 && ticketPrioritiesString.length > 0) {
            jqlParams.jql += ` and issuetype in ("${ticketTypesString}") and priority in ("${ticketPrioritiesString}")`;
        }

        if (assignedOrMentioned === "assigned" && ticketTypesString.length === 0 && ticketStatusesString.length > 0 && ticketPrioritiesString.length > 0) {
            jqlParams.jql += ` and status in ("${ticketStatusesString}") and priority in ("${ticketPrioritiesString}")`;
        }

        if (assignedOrMentioned === "assigned" && ticketTypesString.length > 0 && ticketStatusesString.length === 0 && ticketPrioritiesString.length === 0) {
            jqlParams.jql += ` and issuetype in ("${ticketTypesString}")`;
        }

        if (assignedOrMentioned === "assigned" && ticketTypesString.length === 0 && ticketStatusesString.length > 0 && ticketPrioritiesString.length === 0) {
            jqlParams.jql += ` and status in ("${ticketStatusesString}")`;
        }

        if (assignedOrMentioned === "assigned" && ticketTypesString.length === 0 && ticketStatusesString.length === 0 && ticketPrioritiesString.length > 0) {
            jqlParams.jql += ` and priority in ("${ticketPrioritiesString}")`;
        }


        //Mentioned Only Tickets
        if (assignedOrMentioned === "mentioned" && ticketTypesString.length > 0 && ticketStatusesString.length > 0 && ticketPrioritiesString.length > 0) {
            jqlParams.jql = `text ~ ${encodedEmail} and issuetype in (${ticketTypesString}) and status in ("${ticketStatusesString}") and priority in ("${ticketPrioritiesString}")`;
        }

        if (assignedOrMentioned === "mentioned" && ticketTypesString.length > 0 && ticketStatusesString.length > 0 && ticketPrioritiesString.length === 0) {
            jqlParams.jql = `text ~ ${encodedEmail} and issuetype in ("${ticketTypesString}") and status in ("${ticketStatusesString}")`;
        }

        if (assignedOrMentioned === "mentioned" && ticketTypesString.length > 0 && ticketStatusesString.length === 0 && ticketPrioritiesString.length > 0) {
            jqlParams.jql = `text ~ ${encodedEmail} and issuetype in ("${ticketTypesString}") and priority in ("${ticketPrioritiesString}")`;
        }

        if (assignedOrMentioned === "mentioned" && ticketTypesString.length === 0 && ticketStatusesString.length > 0 && ticketPrioritiesString.length > 0) {
            jqlParams.jql = `text ~ ${encodedEmail} and status in ("${ticketStatusesString}") and priority in ("${ticketPrioritiesString}")`;
        }

        if (assignedOrMentioned === "mentioned" && ticketTypesString.length > 0 && ticketStatusesString.length === 0 && ticketPrioritiesString.length === 0) {
            jqlParams.jql = `text ~ ${encodedEmail} and issuetype in (${ticketTypesString})`;
        } 

        if (assignedOrMentioned === "mentioned" && ticketTypesString.length === 0 && ticketStatusesString.length > 0 && ticketPrioritiesString.length === 0) {
            jqlParams.jql = `text ~ ${encodedEmail} and status in ("${ticketStatusesString}")`;
        }

        if (assignedOrMentioned === "mentioned" && ticketTypesString.length === 0 && ticketStatusesString.length === 0 && ticketPrioritiesString.length > 0) {
            jqlParams.jql = `text ~ ${encodedEmail} and priority in ("${ticketPrioritiesString}")`;
        }

        if (assignedOrMentioned === "mentioned" && ticketTypesString.length === 0 && ticketStatusesString.length === 0 && ticketPrioritiesString.length === 0) {
            jqlParams.jql = `text ~ ${encodedEmail}`;
        }

        return jqlParams;
    }

    // Below is a cleaner way to do the above initializeJQLquery() method, but its not yet tested
    /*function initializeJQLquery(encodedEmail) {
        let jqlQuery = assignedOrMentioned === "assigned" ? `assignee=${encodedEmail}` : `text ~ ${encodedEmail}`;

        const params = [
            {name: "issuetype", value: ticketTypes},
            {name: "status", value: ticketStatuses},
            {name: "priority", value: priorities}
        ];

        params.forEach(param => {
            if (param.value.length > 0) {
                jqlQuery += ` and ${param.name} in ("${param.value.join("\",\"")}")`;
            }
        });

        return {jql: jqlQuery};
    }*/

    return (
        <div className="w_overflowable">
            <JiraConfigurations 
                assignedOrMentioned={assignedOrMentioned}
                setAssignedOrMentioned={setAssignedOrMentioned}
                ticketTypes={ticketTypes}
                setTicketTypes={setTicketTypes}
                ticketStatuses={ticketStatuses}
                setTicketStatuses={setTicketStatuses}
                priorities={priorities}
                setPriorities={setPriorities}
            />
            {
                tickets.length !== 0 ? <JiraIssueTable issues={tickets} jiraDomain={domain}/> : 
                    (
                        <div> 
                            <h3>No tickets found! Please fill out JIRA credentials in Profile</h3>
                        </div>
                    )
            }
        </div>
    );
}

export default JiraTicket;
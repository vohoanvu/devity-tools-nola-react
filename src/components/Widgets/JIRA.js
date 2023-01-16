import React, { useState, useEffect } from "react";
import axios from "axios";
import JiraConfigurations from "./JiraConfigurations";

const JiraTicket = ({ apiToken, domain, email}) => {
    const [tickets, setTickets] = useState([]);
    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Basic ${btoa(`${email}:${apiToken}`)}`
    };
    const [assignedOrMentioned, setAssignedOrMentioned] = useState("assigned");
    const [ticketTypes, setTicketTypes] = useState([]);

    useEffect(() => {
        if (apiToken && domain && email) {
            fetchJiraTickets();
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [apiToken, domain, email, assignedOrMentioned]);

    async function fetchJiraTickets() {
        const encodedEmail = email ? email.replace("@", "\\u0040") : "";
        const jiraUrl = domain ?? "devity-tools.atlassian.net";
        var jqlParams = {};
        const ticketTypesString = ticketTypes.join("\",\"");
        if (assignedOrMentioned === "assigned" && ticketTypesString.length > 0) {
            jqlParams = {
                jql: `assignee=${encodedEmail} and issuetype in ("${ticketTypesString}")`
            };
        } else if (assignedOrMentioned === "mentioned" && ticketTypesString.length > 0) {
            jqlParams = {
                jql: `text ~ ${encodedEmail} and issuetype in (${ticketTypesString})`,
            };
        } else if (ticketTypesString.length === 0 && assignedOrMentioned.length > 0) {
            jqlParams = {
                jql: `assignee=${encodedEmail} or text ~ ${encodedEmail}`,
            };
        }

        console.log("JIRA params: ", jqlParams);
        await axios.get(`https://${jiraUrl}/rest/api/3/search`, { headers, params: jqlParams })
            .then(response => {
                console.log("JIRA response: ", response.data.issues);
                setTickets(response.data.issues);
            })
            .catch(error => {
                console.log(error);
            });
    }

    return (
        <div className="w_overflowable">
            <JiraConfigurations 
                assignedOrMentioned={assignedOrMentioned}
                setAssignedOrMentioned={setAssignedOrMentioned}
                ticketTypes={ticketTypes}
                setTicketTypes={setTicketTypes}
                fetchJiraTickets={fetchJiraTickets}
            />
            {
                tickets.length !== 0 ? tickets.map(issue => (
                    <div key={issue.id}>
                        <h3>
                            <a href={`https://${domain}/browse/${issue.key}`} target="_blank" rel="noopener noreferrer">
                                {issue.key} - {issue.id}
                            </a>
                        </h3>
                        <h4>
                            <p>{issue.fields.summary}</p>
                        </h4>
                    </div>
                )) : (
                    <div> 
                        <h3>No tickets found! Please fill out JIRA credentials in Profile</h3>
                    </div>
                )
            }
        </div>
    );
}

export default JiraTicket;
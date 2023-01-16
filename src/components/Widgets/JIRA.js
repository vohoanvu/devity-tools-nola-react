import React, { useState, useEffect } from "react";
import axios from "axios";

const JiraTicket = ({ apiToken, domain, email}) => {
    const [tickets, setTickets] = useState([]);
    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Basic ${btoa(`${email}:${apiToken}`)}`
    };

    useEffect(() => {
        const encodedEmail = email.replace("@", "\\u0040");
        const jqlParams = {
            jql: `assignee=${encodedEmail} or text ~ ${encodedEmail}`,
        };
        axios.get(`https://${domain}/rest/api/3/search`, { headers, params: jqlParams })
            .then(response => {
                console.log("JIRA response: ", response.data.issues);
                setTickets(response.data.issues);
            })
            .catch(error => {
                console.log(error);
            });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [apiToken, domain, email]);

    return (
        <div className="w_overflowable">
            {
                tickets.map(issue => (
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
                ))
            }
        </div>
    );
}

export default JiraTicket;
import React, { useEffect } from "react";

export default function JiraIssuesTable({ issues, jiraDomain }) 
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

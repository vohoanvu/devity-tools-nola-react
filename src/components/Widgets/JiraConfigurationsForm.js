import React, { useEffect, useState } from "react";

export default function JiraConfigurations(props) 
{
    const [configsContentObj, setConfigsContentObj] = useState({
        duty: "",
        issueTypes: [],
        statuses: [],
        priorities: []
    });
    const [jiraWidget, setJiraWidget] = useState({});

    useEffect(() => {
        setJiraWidget(props.widget);
    }, [props.widget]);

    function handleDutyChange(changeEvent) {
        props.setAssignedOrMentioned(changeEvent.target.value);
        configsContentObj.duty = changeEvent.target.value;

        configsContentObj.issueTypes = props.ticketTypes;
        configsContentObj.statuses = props.ticketStatuses;
        configsContentObj.priorities = props.priorities;
        setConfigsContentObj(configsContentObj);
        sendContentToParent();
    }

    function handleTicketTypeChange(changeEvent) {
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
                    <label>
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
                    </label>
                </div>
            </form>
        </div>
        
    );
}
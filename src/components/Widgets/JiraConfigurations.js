import React, { useEffect } from "react";

export default function JiraConfigurations(props) 
{
    useEffect(() => {

    }, []);

    function handleTicketTypeChange(changeEvent) {
        let options = [...props.ticketTypes];
        if (changeEvent.target.checked) {
            options.push(changeEvent.target.value);
        } else {
            options = options.filter(o => o !== changeEvent.target.value);
        }
        props.setTicketTypes(options);
    }

    function handleStatusChange(changeEvent) {
        let options = [...props.ticketStatuses];
        if(changeEvent.target.checked) {
            options.push(changeEvent.target.value);
        } else {
            options = options.filter(o => o !== changeEvent.target.value);
        }
        props.setTicketStatuses(options);
    }

    function handlePriorityChange(changeEvent) {
        let options = [...props.priorities];
        if(changeEvent.target.checked) {
            options.push(changeEvent.target.value);
        } else {
            options = options.filter(o => o !== changeEvent.target.value);
        }
        props.setPriorities(options);
    }


    return (
        <form>
            <div className="mentioned-assigned">
                <label>
                    <input 
                        type="radio" 
                        value="assigned" 
                        checked={props.assignedOrMentioned === "assigned"}
                        onChange={e => props.setAssignedOrMentioned(e.target.value)}
                    />
                    Your Assigned Tickets
                </label>
                <label>
                    <input 
                        type="radio" 
                        value="mentioned" 
                        checked={props.assignedOrMentioned === "mentioned"}
                        onChange={e => props.setAssignedOrMentioned(e.target.value)}
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
    );
}
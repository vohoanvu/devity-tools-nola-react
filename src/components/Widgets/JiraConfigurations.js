import React, { useEffect } from "react";

export default function JiraConfigurations(props) 
{
    useEffect(() => {

    }, []);

    async function handleTicketTypeChange(changeEvent) {
        let options = [...props.ticketTypes];
        if (changeEvent.target.checked) {
            options.push(changeEvent.target.value);
        } else {
            options = options.filter(o => o !== changeEvent.target.value);
        }
        props.setTicketTypes(options);

        await props.fetchJiraTickets();
    }


    return (
        <form>
            <div className="mentioned-Assigned">
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
        </form>
    );
}
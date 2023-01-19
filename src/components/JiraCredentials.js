import * as React from "react";
const LOCAL_STORAGE_KEY = "jira_token";
const LOCAL_STORAGE_DOMAIN_KEY = "jira_domain";
const LOCAL_STORAGE_USERID_KEY = "jira_user_id";

export default class JiraCredentials extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            jira_token: localStorage.getItem(LOCAL_STORAGE_KEY) ?? "",
            jiraDomain: localStorage.getItem(LOCAL_STORAGE_DOMAIN_KEY) ?? "",
            jiraUserId: localStorage.getItem(LOCAL_STORAGE_USERID_KEY) ?? "",
            domainError: ""
        };

        this.jiraDomainRegex = /^([a-zA-Z0-9-]+).atlassian.(net|com)$/;
    }

    componentDidMount() {
        this.setState({
            jira_token: localStorage.getItem(LOCAL_STORAGE_KEY) ?? "",
            jiraDomain: localStorage.getItem(LOCAL_STORAGE_DOMAIN_KEY) ?? "",
            jiraUserId: localStorage.getItem(LOCAL_STORAGE_USERID_KEY) ?? ""
        });
    }

    handleBlur = (event) => {
        if (event.target.name === "jiraDomain") {
            let validDomain = "";
            if (!this.jiraDomainRegex.test(event.target.value)) {
                this.setState({
                    domainError: "Invalid Jira Domain URL"
                });
                //removing the invalid characters such as "http://", "https://" or '/' at the end from the domain
                validDomain = event.target.value.replace(/(^\w+:|^)\/\//, "").replace(/\/$/, "");
            } else {
                this.setState({
                    domainError: ""
                });
                validDomain = event.target.value;
            }
            localStorage.setItem(LOCAL_STORAGE_DOMAIN_KEY, validDomain);
        }

        if (event.target.name === "jiraUserId") {
            localStorage.setItem(LOCAL_STORAGE_USERID_KEY, event.target.value);
        } 

        if (event.target.name === "jira_token") {
            localStorage.setItem(LOCAL_STORAGE_KEY, event.target.value);
        }
    };

    handleOnChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };
    

    render()
    {
        return (
            <div>
                <form>
                    <label htmlFor="jiraDomain">
                        Jira Domain
                        <input 
                            type="text" 
                            name="jiraDomain"
                            value={this.state.jiraDomain} 
                            onBlur={this.handleBlur.bind(this)} 
                            onChange={this.handleOnChange.bind(this)}/>
                        {/* { this.state.domainError && <p style={{ color: "red" }}>{this.state.domainError}</p> } */}
                    </label>
                    <br/>
                    <label htmlFor="jiraUserId">
                        Jira User ID
                        <input 
                            type="text" 
                            name="jiraUserId"
                            value={this.state.jiraUserId} 
                            onBlur={this.handleBlur.bind(this)} 
                            onChange={this.handleOnChange.bind(this)}/>
                    </label>
                    <br/>
                    <label htmlFor="jira_token">
                        Jira Token
                        <input 
                            type="text" 
                            name="jira_token"
                            value={this.state.jira_token} 
                            onBlur={this.handleBlur.bind(this)} 
                            onChange={this.handleOnChange.bind(this)}/>
                    </label>
                </form>
            </div>
        )
    }
}
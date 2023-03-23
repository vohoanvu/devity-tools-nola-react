import * as React from "react";
import $ from "jquery";
const LOCAL_STORAGE_KEY = "jira_token";
const LOCAL_STORAGE_DOMAIN_KEY = "jira_domain";
const LOCAL_STORAGE_USERID_KEY = "jira_user_id";

export default class JiraCredentials extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            jira_token: "",
            jiraDomain: "",
            jiraUserId: "",
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

        this.props.sendContentToDevityPanels();
        $(`#save-btn-${this.props.widgetId}`).show();
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
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    <label htmlFor="jiraDomain">Jira Domain:</label>
                                </td>
                                <td>
                                    <input 
                                        type="text" 
                                        name="jiraDomain"
                                        value={this.state.jiraDomain} 
                                        onBlur={this.handleBlur.bind(this)} 
                                        onChange={this.handleOnChange.bind(this)}/>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label htmlFor="jiraUserId">Jira User ID:</label>
                                </td>
                                <td><input 
                                    type="text" 
                                    name="jiraUserId"
                                    value={this.state.jiraUserId} 
                                    onBlur={this.handleBlur.bind(this)} 
                                    onChange={this.handleOnChange.bind(this)}/>
                                </td>
                            </tr>
                            <tr>
                                <td><label htmlFor="jira_token">Jira Token:</label></td>
                                <td><input 
                                    type="text" 
                                    name="jira_token"
                                    value={this.state.jira_token} 
                                    onBlur={this.handleBlur.bind(this)} 
                                    onChange={this.handleOnChange.bind(this)}/>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </form>
            </div>
        )
    }
}
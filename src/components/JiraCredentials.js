import * as React from "react";
import $ from "jquery";

export default class JiraCredentials extends React.Component
{
    constructor(props) {
        super(props);
        //these must match the <input/> Name attribute
        this.state = {
            jira_token: "",
            jiraDomain: "",
            jiraUserId: "",
            jiraProjectId: ""
        };

        this.jiraDomainRegex = /^([a-zA-Z0-9-]+).atlassian.(net|com)$/;
    }

    componentDidMount() {
        this.setState({
            jira_token: this.props.jiraCredentials.TOKEN,
            jiraDomain: this.props.jiraCredentials.DOMAIN,
            jiraUserId: this.props.jiraCredentials.EMAIL,
            jiraProjectId: this.props.jiraCredentials.PROJECT_ID
        });
    }

    handleDomainOnBlur = (event) => {
        let validDomain = "";
        if (!this.jiraDomainRegex.test(event.target.value)) {
            //removing the invalid characters such as "http://", "https://" or '/' at the end from the domain
            validDomain = event.target.value.replace(/(^\w+:|^)\/\//, "").replace(/\/$/, "");
        } else {
            validDomain = event.target.value;
        }
        this.props.setConfigsContentObj({
            ...this.props.configsContentObj,
            DOMAIN: validDomain
        });
        this.props.setJiraCredentials({
            ...this.props.jiraCredentials,
            DOMAIN: validDomain
        });
        this.props.sendContentToDevityPanels({
            DOMAIN: this.state.jiraDomain,
            EMAIL: this.state.jiraUserId,
            TOKEN: this.state.jira_token
        });
        $(`#save-btn-${this.props.widgetId}`).show();
    };

    handleEmailOnBlur = (event) => {
        this.props.setConfigsContentObj({
            ...this.props.configsContentObj,//this set-state call is not fast enough on the first Blur, 2nd Blur works
            EMAIL: event.target.value
        });
        this.props.setJiraCredentials({
            ...this.props.jiraCredentials,
            EMAIL: event.target.value
        });
        this.props.sendContentToDevityPanels({
            DOMAIN: this.state.jiraDomain,
            EMAIL: this.state.jiraUserId,
            TOKEN: this.state.jira_token
        });
        $(`#save-btn-${this.props.widgetId}`).show();
    }

    handleTokenOnBlur = (event) => {
        this.props.setConfigsContentObj({
            ...this.props.configsContentObj,
            TOKEN: event.target.value
        });
        this.props.setJiraCredentials({
            ...this.props.jiraCredentials,
            TOKEN: event.target.value
        });
        this.props.sendContentToDevityPanels({
            DOMAIN: this.state.jiraDomain,
            EMAIL: this.state.jiraUserId,
            TOKEN: this.state.jira_token
        });
        $(`#save-btn-${this.props.widgetId}`).show();
    }

    handleProjectIdOnBlur = (event) => {
        this.props.setConfigsContentObj({
            ...this.props.configsContentObj,
            PROJECT_ID: event.target.value
        });
        this.props.setJiraCredentials({
            ...this.props.jiraCredentials,
            PROJECT_ID: event.target.value
        });
        this.props.sendContentToDevityPanels({
            DOMAIN: this.state.jiraDomain,
            EMAIL: this.state.jiraUserId,
            TOKEN: this.state.jira_token,
            PROJECT_ID: this.state.jiraProjectId
        });
        $(`#save-btn-${this.props.widgetId}`).show();
    }


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
                                        onBlur={this.handleDomainOnBlur.bind(this)} 
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
                                    onBlur={this.handleEmailOnBlur.bind(this)} 
                                    onChange={this.handleOnChange.bind(this)}/>
                                </td>
                            </tr>
                            <tr>
                                <td><label htmlFor="jira_token">Jira Token:</label></td>
                                <td><input 
                                    type="text" 
                                    name="jira_token"
                                    value={this.state.jira_token} 
                                    onBlur={this.handleTokenOnBlur.bind(this)} 
                                    onChange={this.handleOnChange.bind(this)}/>
                                </td>
                            </tr>
                            <tr>
                                <td><label htmlFor="jiraProjectId">Jira Project Id (optional):</label></td>
                                <td><input 
                                    type="text" 
                                    name="jiraProjectId"
                                    value={this.state.jiraProjectId ?? ""} 
                                    onBlur={this.handleProjectIdOnBlur.bind(this)} 
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
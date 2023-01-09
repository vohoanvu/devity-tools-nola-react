import * as React from 'react';
const LOCAL_STORAGE_KEY = 'jira_token';

export default class JiraToken extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            jira_token: localStorage.getItem(LOCAL_STORAGE_KEY) ?? '',
        };
    }

    componentDidMount() {
        this.setState({
            jira_token: localStorage.getItem(LOCAL_STORAGE_KEY) ?? ''
        });
    }


    handleBlur = (event) => {
        localStorage.setItem(LOCAL_STORAGE_KEY, event.target.value);
    };

    handleOnChange = (event) => {
        this.setState({
            jira_token: event.target.value
        });
    };
    

    render()
    {
        return (
            <div>
                <form>
                    <input 
                        type="text" 
                        value={this.state.jira_token} 
                        onBlur={this.handleBlur.bind(this)} 
                        onChange={this.handleOnChange.bind(this)}/>
                </form>
            </div>
        )
    }
};
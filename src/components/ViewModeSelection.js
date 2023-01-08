import * as React from 'react';
import Cookies from 'universal-cookie';
const cookies = new Cookies();
const themeKey = 'theme';

export default class ViewModeSelection extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            stylePath: localStorage.getItem(themeKey) ?? './css/ui-darkness.css',
            currentUserAuthToken: cookies.get(this.props.devityCookie)
        };
    }

    componentDidMount() {
        let isUserLoggedIn = this.state.currentUserAuthToken !== undefined;

        if (!isUserLoggedIn) return;

        this.setState({
            stylePath: localStorage.getItem(themeKey) ?? './css/ui-darkness.css'
        });
    }

   

    handleChange = (event) => {
        this.setState({
            stylePath: event.target.value
        });

        localStorage.setItem(themeKey, event.target.value);
    };

    render()
    {
        return (
            <div >
                <link rel="stylesheet" type="text/css" href={this.state.stylePath} />
                <div>
                <select styles={this.styles} value={this.state.stylePath ?? './css/ui-darkness.css'} onChange={this.handleChange.bind(this)}>
                        <option className='opt' value="./css/ui-darkness.css">ui-darkness</option>
                        <option className='opt' value="./css/ui-lightness.css">ui-lightness</option>
                    </select>
                </div>
            </div>
        )
    }
};
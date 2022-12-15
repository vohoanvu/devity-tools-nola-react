import * as React from 'react';
import Cookies from 'universal-cookie';
const devity_cookie = 'devity-token';
const cookies = new Cookies();

export default class Css extends React.Component
{
    constructor(props) {
        super(props);

        this.state = {
            stylePath: './css/ui-darkness.css',
            currentUserAuthToken: cookies.get(devity_cookie)
        };
    }

    componentDidMount() {
        let isUserLoggedIn = this.state.currentUserAuthToken !== undefined;

        if (!isUserLoggedIn) return;

        this.setState({
            stylePath: localStorage.getItem(devity_cookie)
        });
    }


    handleChange = (event) => {
        this.setState({
            stylePath: event.target.value
        });

        localStorage.setItem(devity_cookie, event.target.value);
    };

    render()
    {
        return (
            <div>
                <link rel="stylesheet" type="text/css" href={this.state.stylePath} />
                <div>
                    <select value={this.stylePath} onChange={this.handleChange.bind(this)}>
                        <option value="./css/ui-darkness.css">ui-darkness</option>
                        <option value="./css/ui-lightness.css">ui-lightness</option>
                    </select>
                    {/* <br/><span>URL: {this.state.stylePath}</span> */}
                </div>
            </div>
        )
    }
};
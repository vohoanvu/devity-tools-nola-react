import * as React from 'react';

export default class Css extends React.Component{
    constructor(props){
        super(props);
        this.state = {stylePath: './css/ui-darkness.css'};
    }

    handleChange = (event) => {
        this.setState({stylePath: event.target.value});
      };
  
    render(){
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
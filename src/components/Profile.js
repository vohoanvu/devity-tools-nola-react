import * as React from "react";


function fetchData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(["My Profile"]);
    }, 2000);
  });
}

class Profile extends React.Component {
  state = { items: [] };

  componentDidMount() {
    fetchData().then((items) => this.setState({ items }));
  }

  render() {
    return <div className="w-panel">Profile</div>;
  }
}

export default Profile;

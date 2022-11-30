componentDidMount() {
    // POST request using fetch with set headers
    const requestOptions = {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer my-token',
            'My-Custom-Header': 'foobar'
        },
        body: JSON.stringify({ title: 'React POST Request Example' })
    };
    fetch('https://reqres.in/api/posts', requestOptions)
        .then(response => response.json())
        .then(data => this.setState({ postId: data.id }));
}
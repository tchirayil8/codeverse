import React, { Component } from 'react';
import './app.css';
import Menu from './menu';

class App extends Component {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <div className="app">
                <Menu/>
            </div>
        )
    }
}

export default App;
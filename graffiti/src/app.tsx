import React, { Component } from 'react';
import './app.css';
import Header from './header';
import Menu from './menu';
import Shapes from './shapes';

class App extends Component {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <div className="appContainer">
                <Shapes/>
                <div className="headerContainer">
                    <Header/>
                </div>
                <div className="app">
                    <Menu/>
                </div>
            </div>
        )
    }
}

export default App;
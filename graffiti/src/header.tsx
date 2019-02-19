import React, { Component } from 'react';
import './header.css';

class Header extends Component {
    constructor(props: any) {
        super(props);

    }

    render (){
        return (
            <div className="logoContainer">

                <div className="nova" id="novaLogo"></div>

                <h1 className="codeverse">
                    <div id="codeverseLogo"></div>
                </h1>
               
            </div>
        );
    }
}

export default Header;
import React, { Component } from 'react';
import './shapes.css';

class Shapes extends Component {
    constructor(props: any) {
        super(props);

    }

    render (){
        return (
            <div className="shapesContainer">
                <div className="shapes small">
                    <div className="shape circle circle1"></div>
                    <div className="shape circle circle2"></div>
                    <div className="shape triangle"></div>
                </div>
            </div>
        );
    }
}

export default Shapes;
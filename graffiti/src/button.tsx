import React, { Component } from 'react';
import "./button.css";

class Button extends Component<{isActive: boolean, icon: string}> {
    constructor(props: any) {
        super(props);
    }

    render() {
        let className = "button";
        if (this.props.isActive){
            className += ' button-active';
        }
        return (
            <div className={className}>
                <div className={`button__icon fas ${this.props.icon} fa-3x`}>
                </div>
            </div>
        );
    }
}

export default Button;
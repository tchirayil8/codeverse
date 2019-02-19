import React, { Component } from 'react';
import "./button.css";

interface buttonProps {
    isActive: boolean;
    icon: string;
}

class Button extends Component<buttonProps> {
    constructor(props: buttonProps) {
        super(props);
    }

    // class of button is based on whether it is active or not
    // active state information is sent from Parent as a prop
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
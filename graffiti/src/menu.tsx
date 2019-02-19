import React, { Component, MouseEvent } from 'react';
import { HuePicker, AlphaPicker } from 'react-color';
import "./menu.css";
import Button from "./button"
import Canvas from "./canvas"

interface menuState {
    connection: WebSocket;
    button1: boolean;
    button2: boolean;
    button3: boolean;
    button4: boolean;
    button5: boolean;
    button6: boolean;
    color: string;
    width: string;
}

class Menu extends Component<{},menuState> {
    constructor(props: any) {
        super(props);
        this.state = {
            connection: new WebSocket('ws://localhost:8000'),
            button1: true,
            button2: false,
            button3: false,
            button4: false,
            button5: false,
            button6: false,
            color: '#ff0000',
            width: '3',
        }
        this.clickHandler = this.clickHandler.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.inputChange = this.inputChange.bind(this);
    }

    clickHandler(e: MouseEvent) {
        let canvas: any = document.getElementById('canvas');
        let ctx = canvas!.getContext('2d');
        let connection = this.state.connection;
        switch (e.currentTarget.className){
            case "buttonContainer1":
                this.setState({
                    button1: true,
                    button2: false,
                    button3: false,
                    button4: false,
                    button5: false,
                    button6: false,
                });
                break;
            case "buttonContainer2":
                this.setState({
                    button1: false,
                    button2: true,
                    button3: false,
                    button4: false,
                    button5: false,
                    button6: false,
                });
                break;
            case "buttonContainer3":
                this.setState({
                    button1: false,
                    button2: false,
                    button3: true,
                    button4: false,
                    button5: false,
                    button6: false,
                });
                break;
            case "buttonContainer4":
                this.setState({
                    button1: false,
                    button2: false,
                    button3: false,
                    button4: true,
                    button5: false,
                    button6: false,
                });
                break;
            case "buttonContainer5":
                this.setState({
                    button1: false,
                    button2: false,
                    button3: false,
                    button4: false,
                    button5: true,
                    button6: false,
                });
                break;
            case "buttonContainer6":
                this.setState({
                    button1: false,
                    button2: false,
                    button3: false,
                    button4: false,
                    button5: false,
                    button6: true,
                });
                let button = document.getElementById('saveButton') as HTMLAnchorElement;
                let dataURL = canvas.toDataURL('image/png');
                button.href = dataURL;
                break;
        }
    }

    componentDidUpdate(prevProps: any, prevState: menuState){
        let component = this;
        if (this.state.button5){
            setTimeout(function(){
                component.setState(prevState);
            }, 100);
        }
        else if (this.state.button4){
            setTimeout(function(){
                component.setState(prevState);
            }, 100);
        }
        else if (this.state.button6){
            setTimeout(function(){
                component.setState(prevState);
            }, 100);
        }
    }

    handleChange(color: any) {
        this.setState({
            color: color.hex,
        });
    }

    inputChange(event: React.FormEvent) {
        let ele = event.nativeEvent.target as HTMLInputElement;
        let val = ele.value;
        this.setState({width: val})
    }

    render() {
        return (
            <div className='menu'>
                <div className="menuContainer">
                    <div onClick={this.clickHandler} className="buttonContainer1">
                        <Button isActive={this.state.button1} icon='fa-pencil-alt'/>
                    </div>
                    <div onClick={this.clickHandler} className="buttonContainer2">
                        <Button isActive={this.state.button2} icon='fa-circle'/>
                    </div>
                    <div onClick={this.clickHandler} className="buttonContainer3">
                        <Button isActive={this.state.button3} icon='fa-eraser'/>
                    </div>
                    <a id="saveButton" href="#" download="canvas.png" onClick={this.clickHandler} className="buttonContainer6">
                        <Button isActive={this.state.button6} icon="fa-save"/>
                    </a>
                    <div onClick={this.clickHandler} className="buttonContainer5">
                        <Button isActive={this.state.button5} icon="fa-undo-alt"/>
                    </div>
                    <div onClick={this.clickHandler} className="buttonContainer4">
                        <Button isActive={this.state.button4} icon='fa-times-circle'/>
                    </div>
                    <div className="widthSelector">
                        <form>
                            <input onChange={this.inputChange} type="range" id="widthInput" min="1" max="50" value={this.state.width}></input>
                        </form>
                    </div>
                </div>
                <div className="colorSelector">
                    <HuePicker color={this.state.color} onChangeComplete={this.handleChange} width="800px"/>
                </div>
                <Canvas buttons={this.state}/>
            </div>
        );
    }
}

export default Menu;
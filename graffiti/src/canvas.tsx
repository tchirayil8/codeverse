import React, { Component, MouseEvent } from 'react';
import './canvas.css';

// interface from parent state
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

// props are the same as the parent's state
// because parent sent state to Canvas as props
interface canvasProps {
    buttons: menuState
}

// reassign connection to state so it can be changed
interface canvasState {
    hold: boolean;
    connection: WebSocket;
    prevSrc: Array<string>;
};

class Canvas extends Component<canvasProps, canvasState> {
    constructor(props: canvasProps) {
        super(props);
        this.state = {
            hold: false,
            connection: props.buttons.connection,
            prevSrc: [],
        };
        this.mouseState = this.mouseState.bind(this);
        this.drawLine = this.drawLine.bind(this);
        this.closeLine = this.closeLine.bind(this);
        this.setUndoPoint = this.setUndoPoint.bind(this);
    }

    componentDidMount() {
        let canvas: any = document.getElementById('canvas');

        // use this function to set a checkpoint to undo to
        this.setUndoPoint(canvas);

        this.state.connection.onopen = function () {
            console.log("open");
            console.log(this.binaryType);
        };

        this.state.connection.onerror = function (error) {
            // an error occurred when sending/receiving data
        };
        
        this.state.connection.onmessage = function (message) {
            console.log(message.data);
        };
    }

    drawLine(event: MouseEvent) : void {
        let canvas: any = document.getElementById('canvas');
        let ctx = canvas!.getContext('2d');
        let e = event.nativeEvent;
        let connection = this.state.connection;

        // custom fillCircle function
        ctx.fillCircle = function(x: number, y: number, radius: number, fillColor: string) {
            this.fillStyle = fillColor;
            this.beginPath();
            this.moveTo(x, y);
            this.arc(x, y, radius, 0, Math.PI * 2, false);
            this.fill();
            this.closePath();
        };
        
        // draw using stroke for button1
        if (this.props.buttons.button1){
            ctx.strokeStyle = this.props.buttons.color;
            ctx.lineWidth = this.props.buttons.width;
            ctx.beginPath();
            ctx.moveTo(e.offsetX,e.offsetY);
            ctx.lineTo(e.offsetX - e.movementX, e.offsetY - e.movementY);
            ctx.stroke();
        }
        // draw using fillCircle and custom color for button2
        else if (this.props.buttons.button2){
            ctx.fillCircle(e.offsetX, e.offsetY, this.props.buttons.width, this.props.buttons.color);
        }
        // erase with fillCircle and background color
        else if (this.props.buttons.button3){
            ctx.fillCircle(e.offsetX,e.offsetY,this.props.buttons.width,'#f9fdff');
        }
        // send any drawing changes to the server
        canvas.toBlob(function (blob: Blob){
            connection.send(blob);
        });
    }

    // close the path of the stroke once user has lifted the mouse press
    closeLine(event: MouseEvent) {
        let canvas: any = document.getElementById('canvas');
        let ctx = canvas!.getContext('2d');
        ctx.closePath();
    }

    // take a snapshot of the canvas and push it to the stack in this.state
    setUndoPoint(canvas: any){
        let component = this;
        canvas.toBlob(function (blob: Blob) {
            let url = URL.createObjectURL(blob);
            let stack = component.state.prevSrc;
            stack.push(url);
            component.setState({
                prevSrc: stack,
            });
        });
    }

    // draw a line when the mouse is pressed down and moved
    // use state variable "hold" to track whether the mouse is pressed
    mouseState(event: MouseEvent){
        let canvas: any = document.getElementById('canvas');
        if (event.type == "mousedown"){
            // use this function to set a checkpoint to undo to
            this.setUndoPoint(canvas);
            this.setState({hold: true});
        }
        else if (event.type == "mouseup"){
            this.setState({hold: false});
            this.closeLine(event);
        }
        else if (event.type == "mouseout"){
            this.setState({hold: false});
            this.closeLine(event);
        }
        else if (event.type == "mousemove"){
            if (this.state.hold == true){
                this.drawLine(event);
            }
        }
    }

    // this is for the buttons on the menu that flash active
    componentDidUpdate(prevProps: canvasProps, prevState: canvasState) {
        let canvas: any = document.getElementById('canvas');
        let ctx = canvas!.getContext('2d');
        let connection = this.state.connection;
        let component = this;
        // button4 is programmed to clear the screen
        if (prevProps.buttons.button4 == true){
            this.setUndoPoint(canvas);
            ctx.clearRect(0,0,canvas.width,canvas.height);
            canvas.width = canvas.width;
            canvas.toBlob(function (blob: Blob){
                connection.send(blob);
            });
        }
        // button5 is "undo" using a blob to render the checkpoint img
        // on a blank cnvas
        else if (prevProps.buttons.button5 == true){
            ctx.clearRect(0,0,canvas.width,canvas.height);
            canvas.width = canvas.width;

            let img = new Image();
            img.onload = function() {
                ctx.drawImage(img, 0, 0);
                canvas.toBlob(function (blob: Blob){
                    connection.send(blob);
                });
            };
            let stack = [...this.state.prevSrc];
            let psrc = stack.pop() as string;
            img.src = psrc;
            this.setState({
                prevSrc: stack,
            });
        }
    }

    render (){
        return (
            <canvas id="canvas" 
            height="548"
            width="796"
            onMouseDown={(e) => this.mouseState(e)} 
            onMouseUp={this.mouseState}
            onMouseOut={this.mouseState}
            onMouseMove={this.mouseState}></canvas>
        );
    }
}


export default Canvas;
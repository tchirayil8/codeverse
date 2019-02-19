import React, { Component, MouseEvent } from 'react';
import './canvas.css';

interface canvasProps {
    buttons: any
}

interface canvasState {
    hold: boolean;
    connection: WebSocket;
    prevSrc: Array<string>;
};

class Canvas extends Component<canvasProps, canvasState> {
    constructor(props: any) {
        super(props);
        this.state = {
            hold: false,
            connection: props.buttons.connection,
            prevSrc: [],
        };
        this.mouseState = this.mouseState.bind(this);
        this.drawLine = this.drawLine.bind(this);
        this.closeLine = this.closeLine.bind(this);
    }

    componentDidMount() {
        let canvas: any = document.getElementById('canvas');
        let component = this;

        canvas.toBlob(function (blob: Blob){
            let url = URL.createObjectURL(blob);
            let stack = component.state.prevSrc;
            stack.push(url);
            component.setState({
                prevSrc: stack,
            });
        });

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
        let component = this;
        let img = document.createElement("img");

        // custom fillCircle function
        ctx.fillCircle = function(x: number, y: number, radius: number, fillColor: string) {
            this.fillStyle = fillColor;
            this.beginPath();
            this.moveTo(x, y);
            this.arc(x, y, radius, 0, Math.PI * 2, false);
            this.fill();
            this.closePath();
        };
        
        if (this.props.buttons.button1){
            ctx.strokeStyle = this.props.buttons.color;
            ctx.lineWidth = this.props.buttons.width;
            ctx.beginPath();
            ctx.moveTo(e.offsetX,e.offsetY);
            ctx.lineTo(e.offsetX - e.movementX, e.offsetY - e.movementY);
            ctx.stroke();
        }
        else if (this.props.buttons.button2){
            ctx.fillCircle(e.offsetX, e.offsetY, this.props.buttons.width, this.props.buttons.color);
        }
        else if (this.props.buttons.button3){
            ctx.fillCircle(e.offsetX,e.offsetY,this.props.buttons.width,'white');
        }
        canvas.toBlob(function (blob: Blob){
            connection.send(blob);
        });
    }

    closeLine(event: MouseEvent) {
        let canvas: any = document.getElementById('canvas');
        let ctx = canvas!.getContext('2d');
        ctx.closePath();
    }

    mouseState(event: MouseEvent) : void {
        let canvas: any = document.getElementById('canvas');
        let component = this;
        if (event.type == "mousedown"){
            canvas.toBlob(function (blob: Blob) {
                let url = URL.createObjectURL(blob);
                let stack = component.state.prevSrc;
                stack.push(url);
                component.setState({
                    prevSrc: stack,
                });
            });
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

    componentDidUpdate(prevProps: canvasProps, prevState: canvasState) {
        let canvas: any = document.getElementById('canvas');
        let ctx = canvas!.getContext('2d');
        let connection = this.state.connection;
        let component = this;
        if (prevProps.buttons.button4 == true){
            canvas.toBlob(function (blob: Blob) {
                let url = URL.createObjectURL(blob);
                let stack = component.state.prevSrc;
                stack.push(url);
                component.setState({
                    prevSrc: stack,
                });
            });
            ctx.clearRect(0,0,canvas.width,canvas.height);
            canvas.width = canvas.width;
            canvas.toBlob(function (blob: Blob){
                connection.send(blob);
            });
        }
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
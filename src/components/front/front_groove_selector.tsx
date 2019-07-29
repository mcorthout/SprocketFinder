import * as React from "react";
import * as Polyglot from "node-polyglot";
import { SprocketService } from "../../services";
import { FrontDrawingSelector } from ".";

interface IFrontGrooveSelectorProps {
    poly: Polyglot;
    language: string;
    pitch: number;
    shape: number;
    thickness: number;
}

interface IFrontGrooveSelectorState {    
    grooves: number[];
    selectedGroove: number;
}

export class FrontGrooveSelector extends React.Component<IFrontGrooveSelectorProps, IFrontGrooveSelectorState> {

    constructor(props: IFrontGrooveSelectorProps) {
        super(props);
        
        this.state = {
            grooves: [],
            selectedGroove: -1,
        };

        SprocketService.GetFrontGrooves(this.props.pitch, this.props.shape, this.props.thickness, this.groovesLoaded)
    }

    public componentWillReceiveProps(nextProps: IFrontGrooveSelectorProps) {
        if (nextProps.pitch !== this.props.pitch || 
            nextProps.shape !== this.props.shape ||
            nextProps.thickness !== this.props.thickness
            ) {

            this.setState({
                grooves: [],
                selectedGroove: -1,
            });

            SprocketService.GetFrontGrooves(nextProps.pitch, nextProps.shape, nextProps.thickness, this.groovesLoaded)
        }
    } 

    public groovesLoaded = (d: number[]): void => {
        this.setState({
            grooves: [-1, ...d],
        });
    }

    public grooveChanged = (event: any): void => {
        this.setState({
            selectedGroove: +event.target.value,
        });
    }

    public render() {

        let selector;

        if (this.state.grooves.length === 0) {
            selector = null;
        }
        else if (this.state.grooves.length === 1) {
            selector = <div>{this.props.poly.t("NoSprockets")}</div>;
        }
        else {
            const grooves = this.state.grooves.map(p =>
                <option
                    key={"groove_" + p.toString()}
                    value={p.toString()}>
                    {(p == -1) ? "<select>" : p.toString()}
                </option>,
            );

            selector =  <select className="sprocket-select-cell" 
                                defaultValue={this.state.selectedGroove.toString()} 
                                onChange={this.grooveChanged}>
                                    {grooves}
                        </select>  
        }
        
        const nextSelector = (this.state.selectedGroove != -1) ?
            <FrontDrawingSelector poly={this.props.poly} 
                                  language={this.props.language} 
                                  pitch={this.props.pitch} 
                                  shape={this.props.shape}
                                  thickness={this.props.thickness}
                                  grooves={this.state.selectedGroove}
            /> :
            null;           

        return (
            <div>
                <div className="sprocket-select-row">
                    <div className="sprocket-select-cell">{this.props.poly.t("GrooveCount")}:</div>
                    {selector}                              
                </div>
                {nextSelector}
            </div>
        );
    }
}
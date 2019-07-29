import * as React from "react";
import * as Polyglot from "node-polyglot";
import { SprocketService } from "../../services";
import { FrontGrooveSelector } from ".";

interface IFrontTotalThicknessSelectorProps {
    poly: Polyglot;
    language: string;
    pitch: number;
    shape: number;
}

interface IFrontTotalThicknessSelectorState {    
    thicknesses: number[];
    selectedThickness: number;
}

export class FrontTotalThicknessSelector extends React.Component<IFrontTotalThicknessSelectorProps, IFrontTotalThicknessSelectorState> {

    constructor(props: IFrontTotalThicknessSelectorProps) {
        super(props);
        
        this.state = {
            thicknesses: [],
            selectedThickness: -1,
        };

        SprocketService.GetFrontTotalThicknesses(this.props.pitch, this.props.shape, this.thicknessesLoaded)
    }

    public componentWillReceiveProps(nextProps: IFrontTotalThicknessSelectorProps) {
        if (nextProps.pitch != this.props.pitch || nextProps.shape !== this.props.shape) {

            this.setState({
                thicknesses: [],
                selectedThickness: -1,
            });

            SprocketService.GetFrontTotalThicknesses(nextProps.pitch, nextProps.shape, this.thicknessesLoaded)
        }
    } 

    public thicknessesLoaded = (d: number[]): void => {
        this.setState({
            thicknesses: [-1, ...d],
        });
    }

    public idChanged = (event: any): void => {
        this.setState({
            selectedThickness: +event.target.value,
        });
    }

    public render() {

        let selector;

        if (this.state.thicknesses.length === 0) {
            selector = null;
        }
        else if (this.state.thicknesses.length === 1) {
            selector = <div>{this.props.poly.t("NoSprockets")}</div>;
        }
        else {
            const thicknesses = this.state.thicknesses.map(p =>
                <option
                    key={"total_thickness_" + p.toString()}
                    value={p.toString()}>
                    {(p == -1) ? "<select>" : p.toString()}
                </option>,
            );

            selector = <select className="sprocket-select-cell" 
                               defaultValue={this.state.selectedThickness.toString()} 
                               onChange={this.idChanged}>
                                    {thicknesses}
                        </select>;
        }

        const nextSelector = (this.state.selectedThickness != -1) ?
            <FrontGrooveSelector poly={this.props.poly} 
                                           language={this.props.language} 
                                           pitch={this.props.pitch} 
                                           shape={this.props.shape} 
                                           thickness={this.state.selectedThickness}/> :
            null;

        return (
            <div>
                <div className="sprocket-select-row">
                    <div className="sprocket-select-cell">{this.props.poly.t("TotalThickness")}:</div>
                    {selector}
                </div>
                {nextSelector}
            </div>
        );
    }
}
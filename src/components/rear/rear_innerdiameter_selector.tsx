import * as React from "react";
import * as Polyglot from "node-polyglot";
import { SprocketService } from "../../services";
import { RearBoltPitchDiameterSelector } from ".";

interface IRearInnerDiameterSelectorProps {
    poly: Polyglot;
    language: string;
    pitch: number;
}

interface IRearInnerDiameterSelectorState {    
    diameters: number[];
    selectedDiameter: number;
}

export class RearInnerDiameterSelector extends React.Component<IRearInnerDiameterSelectorProps, IRearInnerDiameterSelectorState> {

    constructor(props: IRearInnerDiameterSelectorProps) {
        super(props);
        
        this.state = {
            diameters: [],
            selectedDiameter: -1,
        };

        SprocketService.GetRearDiameters(this.props.pitch, this.diametersLoaded)
    }

    public componentWillReceiveProps(nextProps: IRearInnerDiameterSelectorProps) {
        if (nextProps.pitch !== this.props.pitch) {

            this.setState({
                diameters: [],
                selectedDiameter: -1,
            });

            SprocketService.GetRearDiameters(nextProps.pitch, this.diametersLoaded)
        }
    } 

    public diametersLoaded = (d: number[]): void => {
        this.setState({
            diameters: [-1, ...d],
        });
    }

    public idChanged = (event: any): void => {
        this.setState({
            selectedDiameter: +event.target.value,
        });
    }

    public render() {

        const diameters = this.state.diameters.map(p =>
            <option
                key={"pitch_" + p.toString()}
                value={p.toString()}>
                {(p == -1) ? "<select>" : p.toString()}
            </option>,
        );

        const nextSelector = (this.state.selectedDiameter != -1) ?
            <RearBoltPitchDiameterSelector poly={this.props.poly} 
                                           language={this.props.language} 
                                           pitch={this.props.pitch} 
                                           id={this.state.selectedDiameter} /> :
            null;

        return (
            <div>
                <div className="sprocket-select-row">
                    <div className="sprocket-select-cell">{this.props.poly.t("InnerDiameter")}:</div>
                    <select className="sprocket-select-cell" 
                            defaultValue={this.state.selectedDiameter.toString()} 
                            onChange={this.idChanged}>
                        {diameters}
                    </select>                
                </div>
                {nextSelector}
            </div>
        );
    }
}
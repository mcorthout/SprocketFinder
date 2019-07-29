import * as React from "react";
import * as Polyglot from "node-polyglot";
import { SprocketService } from "../../services";
import { RearBoltNumberSelector } from ".";

interface IRearBoltPitchDiameterSelectorProps {
    poly: Polyglot;
    language: string;
    pitch: number;
    id: number
}

interface IRearBoltPitchDiameterSelectorState {    
    diameters: number[];
    selectedDiameter: number;
}

export class RearBoltPitchDiameterSelector extends React.Component<IRearBoltPitchDiameterSelectorProps, IRearBoltPitchDiameterSelectorState> {

    constructor(props: IRearBoltPitchDiameterSelectorProps) {
        super(props);
        
        this.state = {
            diameters: [],
            selectedDiameter: -1,
        };

        SprocketService.GetRearBoltPitchDiameters(this.props.pitch, this.props.id, this.diametersLoaded)
    }

    public componentWillReceiveProps(nextProps: IRearBoltPitchDiameterSelectorProps) {
        if (nextProps.pitch !== this.props.pitch ||
            nextProps.id !== this.props.id) {

            this.setState({
                diameters: [],
                selectedDiameter: -1,
            });

            SprocketService.GetRearBoltPitchDiameters(nextProps.pitch, nextProps.id, this.diametersLoaded)
        }
    } 

    public diametersLoaded = (d: number[]): void => {
        this.setState({
            diameters: [-1, ...d],
        });
    }

    public pcdChanged = (event: any) => {
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
            <RearBoltNumberSelector poly={this.props.poly} 
                                    language={this.props.language} 
                                    pitch={this.props.pitch} 
                                    id={this.props.id} 
                                    pcd={this.state.selectedDiameter} /> :
            null;

        return (
            <div>
                <div className="sprocket-select-row">
                    <div className="sprocket-select-cell">{this.props.poly.t("BoltPitchDiameter")}:</div>
                    <select className="sprocket-select-cell" 
                            defaultValue={this.state.selectedDiameter.toString()} 
                            onChange={this.pcdChanged}>
                        {diameters}
                    </select>                
                </div>
                {nextSelector}
            </div>
        );
    }
}
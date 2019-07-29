import * as React from "react";
import * as Polyglot from "node-polyglot";
import { SprocketService } from "../../services";
import { RearDrawingSelector } from ".";

interface IRearBoltNumberSelectorProps {
    poly: Polyglot;
    language: string;
    pitch: number;
    id: number;
    pcd: number;
}

interface IRearBoltNumberSelectorState {    
    boltQuantities: number[];
    selectedBoltQuantity: number;
}

export class RearBoltNumberSelector extends React.Component<IRearBoltNumberSelectorProps, IRearBoltNumberSelectorState> {

    constructor(props: IRearBoltNumberSelectorProps) {
        super(props);
        
        this.state = {
            boltQuantities: [],
            selectedBoltQuantity: -1,
        };

        SprocketService.GetRearBoltQuantities(this.props.pitch, this.props.id, this.props.pcd, this.quantitiesLoaded)
    }

    public componentWillReceiveProps(nextProps: IRearBoltNumberSelectorProps) {
        if (nextProps.pitch !== this.props.pitch ||
            nextProps.id !== this.props.id ||
            nextProps.pcd !== this.props.pcd) {

            this.setState({
                boltQuantities: [],
                selectedBoltQuantity: -1,
            });

            SprocketService.GetRearBoltQuantities(nextProps.pitch, nextProps.id, nextProps.pcd, this.quantitiesLoaded)
        }
    } 

    public quantitiesLoaded = (d: number[]): void => {
        this.setState({
            boltQuantities: [-1, ...d],
        });
    }

    public boltNumberChanged = (event: any) => {
        this.setState({
            selectedBoltQuantity: +event.target.value,
        });
    }

    public render() {

        const quantities = this.state.boltQuantities.map(p =>
            <option
                key={"pitch_" + p.toString()}
                value={p.toString()}>
                {(p == -1) ? "<select>" : p.toString()}
            </option>
        );

        const nextSelector = (this.state.selectedBoltQuantity != -1) ?
            <RearDrawingSelector
                poly={this.props.poly}
                language={this.props.language}
                pitch={this.props.pitch}
                id={this.props.id}
                pcd={this.props.pcd}
                fhn={this.state.selectedBoltQuantity}
            /> :
            null;

        return (
            <div>
                <div className="sprocket-select-row">
                    <div className="sprocket-select-cell">{this.props.poly.t("BoltQuantity")}:</div>
                    <select className="sprocket-select-cell" 
                            defaultValue={this.state.selectedBoltQuantity.toString()} 
                            onChange={this.boltNumberChanged}>
                        {quantities}
                    </select>                
                </div>
                <div>
                    {nextSelector}
                </div>
            </div>
        );
    }
}
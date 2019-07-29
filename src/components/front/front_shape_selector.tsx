import * as React from "react";
import * as Polyglot from "node-polyglot";
import { SprocketService } from "../../services";
import { FrontTotalThicknessSelector } from ".";

interface IFrontShapeSelectorProps {
    poly: Polyglot;
    language: string;
    pitch: number;
}

interface IFrontShapeSelectorState {    
    shapes: number[];
    selectedShape: number;
}

export class FrontShapeSelector extends React.Component<IFrontShapeSelectorProps, IFrontShapeSelectorState> {

    private readonly SprocketSelectorDrawingBase = "https://service.afam.com/webshop/images/sprockets/finder/";

    constructor(props: IFrontShapeSelectorProps) {
        super(props);
        
        this.state = {
            shapes: [],
            selectedShape: -1,
        };

        SprocketService.GetFrontShapes(this.props.pitch, this.shapesLoaded)
    }

    public componentWillReceiveProps(nextProps: IFrontShapeSelectorProps) {
        if (nextProps.pitch !== this.props.pitch) {

            this.setState({
                shapes: [],
                selectedShape: -1,
            });

            SprocketService.GetFrontShapes(nextProps.pitch, this.shapesLoaded)
        }
    } 

    public shapesLoaded = (d: number[]): void => {
        this.setState({
            shapes: [-1, ...d],
        });
    }

    public shapeChanged = (shape: number): void => {
        this.setState({
            selectedShape: shape,
        });
    }

    public render() {

        const images = this.state.shapes.filter(s => s > 0).map((s, i) =>
            <div key={"imgdiv_" + i.toString()} 
                style={{
                    textAlign: "center", 
                    marginRight: "1em",
                    marginBottom: "0.5em",
                    border: (s === this.state.selectedShape) ? "1px solid #FFCC00" : "1px solid #663300",
                    float: "left"
                    }} 
                onClick= {() => this.shapeChanged(s)}>
                <input type="radio" 
                    name="shape" 
                    value={s.toString()} 
                    key={"tr_" + s.toString()}
                    checked={s === this.state.selectedShape}
                    onChange={() => this.shapeChanged(s)}
                />
                
                <div>{s.toString()}</div>
                
                <img
                    key={"img_" + s}
                    src={this.SprocketSelectorDrawingBase + "d" + s.toString() + ".png"}
                    style={{backgroundColor: "#FFFFFF", width: "100px", height: "100px"}}                    
                />                
            </div>
        );

        const nextSelector = (this.state.selectedShape != -1) ?
            <FrontTotalThicknessSelector poly={this.props.poly} 
                                           language={this.props.language} 
                                           pitch={this.props.pitch} 
                                           shape={this.state.selectedShape} /> :
            null;

        return (
            <div>
                <div className="sprocket-select-row">
                    <div className="sprocket-select-cell">{this.props.poly.t("Shape")}:</div> 
                    <div>{images}</div>
                    <div style={{clear: "both"}}></div>                                       
                </div>
                {nextSelector}
            </div>
        );
    }
}
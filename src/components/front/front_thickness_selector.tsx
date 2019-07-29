import * as React from "react";
import * as Polyglot from "node-polyglot";
import { FrontPitchSelector } from ".";

interface IFrontThicknessSelectorProps {
    poly: Polyglot;
    language: string;
}

interface IThickness {
    thickness: number;
    drawing: string;
}

interface IFrontThicknessSelectorState {
    selectedDrawing: number;
}

export class FrontThicknessSelector extends React.Component<IFrontThicknessSelectorProps, IFrontThicknessSelectorState> {

    private readonly SprocketSelectorDrawingBase = "https://service.afam.com/webshop/images/sprockets/finder/";

    private readonly options: IThickness[] = [
        {thickness: 4.3, drawing: "t430.png"},
        {thickness: 5.8, drawing: "t580.png"},
        {thickness: 7.2, drawing: "t720.png"},
        {thickness: 8.7, drawing: "t870.png"}
    ];

    constructor(props: IFrontThicknessSelectorProps) {
        super(props);

        this.state = {
            selectedDrawing: -1,
        };
    }

    public drawingChanged = (index: number): void => {
        this.setState({
            selectedDrawing: index,
        });
    }

    public render() {
    
        const images = this.options.map((p, i) =>
            <div key={"imgdiv_" + i.toString()} 
                 style={{
                     textAlign: "center", 
                     marginRight: "1em",
                     marginBottom: "0.5em",
                     border: (i === this.state.selectedDrawing) ? "1px solid #FFCC00" : "1px solid #663300"
                    }} 
                 onClick= {() => this.drawingChanged(i)}>
                <input type="radio" 
                       name="thickness" 
                       value={i.toString()} 
                       key={"tr_" + i.toString()}
                       checked={i === this.state.selectedDrawing}
                       onChange={() => this.drawingChanged(i)}
                />
                
                <div>{p.thickness.toString() + " mm"}</div>
                
                <img
                    key={"img_" + p}
                    src={this.SprocketSelectorDrawingBase + p.drawing}
                    style={{backgroundColor: "#FFFFFF", width: "100px"}}                    
                />                
            </div>
        );        

        const nextSelector = (this.state.selectedDrawing !== -1) ?
            <FrontPitchSelector 
                poly={this.props.poly} 
                language={this.props.language} 
                thickness={this.options[this.state.selectedDrawing].thickness} /> :
            null;

        return (
            <div>
                <div className="sprocket-select-row" >
                    <div className="sprocket-select-cell">{this.props.poly.t("TeethThickness")}:</div>
                    <div className="sprocket-select-cell" style={{display: "inline-flex"}}>
                        {images}
                    </div>
                </div>
                {nextSelector}
            </div>
        );
    }
}

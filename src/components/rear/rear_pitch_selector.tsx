import * as React from "react";
import * as Polyglot from "node-polyglot";
import { SprocketService } from "../../services";
import { RearInnerDiameterSelector } from ".";

interface IRearPitchSelectorProps {
    poly: Polyglot;
    language: string;
    thickness: number;
}

interface IPitch {
    thickness: number;
    pitch: number;
    drawing: string;
}

interface IRearPitchSelectorState {
    selectedIndex: number;
}

export class RearPitchSelector extends React.Component<IRearPitchSelectorProps, IRearPitchSelectorState> {

    private readonly SprocketSelectorDrawingBase = "https://service.afam.com/webshop/images/sprockets/finder/";

    private readonly options: IPitch[] = [
        { thickness: 4.3, pitch: 415, drawing: "415-420"},
        { thickness: 5.8, pitch: 420, drawing: "415-420"},
        { thickness: 7.2, pitch: 428, drawing: "428"},
        { thickness: 5.8, pitch: 520, drawing: "520-525-530"},
        { thickness: 7.2, pitch: 525, drawing: "520-525-530"},
        { thickness: 8.7, pitch: 530, drawing: "520-525-530"},
        { thickness: 8.7, pitch: 532, drawing: "532"},
        { thickness: 8.7, pitch: 630, drawing: "630"}
    ];    

    constructor(props: IRearPitchSelectorProps) {
        super(props);

        this.state = {
            selectedIndex: -1,            
        };
    }

    public componentWillReceiveProps(nextProps: IRearPitchSelectorProps) {
        if (nextProps.thickness !== this.props.thickness) {
            this.setState({
                selectedIndex: -1,
            });            
        }
    }

    public pitchChanged = (newIndex: number): void => {
        this.setState({
            selectedIndex: newIndex,
        });
    }

    public render() {

        const pitches = this.options.filter(p => p.thickness === this.props.thickness);

        const images = pitches.map((p, i) =>
            <div key={"imgdiv_" + i.toString()} 
                 style={{
                     textAlign: "center", 
                     marginRight: "1em",
                     border: (i === this.state.selectedIndex) ? "1px solid #FFCC00" : "1px solid #663300"
                    }} 
                 onClick= {() => this.pitchChanged(i)}>
                <input type="radio" 
                    name="pitch" 
                    value={i.toString()} 
                    key={"tr_" + i.toString()}
                    checked={i === this.state.selectedIndex}
                    onChange={() => this.pitchChanged(i)}
                />
                
                <div>{pitches[i].pitch.toString()}</div>
                
                <img
                    key={"img_" + p}
                    src={this.SprocketSelectorDrawingBase + p.drawing + ".png"}
                    style={{backgroundColor: "#FFFFFF", width: "150px"}}                    
                />                
            </div>
        );

        const nextSelector = (this.state.selectedIndex !== -1) ?
            <RearInnerDiameterSelector 
                    poly={this.props.poly} 
                    language={this.props.language} 
                    pitch={pitches[this.state.selectedIndex].pitch} /> :
            null;

        return (
            <div>
                <div className="sprocket-select-row" >
                    <div className="sprocket-select-cell">{this.props.poly.t("TeethDistance")}:</div>
                    <div className="sprocket-select-cell" style={{display: "inline-flex"}}>
                        {images}
                    </div>
                </div>
                {nextSelector}
            </div>
        );
    }
}

import * as React from "react";
import * as Polyglot from "node-polyglot";
import { SprocketService } from "../../services";
import { ImageModal } from "../../common";
import { FrontPartsTable } from ".";

interface IFrontDrawingSelectorProps {
    poly: Polyglot;
    language: string;
    pitch: number;
    shape: number;
    thickness: number;
    grooves: number;
}

interface IFrontDrawingSelectorState {    
    drawings: string[];
    selectedDrawing: string;
    selectedDrawingUrl: string;
    modalVisible: boolean;
    partsVisible: boolean;
}

export class FrontDrawingSelector extends React.Component<IFrontDrawingSelectorProps, IFrontDrawingSelectorState> {

    private imageBase: string = "https://service.afam.com/webshop/images/sprockets/";

    constructor(props: IFrontDrawingSelectorProps) {
        super(props);
        
        this.state = {
            drawings: [],
            selectedDrawing: "",
            selectedDrawingUrl: "",
            modalVisible: false,
            partsVisible: false,
        };

        SprocketService.GetFrontDrawings(this.props.pitch, this.props.shape, this.props.thickness, this.props.grooves, this.drawingsLoaded)
    }

    public componentWillReceiveProps(nextProps: IFrontDrawingSelectorProps) {
        if (nextProps.pitch !== this.props.pitch ||
            nextProps.shape !== this.props.shape ||
            nextProps.thickness !== this.props.thickness ||
            nextProps.grooves !== this.props.grooves) {

            this.setState({
                drawings: [],
                selectedDrawing: "",
                selectedDrawingUrl: "",
                modalVisible: false,
                partsVisible: false,
            });

            SprocketService.GetFrontDrawings(nextProps.pitch, nextProps.shape, nextProps.thickness, nextProps.grooves, this.drawingsLoaded)
        }
    } 

    public drawingsLoaded = (d: string[]): void => {
        this.setState({
            drawings: [...d],
        });
    }

    public showImage = (drawing: string) => {
        this.setState({
            selectedDrawing: drawing,
            selectedDrawingUrl: this.imageBase + drawing,
            modalVisible: true,
        });
    }

    public hideImage = () => {
        this.setState({
            selectedDrawingUrl: "",
            modalVisible: false,
        });
    }

    public showParts = (drawing: string) => {
        this.setState({
            selectedDrawing: drawing,
            partsVisible: true,
        });
    }

    public imageError = (index: number) => {
        let d = this.state.drawings.slice();
        d[index] = "";
        this.setState({
            drawings: [...d]
        });
    }

    public render() {

        const borderStyle = (drawing: string) =>
                                (drawing === this.state.selectedDrawing && this.state.partsVisible === true) ?
                                "1px solid #FFCC00" :
                                "1px solid #663300" ;

        const drawings = this.state.drawings
            .filter(d => d !== "")
            .map((p, i) =>
                <div key={"drw_" + i.toString()} style={{ float: "left" }}>
                    <table style={{ border: borderStyle(p), marginRight: "20px", marginBottom: "20px" }}>
                    <tbody>
                        <tr>
                            <td style={{ textAlign: "center" }}>
                                <a href={this.imageBase + p}
                                    onClick={(e) => { this.showImage(p); e.preventDefault(); }}>
                                    <img src={this.imageBase + p}
                                        alt=""
                                        onError={() => { this.imageError(i)} }
                                        style={{ width: "200px", borderWidth: "0px" }} />
                                </a>
                            </td>
                        </tr>
                        <tr>
                            <td style={{ textAlign: "center" }}>
                                    <button onClick={() => { this.showParts(p); }}>
                                        {this.props.poly.t("ShowItems")}
                                    </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <ImageModal
                    imageUrl={this.state.selectedDrawingUrl}
                    show={this.state.modalVisible}
                    onHide={this.hideImage}
                    modalId="SprocketModal"
                    imageId="SprocketModalImage"
                    title={this.state.selectedDrawing}
                    closeText={this.props.poly.t("Close")}
                />
            </div>            
        );

        const notfound = <div>No sprockets found</div>

        const parts = this.state.partsVisible ? 
                        <FrontPartsTable poly={this.props.poly} 
                                        language={this.props.language} 
                                        drawing={this.state.selectedDrawing} /> :
                        null;

        return (
            <div>
                <div className="sprocket-select-row">
                    <div>{this.props.poly.t("PossibleDrawings")}:</div>
                    <div>
                        {(this.state.drawings.filter(d => d !== "").length > 0) ? drawings: notfound}
                        <div style={{ clear: "both" }}></div>
                        {parts}
                    </div>
                </div>
            </div>
        );
    }
}

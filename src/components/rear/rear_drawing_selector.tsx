import * as React from "react";
import * as Polyglot from "node-polyglot";
import { SprocketService } from "../../services";
import { ImageModal } from "../../common";
import { RearPartsTable } from ".";

interface IRearDrawingSelectorProps {
    poly: Polyglot;
    language: string;
    pitch: number;
    id: number;
    pcd: number;
	fhn: number;
}

interface IRearDrawingSelectorState {    
    drawings: string[];
    selectedDrawing: string;
    selectedDrawingUrl: string;
    modalVisible: boolean;
    partsVisible: boolean;
}

export class RearDrawingSelector extends React.Component<IRearDrawingSelectorProps, IRearDrawingSelectorState> {

    private imageBase: string = "https://service.afam.com/webshop/images/sprockets/";

    constructor(props: IRearDrawingSelectorProps) {
        super(props);
        
        this.state = {
            drawings: [],
            selectedDrawing: "",
            selectedDrawingUrl: "",
            modalVisible: false,
            partsVisible: false,
        };

        SprocketService.GetRearDrawings(this.props.pitch, this.props.id, this.props.pcd, this.props.fhn, this.drawingsLoaded)
    }

    public componentWillReceiveProps(nextProps: IRearDrawingSelectorProps) {
        if (nextProps.pitch !== this.props.pitch ||
            nextProps.id !== this.props.id ||
            nextProps.pcd !== this.props.pcd ||
            nextProps.fhn !== this.props.fhn) {

            this.setState({
                drawings: [],
                selectedDrawing: "",
                selectedDrawingUrl: "",
                modalVisible: false,
                partsVisible: false,
            });

            SprocketService.GetRearDrawings(nextProps.pitch, nextProps.id, nextProps.pcd, nextProps.fhn, this.drawingsLoaded)
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

        const parts = this.state.partsVisible ? 
                        <RearPartsTable poly={this.props.poly} 
                                        language={this.props.language} 
                                        drawing={this.state.selectedDrawing} /> :
                        null;

        return (
            <div className="sprocket-select-row">
                <div>{this.props.poly.t("PossibleDrawings")}:</div>
                <div>
                    {drawings}
                    <div style={{ clear: "both" }}></div>
                    {parts}
                </div>
            </div>
        );
    }
}

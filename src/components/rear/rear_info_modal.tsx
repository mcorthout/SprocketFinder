import * as React from "react";
import * as Polyglot from "node-polyglot";
import { ISprocket, IRearSprocketInfo } from "../../models";
import { ImageModal } from "../../common";
import { Image3DModal } from "../3D/image3dmodal";

interface IRearInfoModalProps {
    poly: Polyglot;
    sprocket: ISprocket;
    sprocketInfo: IRearSprocketInfo;
    show: boolean;
    onHide: any;
}

interface IRearInfoModalState {
    has3D: boolean;
    show3D: boolean;
    showImage: boolean;
}

export class RearInfoModal extends React.Component<IRearInfoModalProps, IRearInfoModalState> {

    private imageBase: string = "https://service.afam.com/webshop/images/sprockets/";

    constructor(props: IRearInfoModalProps) {
        super(props);

        this.state = {
            has3D: true,
            show3D: false,
            showImage: false,
        };
    }

    public showSprocketImage = () => {
        this.setState({
            showImage: true,
        });
    }

    public hideSprocketImage = () => {
        this.setState({
            showImage: false,
        });
    }

    public show3D = () => {
        this.setState({
            show3D: true,
        });
    }

    public hide3D = () => {
        this.setState({
            show3D: false,
        });
    }

    public error3D = () => {
        this.setState({
            has3D: false,
        });
    }

    public componentWillUnmount() {
        document.body.classList.remove("modal-info-showing");
    }

    public render() {

        if (this.props.show) {

            document.body.classList.add("modal-info-showing");

            const sprocket = this.props.sprocket;
            const info = this.props.sprocketInfo;
            const poly = this.props.poly;

            const drawingUrl = this.imageBase + sprocket.Drawing;
            const stl3DItem = sprocket.Item;
            const drawing3DUrl = this.imageBase + "3d/vignettes/" + sprocket.Item + ".jpg";

            return (
                <div>
                    <div id={sprocket.PartId.toString() + "_info"} className="modal_background">
                        <div className="modal_content">
                            <div className="modal_header" onClick={(e) => {
                                this.props.onHide();
                            }} >
                                <div className="modal_title">
                                    {sprocket.Item}
                                </div>
                                <button type="button"
                                    className="close"
                                    onClick={(e) => {
                                        this.props.onHide();
                                    }}
                                >
                                    &times;
                            </button>
                            </div>
                            <div className="modal_body">
                                <div className="sprocket-info-left">
                                    <table id="sprocket-info-table">
                                        <tbody>
                                            <tr>
                                                <td className="align_right bold">{poly.t("Item")}:</td>
                                                <td className="align_right" id="sprocketInfoItem">{sprocket.Item}</td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td className="align_right bold">{poly.t("Pitch")}:</td>
                                                <td className="align_right" id="sprocketInfoPitch">{info.Pitch}</td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td className="align_right bold">{poly.t("SprocketSide")}:</td>
                                                <td className="align_right" id="sprocketInfoSide">{(info.Side === "F") ? poly.t("Front") : poly.t("Rear")}</td>
                                                <td></td>
                                            </tr>

                                            <tr>
                                                <td className="align_right bold">{poly.t("Teeth")}:</td>
                                                <td className="align_right" id="sprocketInfoTeeth">{info.Teeth}</td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td className="align_right bold">{poly.t("Material")}:</td>
                                                <td className="align_right" id="sprocketInfoMaterial">{info.Material}</td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td className="align_right bold">{poly.t("InnerDiameter")}:</td>
                                                <td className="align_right" id="sprocketInfoInnerDiam">{info.InnerDiameter}</td>
                                                <td>mm</td>
                                            </tr>
                                            <tr>
                                                <td className="align_right bold">{poly.t("FixingHoleSize")}:</td>
                                                <td className="align_right" id="sprocketInfoFixHoleSize">{info.FixingHoleSize}</td>
                                                <td>mm</td>
                                            </tr>
                                            <tr>
                                                <td className="align_right bold">{poly.t("BoltQuantity")}:</td>
                                                <td className="align_right" id="sprocketInfoFixHoleNumber">{info.FixingHoleQuantity}</td>
                                            </tr>
                                            <tr>
                                                <td className="align_right bold">{poly.t("BoltPitchDiameter")}:</td>
                                                <td className="align_right" id="sprocketInfoFixHolePcd">{info.BoltCircleDiameter}</td>
                                                <td>mm</td>
                                            </tr>
                                            <tr>
                                                <td className="align_right bold">{poly.t("Coating")}:</td>
                                                <td className="align_right" id="sprocketInfoCoating">{info.Coating}</td>
                                            </tr>
                                            <tr>
                                                <td className="align_right bold">{poly.t("Color")}:</td>
                                                <td className="align_right" id="sprocketInfoColor">{info.Color}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="sprocket-info-right">
                                    <div style={{ lineHeight: 1 }}>
                                        <img key={info.PartId + "_img"} alt="" src={drawingUrl} width="350px" onClick={() => this.showSprocketImage()} />
                                        <div style={{ textAlign: "center", marginBottom: "2em" }} className="smaller">{poly.t("ClickEnlarge")}</div>
                                    </div>
                                    {(this.state.has3D) ?
                                        <div style={{ lineHeight: 1 }}>
                                            <img key={info.PartId + "_3d_vignette"} alt="" src={drawing3DUrl} width="350px" onClick={() => this.show3D()} onError={() => this.error3D()} />
                                            <div style={{ textAlign: "center", marginBottom: "2em" }} className="smaller">{poly.t("Click3D")}</div>
                                        </div>
                                        : null
                                    }
                                </div>
                                <div className="sprocket-info-clear">
                                </div>

                            </div>
                            <div className="modal_footer">
                                <button type="button"
                                    className="close_button"
                                    onClick={(e) => {
                                        this.props.onHide();
                                    }}
                                >
                                    {this.props.poly.t("Close")}
                                </button>
                            </div>
                        </div>
                    </div>
                    {
                        (this.state.showImage) ?
                            <ImageModal
                                imageUrl={drawingUrl}
                                show={this.state.showImage}
                                onHide={this.hideSprocketImage}
                                modalId="SprocketImageModal"
                                imageId="SprocketImageModalImage"
                                title={sprocket.Item}
                                closeText={this.props.poly.t("Close")}
                            />
                            : null
                    }
                    {
                        (this.state.show3D) ?
                            <Image3DModal
                                show={this.state.show3D}
                                onHide={this.hide3D}
                                imageUrl={stl3DItem}
                                modalId={sprocket.PartId + "_3d_modal"}
                                imageId={sprocket.PartId + "_3d_image"}
                                title={sprocket.Item}
                                closeText={this.props.poly.t("Close")}
                                color={info.Color3D}
                                poly={this.props.poly}
                            />
                            : null
                    }
                </div>
            );
        } else {
            document.body.classList.remove("modal-info-showing");
            return null;
        }
    }
}

import * as React from "react";
import * as Polyglot from "node-polyglot";
import { SprocketScene } from "./sprocketscene";

interface IImage3DModalProps {
    show: boolean;
    onHide: Function;
    imageUrl: string;
    modalId: string;
    imageId: string;
    title: string;
    closeText: string;
    color: string;
    poly: Polyglot;
}

export class Image3DModal extends React.Component<IImage3DModalProps, {}> {

    public scene3D: SprocketScene;

    constructor(props: IImage3DModalProps) {
        super(props);        
    }

    public componentDidMount() {
        this.scene3D = new SprocketScene('s3d_container', 'progresscontainer', 'progressbar', 'progresscore', 'webgl_warning', 's3d_instructions');       
        this.scene3D.Show(this.props.imageUrl, this.props.color, '');
    }

    public componentWillUnmount() {
        document.body.classList.remove("modal-3d-showing");
    }

    public render() {
        if (this.props.show) {

            document.body.classList.add("modal-3d-showing");           

            return (
                <div id={this.props.modalId} className="modal_background" >
                    <div className="modal_content">
                        <div className="modal_header" onClick={(e) => {
                            this.props.onHide();
                        }} >
                            {/*<div className="modal_title">
                                {this.props.title}
                            </div>*/}
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
                            <p id="webgl_warning" style={{ display: "none", padding: "2em", color: "Red", fontWeight: "bold"}}>A browser supporting WebGL is required to enable 3D content</p>
                            <div id="progressbar" style={{ display: "none", width: "700px", height: "700px" }}>
                                <div id="progresscontainer" style={{ display: "none", marginLeft: "245px", marginRight: "auto", marginTop: "345px", marginBottom: "auto", height: "10px", width: "210px", borderStyle: "solid", borderWidth: "1px" }}>
                                    <div id="progresscore" style={{ display: "none", backgroundColor: "red", height: "100%" }}></div>
                                </div>
                            </div>
                            <div id="s3d_container" style={{ display: "none", width: "700px", height: "700px", backgroundImage: "url('https://service.afam.com/webshop/images/sprocket_background.png')" }}>
                            </div>
                            <div id="s3d_instructions" style={{ textAlign: "center", lineHeight: 1.1, paddingTop: 15 }} className="smaller">
                                {this.props.poly.t("MouseScroll")}<br/>
                                {this.props.poly.t("MousePan")}<br/>
                                {this.props.poly.t("MouseRotate")}<br/>
                            </div>
                        </div>
                        <div className="modal_footer">
                            <button type="button"
                                className="close_button"
                                onClick={(e) => {
                                    this.props.onHide();
                                }}
                            >
                                {this.props.closeText}
                            </button>
                        </div>
                    </div>
                </div>
            );
        }
        else {

            document.body.classList.remove("modal-3d-showing");

            return null;
        }
    }

}
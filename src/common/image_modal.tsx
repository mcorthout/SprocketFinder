import * as React from "react";

interface IImageModalProps {
    show: boolean;
    onHide: () => void;
    imageUrl: string;
    modalId: string;
    imageId: string;
    title: string;
    closeText: string;
}

export class ImageModal extends React.Component<IImageModalProps, {}> {

    public componentWillUnmount() {
        document.body.classList.remove("modal-showing");
    }

    public render() {
        if (this.props.show) {

            document.body.classList.add("modal-showing");

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
                            <img id={this.props.imageId} src={this.props.imageUrl} className="modal_image" />
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
        } else {
            document.body.classList.remove("modal-showing");

            return null;
        }
    }

}

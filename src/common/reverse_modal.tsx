import * as React from "react";
import * as Polyglot from "node-polyglot";
import ReactPaginate from "react-paginate";
import { ISprocketBike } from "../models";

interface IReverseModalProps {
    show: boolean;
    onHide: () => void;
    title: string;
    reversedBikes: ISprocketBike[];
    poly: Polyglot;
}

interface IReverseModalState {
    selectedPage: number;
}

export class ReverseModal extends React.Component<IReverseModalProps, IReverseModalState> {

    private readonly pageSize: number = 15;

    constructor(props: IReverseModalProps) {
        super(props);

        this.state = {
            selectedPage: 0,
        };

        this.updatePage = this.updatePage.bind(this);
    }

    public updatePage = (data: any): void => {
        this.setState({
            selectedPage: data.selected,
        });
    }

    public componentWillUnmount() {
        document.body.classList.remove("modal-reverse-showing");
    }

    public render() {
        if (this.props.show) {

            document.body.classList.add("modal-reverse-showing");

            let bikelist;

            const allBikes = this.props.reversedBikes;
            const pageCount = Math.ceil(allBikes.length / this.pageSize);
            const bikesToDisplay = allBikes.slice(
                this.state.selectedPage * this.pageSize,
                (this.state.selectedPage + 1) * this.pageSize,
            );

            if (bikesToDisplay) {
                bikelist = bikesToDisplay.map((b, i) =>
                    <div key={"reverse_" + i} className="bike-reverse-row">
                        <div className="bike-reverse-cell cell-left leftrightpad">{b.Brand}</div>
                        <div className="bike-reverse-cell cell-center leftrightpad">{b.Cc}</div>
                        <div className="bike-reverse-cell cell-left leftrightpad">{b.Model}</div>
                        <div className="bike-reverse-cell cell-center leftrightpad">{b.From}</div>
                        <div className="bike-reverse-cell cell-center leftrightpad">{b.To}</div>
                    </div>,
                );
            } else {
                bikelist = [];
            }

            const poly = this.props.poly;

            const paginator = (pageCount > 1) ?
                <div className="paginator">
                    <ReactPaginate
                        pageCount={pageCount}
                        pageRangeDisplayed={3}
                        marginPagesDisplayed={2}
                        previousLabel={poly.t("Previous")}
                        nextLabel={poly.t("Next")}
                        breakLabel="..."
                        initialPage={0}
                        breakClassName="break-me"
                        onPageChange={this.updatePage}
                        activeClassName="paginator-active"
                        hrefBuilder={() => "#"}
                    />
                </div>
                : null;

            const body = <div className="modal_body">
                <div className="bike-reverse-table">
                    <div className="bike-reverse-row">
                        <div className="bike-reverse-header cell-center">{poly.t("Brand")}</div>
                        <div className="bike-reverse-header cell-center">{poly.t("Cc")}</div>
                        <div className="bike-reverse-header cell-center">{poly.t("Model")}</div>
                        <div className="bike-reverse-header cell-center">{poly.t("From")}</div>
                        <div className="bike-reverse-header cell-center">{poly.t("To")}</div>
                    </div>
                    {bikelist}
                    {paginator}
                </div>
            </div>;

            const nothing = <div className="modal_body">
                <div>
                    {poly.t("NoApplications")}
                </div>
            </div>;

            return (
                <div className="modal_background" >
                    <div className="modal_content">
                        <div className="modal_header" onClick={(e) => {
                            this.props.onHide();
                        }} >
                            <div className="modal_title">
                                {this.props.title}
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
                        {(bikelist.length > 0) ? body : nothing}
                        <div className="modal_footer">
                            <button type="button"
                                className="close_button"
                                onClick={(e) => {
                                    this.props.onHide();
                                }}
                            >
                                {poly.t("Close")}
                            </button>
                        </div>
                    </div>
                </div>
            );
        } else {
            document.body.classList.add("modal-reverse-showing");
            return null;
        }
    }
}

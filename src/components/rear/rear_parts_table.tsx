import * as React from "react";
import * as Polyglot from "node-polyglot";
import { SprocketService } from "../../services";
import { ISprocket, IRearSprocketInfo, ISprocketBike } from "../../models";
import { RearInfoModal } from ".";
import { ReverseModal } from "../../common";

interface IRearPartsTableProps {
    poly: Polyglot;
    language: string;
    drawing: string;
}

interface IRearPartsTableState {
    parts: ISprocket[];
    infoSprocket: ISprocket | undefined;
    infoSprocketInfo: IRearSprocketInfo | undefined;
    infoShowing: boolean;
    reverseSprocket: ISprocket | undefined;
    reverseSprocketBikes: ISprocketBike[];
    reverseShowing: boolean;
}

export class RearPartsTable extends React.Component<IRearPartsTableProps, IRearPartsTableState> {

    private imageBase: string = "https://service.afam.com/webshop/images/sprockets/";

    constructor(props: IRearPartsTableProps) {
        super(props);

        this.state = {
            parts: [],
            infoSprocket: undefined,
            infoSprocketInfo: undefined,
            infoShowing: false,
            reverseSprocket: undefined,
            reverseSprocketBikes: [],
            reverseShowing: false,
        };

        SprocketService.GetParts(this.props.drawing, this.props.language, this.partsLoaded);
    }

    public componentWillReceiveProps(nextProps: IRearPartsTableProps) {
        if (nextProps.drawing !== this.props.drawing) {

            this.setState({
                parts: [],
            });

            SprocketService.GetParts(nextProps.drawing, nextProps.language, this.partsLoaded);
        }
    } 

    public partsLoaded = (sprockets: ISprocket[]) => {
        this.setState({
            parts: sprockets.slice(),
        });
    }

    public sprocketInfo = (p: ISprocket) => {
        this.setState({
            infoSprocket: p,
        });

        SprocketService.GetRearInfo(p.Item, this.props.language, this.infoLoaded);
    }

    public infoLoaded = (infos: IRearSprocketInfo[]) => {
        const info = infos[0];

        if (info) {
            this.setState({
                infoSprocketInfo: info,
                infoShowing: true,
            })
        }
    }

    public hideInfo = () => {
        this.setState({
            infoSprocket: undefined,
            infoSprocketInfo: undefined,
            infoShowing: false,
        });
    }

    public sprocketReverse = (p: ISprocket) => {
        this.setState({
            reverseSprocket: p,
        });

        SprocketService.GetReverse(p.Item, this.reverseLoaded);
    }

    public reverseLoaded = (bikes: ISprocketBike[]) => {
        this.setState({
            reverseSprocketBikes: bikes,
            reverseShowing: true,
        })
    }

    public hideReverse = () => {
        this.setState({
            reverseSprocket: undefined,
            reverseSprocketBikes: [],
            reverseShowing: false,
        });
    }

    public render() {

        const rows = this.state.parts.map((p, i) =>
            <tr key={"part_" + i.toString()}>
                <td>{p.Item}</td>
                <td>{p.Description}</td>               
                <td>{p.Ean}</td>
                <td style={{ textAlign: "center" }}>
                    <input type="image" key={p.PartId.toString() + "_info"} alt="info" style={{ verticalAlign: "middle" }} src="https://service.afam.com/afamgroup/images/info.png" onClick={() => this.sprocketInfo(p)} />
                </td>
                <td style={{ textAlign: "center" }}>
                    <input type="image" key={p.PartId.toString() + "_info"} alt="info" style={{ verticalAlign: "middle" }} src="https://service.afam.com/afamgroup/images/bike.png" onClick={() => this.sprocketReverse(p)} />
                </td>
            </tr>
        );

        return <div>
            <table className="part-table">
                <thead>
                    <tr>
                        <th>{this.props.poly.t("Item")}</th>
                        <th>{this.props.poly.t("Description")}</th>                        
                        <th>EAN</th>
                        <th>{this.props.poly.t("SprocketInfo")}</th>
                        <th>{this.props.poly.t("Applications")}</th>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </table>
            {
                (this.state.infoShowing && this.state.infoSprocket && this.state.infoSprocketInfo) ?
                    <RearInfoModal
                        poly={this.props.poly}
                        sprocket={this.state.infoSprocket}
                        sprocketInfo={this.state.infoSprocketInfo}
                        show={true}
                        onHide={this.hideInfo}
                    /> :
                    null
            }
            {
                (this.state.reverseShowing && this.state.reverseSprocket) ?
                    <ReverseModal
                        poly={this.props.poly}
                        title={this.state.reverseSprocket.Item}
                        show={true}
                        onHide={this.hideReverse}
                        reversedBikes={this.state.reverseSprocketBikes}
                     /> :
                     null
            }
        </div>;
    }
}
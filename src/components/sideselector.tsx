import * as React from "react";
import * as Polyglot from "node-polyglot";
import { Translations } from "../services/translations";
import { RearThicknessSelector } from "./rear";
import { FrontThicknessSelector } from "./front";

interface ISideSelectorProps {
    language: string;
}

interface ISideSelectorState {
    side: string;
}

export class SideSelector extends React.Component<ISideSelectorProps, ISideSelectorState> {

    public polyglot: Polyglot;

    constructor(props: ISideSelectorProps) {
        super(props);

        let transtable = Translations[props.language];

        if (!transtable) {
            transtable = Translations.en;
        }

        this.polyglot = new Polyglot({
            locale: props.language,
            phrases: transtable,
        });

        this.state = {
            side: "front",
        };
    }

    public changeSide = (event: any) => {
        this.setState({
            side: event.target.value,
        });
    }

    public render() {

        const poly = this.polyglot;

        return (
            <div className="sprocket-select-container">
                {/*<h3>Parametric sprocket search</h3>*/}
                <div>
                    <div className="sprocket-select-row">
                        <div className="sprocket-select-cell"
                             style={{ verticalAlign: "top" }}>
                            <span>{poly.t("SprocketSide")}</span>
                        </div>
                        <div className="sprocket-select-cell">
                            <div>
                                <label>
                                    <input
                                        type="radio"
                                        value="front"
                                        checked={this.state.side === "front"}
                                        onChange={this.changeSide}
                                    />
                                    {poly.t("Front")}
                                </label>
                                <br />
                                <label>
                                    <input
                                        type="radio"
                                        value="rear"
                                        checked={this.state.side === "rear"}
                                        onChange={this.changeSide}
                                    />
                                    {poly.t("Rear")}
                                </label>
                            </div>
                        </div>
                    </div>
                    {(this.state.side == "front") 
                    ? <FrontThicknessSelector poly={this.polyglot} language={this.props.language} />
                    : <RearThicknessSelector poly={this.polyglot} language={this.props.language} />
                    }
                </div>
            </div>
        );
    }

}

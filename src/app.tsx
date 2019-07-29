import "core-js";
import "regenerator-runtime/runtime";

import * as React from "react";
import * as ReactDOM from "react-dom";
import { SideSelector } from "./components";

function renderApp() {
    const root = document.getElementById("react-app");

    if (root) {
        const language: string = root.dataset.language || "en";

        ReactDOM.render(
            <SideSelector language={language}></SideSelector>,
            root,
        );
    }
}

renderApp();

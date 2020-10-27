import React, { Component } from "react";

import "./circle-day.css";

class CircleDay extends Component {
    render() {
        const { label, selected } = this.props;

        return (
            <div className="circle-day">
                <span
                    style={
                        selected
                            ? { borderColor: "#913706", color: "#913706" }
                            : {}
                    }
                >
                    {label}
                </span>
            </div>
        );
    }
}

export default CircleDay;

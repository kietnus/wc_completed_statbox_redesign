import React, { Component } from "react";
import SmallProgressbar from "../small-progressbar/small-progressbar";
import CircleDay from "../circle-day/circle-day";

import "./weekly-goal.css";

class WeeklyGoal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            circleDays: [
                {
                    label: "S",
                    selected: props.day === 0,
                },
                {
                    label: "M",
                    selected: props.day === 1,
                },
                {
                    label: "T",
                    selected: props.day === 2,
                },
                {
                    label: "W",
                    selected: props.day === 3,
                },
                {
                    label: "T",
                    selected: props.day === 4,
                },
                {
                    label: "F",
                    selected: props.day === 5,
                },
                {
                    label: "S",
                    selected: props.day === 6,
                },
            ],
        };

        this.totalLoad = 1; // Count of components to load external assets
        this.currentLoad = 0; // Count of assets loaded
    }

    assetLoaded = () => {
        this.currentLoad++;

        if (this.currentLoad !== this.totalLoad) return;

        this.props.assetLoaded();
    };

    render() {
        const {
            value,
            maxValue,
            enableProgressAnimation,
            progressbarPlayDuration,
            progressbarAnimationFinished,
        } = this.props;
        const { circleDays } = this.state;

        return (
            <div className="weekly-goal">
                <span id="label">WEEKLY GOAL</span>
                <div className="circle-day-content">
                    {circleDays.map((circleDay, index) => {
                        return (
                            <CircleDay
                                label={circleDay.label}
                                selected={circleDay.selected}
                                key={index}
                            />
                        );
                    })}
                </div>
                <SmallProgressbar
                    value={value}
                    maxValue={maxValue}
                    enableProgressAnimation={enableProgressAnimation}
                    progressbarPlayDuration={progressbarPlayDuration}
                    progressbarAnimationFinished={progressbarAnimationFinished}
                    assetLoaded={this.assetLoaded}
                    step={1}
                />
            </div>
        );
    }
}

export default WeeklyGoal;

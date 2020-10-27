import React, { Component } from "react";
import { Linear } from "gsap";
import { domAnimate, countUp } from "../../../utils/animate-gsap";

import "./small-progressbar.css";

import progressSound from "../../../assets/sounds/progress.mp3";

class SmallProgressbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0,
        };

        this.progressRef = React.createRef();
        this.soundRef = React.createRef();

        this.totalLoad = 1; // Count of components to load external assets
        this.currentLoad = 0; // Count of assets loaded
    }

    componentDidUpdate(prevProps, prevState, snapshot) {}

    getSnapshotBeforeUpdate(prevProps, prevState) {
        if (
            prevProps.enableProgressAnimation !==
                this.props.enableProgressAnimation &&
            this.props.enableProgressAnimation
        ) {
            // Animate width of progressbar
            domAnimate({
                dom: this.progressRef.current,
                duration: this.props.progressbarPlayDuration, // duration
                startWidth: "0%", // startWidth
                endWidth: `${(this.props.value * 100) / this.props.maxValue}%`, // endWidth
                curve: Linear.easeNone, // animation curve
                callback: this.progressbarAnimationFinished,
            });
            // Count up
            countUp({
                duration: this.props.progressbarPlayDuration,
                val: this.props.value,
                step: this.props.step,
                curve: Linear.easeNone, // animation curve
                updateFunc: this.updateValue,
            });
            // Play sound
            this.soundRef.current.play();
            this.soundRef.current.muted = false;

            return true;
        }

        return false;
    }

    assetLoaded = () => {
        this.currentLoad++;

        this.soundRef.current.pause();
        if (this.currentLoad !== this.totalLoad) return;

        this.props.assetLoaded();
    };

    updateValue = (value) => {
        this.setState({
            value: value,
        });
    };

    progressbarAnimationFinished = () => {
        // this.soundRef.current.pause();

        this.props.progressbarAnimationFinished();
    };

    render() {
        const { maxValue } = this.props;
        const { value } = this.state;

        return (
            <div className="small-progressbar">
                <span className="value">
                    <span>{value}</span>
                    {maxValue ? `/${maxValue}` : ``}
                </span>
                <div className="progress" ref={this.progressRef}></div>
                <audio
                    src={progressSound}
                    onCanPlayThrough={this.assetLoaded}
                    ref={this.soundRef}
                    autoPlay
                    muted
                />
            </div>
        );
    }
}

export default SmallProgressbar;

import React, { Component } from "react";
import {
    FireworksContainer,
    CharacterContainer,
    StatContainer,
} from "../index";

import "./workout-completed-container.css";

class WorkoutCompletedContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            enableCharacterAnimation: false,
            enableStatAnimation: false,
            loadedAllAssets: false,
        };

        // Durations
        this.fireworksMinPlayDuration = 2.5; // 2.5 seconds
        this.wcShowDuration = 0.3;
        this.wcHiddenDuration = 0.4;
        this.characterPlayDuration = 0.8;
        this.statContainerShowDuration = 0.8;
        this.statContainerHiddenDuration = 0.9;
        this.starShowDuration = 0.4;
        this.starLightDuration = 0.7;
        this.bigProgressbarPlayDuration = 1.2;
        this.smallProgressbarPlayDuration = 0.8;

        // Props from parent
        this.missionNumber = props.missionNumebr || 8;
        this.score = props.score || 12;
        this.maxScore = props.maxScore || 12;
        this.speed = props.speed || 33.4;
        this.maxSpeed = props.maxSpeed || 100;
        this.day = props.day || 1; // 0: Sunday, 1: Monday, etc
        this.goal = props.goal || 3;
        this.maxGoal = props.maxGoal || 10;

        this.totalLoad = 3; // Count of components to load external assets
        this.currentLoad = 0; // Count of assets loaded
    }

    assetLoaded = () => {
        this.currentLoad++;

        if (this.currentLoad !== this.totalLoad) return;

        this.setState({
            loadedAllAssets: true,
        });
        this.startAnimations();
    };

    startAnimations = () => {
        this.setState({
            enableCharacterAnimation: true,
            enableStatAnimation: false,
        });
    };

    characterAnimationFinished = () => {
        this.setState({
            enableCharacterAnimation: false,
            enableStatAnimation: true,
        });
    };

    statAnimationFinished = () => {
        this.setState({
            enableCharacterAnimation: false,
            enableStatAnimation: false,
        });
    };

    render() {
        const {
            enableCharacterAnimation,
            enableStatAnimation,
            loadedAllAssets,
        } = this.state;

        return (
            <div className="workout-completed-container">
                <StatContainer
                    enableStatAnimation={enableStatAnimation}
                    statAnimationFinished={this.statAnimationFinished}
                    assetLoaded={this.assetLoaded}
                    statContainerShowDuration={this.statContainerShowDuration}
                    statContainerHiddenDuration={
                        this.statContainerHiddenDuration
                    }
                    starShowDuration={this.starShowDuration}
                    starLightDuration={this.starLightDuration}
                    bigProgressbarPlayDuration={this.bigProgressbarPlayDuration}
                    smallProgressbarPlayDuration={
                        this.smallProgressbarPlayDuration
                    }
                    missionNumber={this.missionNumber}
                    score={this.score}
                    maxScore={this.maxScore}
                    speed={this.speed}
                    maxSpeed={this.maxSpeed}
                    day={this.day}
                    goal={this.goal}
                    maxGoal={this.maxGoal}
                />
                <CharacterContainer
                    enableCharacterAnimation={enableCharacterAnimation}
                    characterAnimationFinished={this.characterAnimationFinished}
                    assetLoaded={this.assetLoaded}
                    wcShowDuration={this.wcShowDuration}
                    wcHiddenDuration={this.wcHiddenDuration}
                    characterPlayDuration={this.characterPlayDuration}
                />

                <FireworksContainer
                    fireworksMinPlayDuration={this.fireworksMinPlayDuration}
                    // fireworksAnimationFinished={this.fireworksAnimationFinished}
                    loadedAllAssets={loadedAllAssets}
                    assetLoaded={this.assetLoaded}
                />
                <div className="black-overlay"></div>
            </div>
        );
    }
}

export default WorkoutCompletedContainer;

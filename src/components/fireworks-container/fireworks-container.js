import React, { Component } from "react";
import Fireworks from "../../utils/fireworks";

import "./fireworks-container.css";

import fireworksSound from "../../assets/sounds/fireworks.mp3";

class FireworksContainer extends Component {
    constructor(props) {
        super(props);

        this.fireworksContainerRef = React.createRef();
        this.soundRef = React.createRef();

        this.totalLoad = 1; // Count of components to load external assets
        this.currentLoad = 0; // Count of assets loaded
    }

    componentDidMount() {
        const container = this.fireworksContainerRef.current;
        const options = {
            maxRockets: 5, // max # of rockets to spawn
            rocketSpawnInterval: 300, // millisends to check if new rockets should spawn
            numParticles: 80, // number of particles to spawn when rocket explodes (+0-10)
            explosionMinHeight: 0.5, // percentage. min height at which rockets can explode
            explosionMaxHeight: 0.8, // percentage. max height before a particle is exploded
            explosionChance: 0.05, // chance in each tick the rocket will explode
        };
        this.fireworks = new Fireworks(container, options);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {}

    getSnapshotBeforeUpdate(prevProps, prevState) {
        if (
            prevProps.loadedAllAssets !== this.props.loadedAllAssets &&
            this.props.loadedAllAssets
        ) {
            // Play fireworks
            this.fireworks.start();
            // Play sound
            this.soundRef.current.play();
            this.soundRef.current.muted = false;

            setTimeout(() => {
                this.fireworks.stop();
                // this.props.fireworksAnimationFinished();
            }, this.props.fireworksMinPlayDuration * 1000);

            // setTimeout(() => {
            //     this.soundRef.current.pause();
            // }, this.props.fireworksMinPlayDuration * 1000 + 1000);

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

    render() {
        return (
            <div
                className="fireworks-container"
                ref={this.fireworksContainerRef}
            >
                <audio
                    src={fireworksSound}
                    onCanPlayThrough={this.assetLoaded}
                    ref={this.soundRef}
                    autoPlay
                    muted
                />
            </div>
        );
    }
}

export default FireworksContainer;

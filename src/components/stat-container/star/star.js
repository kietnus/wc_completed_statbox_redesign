import React, { Component } from "react";
import { Bounce } from "gsap";
import { isWebpSupported } from "react-image-webp/dist/utils";
import { domAnimate } from "../../../utils/animate-gsap";

import "./star.css";

import rewardSound from "../../../assets/sounds/reward.mp3";

import starBaseWebp from "../../../assets/img/star_base.webp";
import starSpriteWebp from "../../../assets/img/star_sprite.webp";
import starBasePng from "../../../assets/img/star_base.png";
import starSpritePng from "../../../assets/img/star_sprite.png";

const starBase = isWebpSupported() ? starBaseWebp : starBasePng;
const starSprite = isWebpSupported() ? starSpriteWebp : starSpritePng;

class Star extends Component {
    constructor(props) {
        super(props);

        this.state = {
            starSize: 0,
            starSpriteXOffset: 0,
        };

        this.spriteRef = React.createRef();
        this.baseRef = React.createRef();
        this.soundRef = React.createRef();

        this.starShowDuration = this.props.starShowDuration;
        this.starLightDuration = this.props.starLightDuration;
        this.delay = this.props.delay;

        this.currentFrame = 0;
        this.frameCount = 25;
        this.lightAnimationPlaytime = 2;

        this.totalLoad = 3; // Count of components to load external assets
        this.currentLoad = 0; // Count of assets loaded

        window.addEventListener("resize", this.onWindowResize, false);
    }

    componentDidMount() {
        this.setState({
            starSize: this.baseRef.current.offsetHeight,
        });
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.onWindowResize);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {}

    getSnapshotBeforeUpdate(prevProps, prevState) {
        if (
            prevProps.enableStarShowAnimation !==
                this.props.enableStarShowAnimation &&
            this.props.enableStarShowAnimation
        ) {
            // Show star
            setTimeout(() => {
                domAnimate({
                    dom: this.spriteRef.current,
                    duration: this.starShowDuration, // duration
                    startScale: 5, // startScale
                    endScale: 1, // endScale
                    startY: -200, // startY
                    endY: 0, // endY
                    startWidth: this.state.starSize, // startWidth
                    endWidth: this.state.starSize, // endWidth
                    curve: Bounce.easeOut, // animation curve
                    callback: this.starShowAnimationFinished,
                });

                this.spriteRef.current.style.visibility = "visible";

                setTimeout(() => {
                    // Play sound
                    this.soundRef.current.play();
                    this.soundRef.current.muted = false;
                    const boundingClientRect = this.baseRef.current.getBoundingClientRect();
                    const centerPosX =
                        boundingClientRect.left + boundingClientRect.width / 2;
                    const centerPosY =
                        boundingClientRect.top + boundingClientRect.height / 2;
                    this.props.addSparkles(centerPosX, centerPosY);
                }, 300);
            }, this.delay * 1000);

            return true;
        }

        if (
            prevProps.enableStarLightAnimation !==
                this.props.enableStarLightAnimation &&
            this.props.enableStarLightAnimation
        ) {
            setTimeout(() => this.startLightAnimation(), this.delay * 1000);
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

    starShowAnimationFinished = () => {
        setTimeout(() => this.props.starShowAnimationFinished(), 500);
    };

    // Sweep light animation
    startLightAnimation = () => {
        const lightInterval = setInterval(() => {
            if (this.currentFrame + 1 < this.frameCount) this.currentFrame++;
            else {
                this.currentFrame = 0;
                this.lightAnimationPlaytime--;

                if (this.lightAnimationPlaytime < 1) {
                    clearInterval(lightInterval);
                    this.props.starLightAnimationFinished();
                    return;
                }
            }

            this.setState({
                starSpriteXOffset: -this.state.starSize * this.currentFrame,
            });
        }, 35);
    };

    // Resize event listener
    onWindowResize = () => {
        if (this.baseRef.current !== null)
            this.setState({
                starSize: this.baseRef.current.offsetHeight,
                starSpriteXOffset:
                    -this.baseRef.current.offsetHeight * this.currentFrame,
            });
    };

    render() {
        const { rotateDeg, marginTop } = this.props;
        const { starSpriteXOffset, starSize } = this.state;

        return (
            <div
                className="star"
                style={{
                    transform: `rotate(${rotateDeg}deg)`,
                }}
            >
                <img
                    className="star-base"
                    src={starBase}
                    style={{
                        marginTop: `${marginTop}%`,
                    }}
                    alt="starBase"
                    ref={this.baseRef}
                    onLoad={this.assetLoaded}
                />
                <img
                    className="star-sprite"
                    src={starSprite}
                    alt="starSprite"
                    style={{
                        marginTop: `${marginTop}%`,
                        objectPosition: `${starSpriteXOffset}px 0px`,
                        width: `${starSize}px`,
                        height: `${starSize}px`,
                    }}
                    ref={this.spriteRef}
                    onLoad={this.assetLoaded}
                />
                <audio
                    src={rewardSound}
                    onCanPlayThrough={this.assetLoaded}
                    ref={this.soundRef}
                    autoPlay
                    muted
                />
            </div>
        );
    }
}

export default Star;

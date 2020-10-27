import React, { Component } from "react";
import { Circ, Bounce, Linear } from "gsap";
import { isWebpSupported } from "react-image-webp/dist/utils";
import { domAnimate } from "../../utils/animate-gsap";

import "./character-container.css";

import kidCheersSound from "../../assets/sounds/kids_cheers.mp3";

import wcImgWebp from "../../assets/img/wc.webp";
import characterImg1Webp from "../../assets/img/character1.webp";
import characterImg2Webp from "../../assets/img/character2.webp";
import characterImg3Webp from "../../assets/img/character3.webp";
import wcImgPng from "../../assets/img/wc.png";
import characterImg1Png from "../../assets/img/character1.png";
import characterImg2Png from "../../assets/img/character2.png";
import characterImg3Png from "../../assets/img/character3.png";

const wcImg = isWebpSupported() ? wcImgWebp : wcImgPng;
const characterImg1 = isWebpSupported() ? characterImg1Webp : characterImg1Png;
const characterImg2 = isWebpSupported() ? characterImg2Webp : characterImg2Png;
const characterImg3 = isWebpSupported() ? characterImg3Webp : characterImg3Png;

class CharacterContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            characters: [
                {
                    img: characterImg1,
                    id: "character1",
                    ref: React.createRef(),
                    startRotZ: -10,
                    endRotZ: 45,
                    startX: "-50%",
                    endX: "-50%",
                    startY: 800,
                    endY: 0,
                    startWidth: "40%",
                    endWidth: "40%",
                    curve: Circ.easeOut,
                    reverse: true,
                },
                {
                    img: characterImg2,
                    id: "character2",
                    ref: React.createRef(),
                    startRotZ: -20,
                    endRotZ: 30,
                    startX: "20%",
                    endX: "20%",
                    startY: 1100,
                    endY: 150,
                    startWidth: "40%",
                    endWidth: "40%",
                    curve: Circ.easeOut,
                    reverse: true,
                },
                {
                    img: characterImg3,
                    id: "character3",
                    ref: React.createRef(),
                    startRotZ: 10,
                    startX: "-120%",
                    endX: "-120%",
                    endRotZ: -20,
                    startY: 1250,
                    endY: 100,
                    startWidth: "40%",
                    endWidth: "40%",
                    curve: Circ.easeOut,
                    reverse: true,
                },
            ],
        };

        this.characterContainerRef = React.createRef();
        this.wcRef = React.createRef();
        this.soundRef = React.createRef();

        this.totalLoad = 5; // Count of components to load external assets
        this.currentLoad = 0; // Count of assets loaded
    }

    componentDidUpdate(prevProps, prevState, snapshot) {}

    getSnapshotBeforeUpdate(prevProps, prevState) {
        if (
            prevProps.enableCharacterAnimation !==
                this.props.enableCharacterAnimation &&
            this.props.enableCharacterAnimation
        ) {
            // Show all hidden
            this.characterContainerRef.current.style.visibility = "visible";
            // Play sound
            this.soundRef.current.play();
            this.soundRef.current.muted = false;

            // Show workout completed text
            domAnimate({
                dom: this.wcRef.current,
                duration: this.props.wcShowDuration, // duration
                startScale: 0, // startScale
                endScale: 1, // endScale
                startX: "-50%",
                endX: "-50%",
                startY: 300, // startY
                endY: 0, // endY
                startWidth: "90%",
                endWidth: "90%",
                curve: Bounce.easeOut, // animation curve
            });
            this.state.characters.map((character, index) => {
                return domAnimate({
                    dom: character.ref.current,
                    duration: this.props.characterPlayDuration, //duration
                    startRotZ: character.startRotZ, // startRotZ
                    endRotZ: character.endRotZ, // endRotZ
                    startX: character.startX, // startX
                    endX: character.endX, // endX
                    startY: character.startY, // startY
                    endY: character.endY, // endY
                    startWidth: character.startWidth,
                    endWidth: character.endWidth,
                    curve: character.curve, // animation curve
                    reverse: character.reverse,
                    reverseDelay: 0.2,
                });
            });
            // After disappearance of characters, hidden workout completed text as well
            setTimeout(() => {
                domAnimate({
                    dom: this.wcRef.current,
                    duration: this.props.wcHiddenDuration, //duration
                    startX: "-50%",
                    endX: "-50%",
                    startY: 0, // startY
                    endY: "100vh", // endY
                    startWidth: "90%",
                    endWidth: "90%",
                    curve: Linear.easeNone, // animation curve
                    callback: this.characterAnimationFinished,
                });
            }, this.props.characterPlayDuration * 1000 * 2);

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

    characterAnimationFinished = () => {
        // this.soundRef.current.pause();
        this.characterContainerRef.current.style.display = "hidden";
        this.props.characterAnimationFinished();
    };

    render() {
        const { characters } = this.state;

        return (
            <div
                className="character-container"
                ref={this.characterContainerRef}
            >
                <img
                    src={wcImg}
                    className="workout-completed"
                    ref={this.wcRef}
                    alt="workout-completed"
                    onLoad={this.assetLoaded}
                />
                {characters.map((character, index) => {
                    return (
                        <img
                            src={character.img}
                            className="character"
                            id={character.id}
                            ref={character.ref}
                            alt={character.id}
                            onLoad={this.assetLoaded}
                            key={index}
                        />
                    );
                })}
                <audio
                    src={kidCheersSound}
                    onCanPlayThrough={this.assetLoaded}
                    ref={this.soundRef}
                    autoPlay
                    muted
                />
            </div>
        );
    }
}

export default CharacterContainer;

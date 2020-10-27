import React, { Component } from "react";
import { Linear } from "gsap";
import { isWebpSupported } from "react-image-webp/dist/utils";
import { domAnimate } from "../../utils/animate-gsap";
import Star from "./star/star";
import BigProgressbar from "./big-progressbar/big-progressbar";
import WeeklyGoal from "./weekly-goal/weekly-goal";
import { Sparkle } from "../../utils/fireworks";

import "./stat-container-v2.scss";

import awardSound from "../../assets/sounds/award.mp3";

import statBoardWebp from "../../assets/img/stat_board.webp";
import statBoardPng from "../../assets/img/stat_board.png";

const statBoard = isWebpSupported() ? statBoardWebp : statBoardPng;

class StatContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stars: [
        {
          marginTop: 15,
          rotateDeg: -15,
        },
        {
          marginTop: 0,
          rotateDeg: 0,
        },
        {
          marginTop: 15,
          rotateDeg: 15,
        },
      ],
      enableStarShowAnimation: false,
      enableStarLightAnimation: false,
      enableScoreProgressAnimation: false,
      enableSpeedProgressAnimation: false,
      enableGoalProgressAnimation: false,
    };

    this.statContainerRef = React.createRef();
    this.particleRef = React.createRef();
    this.soundRef = React.createRef();

    this.missionNum = props.missionNumber;
    this.score = props.score;
    this.maxScore = props.maxScore;
    this.speed = props.speed;
    this.maxSpeed = props.maxSpeed;
    this.day = props.day; // 0: Sunday, 1: Monday, etc
    this.goal = props.goal;
    this.maxGoal = props.maxGoal;
    this.totalStar = 3;
    this.shownStar = 0;

    this.totalLoad = 7; // Count of components to load external assets
    this.currentLoad = 0; // Count of assets loaded
  }

  componentDidMount() {
    this.sparkle = new Sparkle(this.particleRef.current, 30);
  }

  componentDidUpdate(prevProps, prevState, snapshot) { }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    if (
      prevProps.enableStatAnimation !== this.props.enableStatAnimation &&
      this.props.enableStatAnimation
    ) {
      // Show all hidden
      this.statContainerRef.current.style.visibility = "visible";
      // Play sound
      this.soundRef.current.play();
      this.soundRef.current.muted = false;
      // Show popup
      this.showAnimation = domAnimate({
        dom: this.statContainerRef.current,
        duration: this.props.statContainerShowDuration, // duration
        startScaleY: 0.5,
        endScaleY: 1,
        startX: "-50%",
        endX: "-50%",
        startY: -2000, // startY
        endY: "-50%", // endY
        curve: Linear.easeIn, // animation curve
        callback: this.statContainerShowAnimationFinished,
      });

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

  statContainerShowAnimationFinished = () => {
    // setTimeout(() => {
    this.setState({
      enableStarShowAnimation: true,
      enableStarLightAnimation: false,
      enableScoreProgressAnimation: false,
      enableSpeedProgressAnimation: false,
      enableGoalProgressAnimation: false,
    });
    // this.soundRef.current.pause();
    // }, 1500);
  };

  starShowAnimationFinished = () => {
    this.shownStar++;

    if (this.shownStar < this.totalStar) return;

    this.setState({
      enableStarShowAnimation: false,
      enableStarLightAnimation: true,
      enableScoreProgressAnimation: true,
      enableSpeedProgressAnimation: false,
      enableGoalProgressAnimation: false,
    });
  };

  starLightAnimationFinished = () => {
    // this.setState({
    //     enableStarShowAnimation: false,
    //     enableStarLightAnimation: false,
    //     enableScoreProgressAnimation: true,
    //     enableSpeedProgressAnimation: false,
    //     enableGoalProgressAnimation: false,
    // });
  };

  scoreProgressbarAnimationFinished = () => {
    this.setState({
      enableStarShowAnimation: false,
      enableStarLightAnimation: false,
      enableScoreProgressAnimation: false,
      enableSpeedProgressAnimation: true,
      enableGoalProgressAnimation: false,
    });
  };

  speedProgressbarAnimationFinished = () => {
    this.setState({
      enableStarShowAnimation: false,
      enableStarLightAnimation: false,
      enableScoreProgressAnimation: false,
      enableSpeedProgressAnimation: false,
      enableGoalProgressAnimation: true,
    });
  };

  goalProgressbarAnimationFinished = () => {
    this.setState({
      enableStarShowAnimation: false,
      enableStarLightAnimation: false,
      enableScoreProgressAnimation: false,
      enableSpeedProgressAnimation: false,
      enableGoalProgressAnimation: false,
    });

    // setTimeout(() => {
    //     this.props.statAnimationFinished();
    // }, 2000 + this.props.statContainerShowDuration * 1000);
  };

  handleContinue = () => {
    this.showAnimation.reverse();
    this.props.statAnimationFinished();
  };

  addSparkles = (x, y) => {
    // debugger
    console.log("add sparkles")
    this.sparkle.addSparkles(x, y);
  };

  render() {
    const {
      stars,
      enableStarShowAnimation,
      enableStarLightAnimation,
      enableScoreProgressAnimation,
      enableSpeedProgressAnimation,
      enableGoalProgressAnimation,
    } = this.state;

    return (
      <div className="stat-container" ref={this.statContainerRef}>
        <div className="stat-board">
          <div className="stat-content">
            <div className="mission-row">
              <h2>WORKOUT {this.missionNum}</h2>
            </div>

            <div className="star-row">
              {stars.map((star, index) => {
                return (
                  <Star
                    rotateDeg={star.rotateDeg}
                    marginTop={star.marginTop}
                    assetLoaded={this.assetLoaded}
                    starShowAnimationFinished={this.starShowAnimationFinished}
                    starLightAnimationFinished={this.starLightAnimationFinished}
                    addSparkles={this.addSparkles}
                    enableStarShowAnimation={enableStarShowAnimation}
                    enableStarLightAnimation={enableStarLightAnimation}
                    starShowDuration={this.props.starShowDuration}
                    starLightDuration={this.props.starLightDuration}
                    delay={this.props.starShowDuration * index}
                    key={index}
                  />
                );
              })}
            </div>
            <div className="score-row">
              <BigProgressbar
                label="SCORE"
                value={this.score}
                maxValue={this.maxScore}
                maxValueHidden={false}
                step={1}
                enableProgressAnimation={enableScoreProgressAnimation}
                progressbarPlayDuration={this.props.bigProgressbarPlayDuration}
                progressbarAnimationFinished={this.scoreProgressbarAnimationFinished}
                assetLoaded={this.assetLoaded}
              />
            </div>
            <div className="speed-row">
              <BigProgressbar
                label="SPEED"
                value={this.speed}
                maxValue={this.maxSpeed}
                maxValueHidden={true}
                step={0.1}
                subLabel="Questions/Min"
                enableProgressAnimation={enableSpeedProgressAnimation}
                progressbarPlayDuration={this.props.bigProgressbarPlayDuration}
                progressbarAnimationFinished={this.speedProgressbarAnimationFinished}
                assetLoaded={this.assetLoaded}
              />
            </div>
            
            <div className="goal-row">
              <WeeklyGoal
                value={this.goal}
                maxValue={this.maxGoal}
                day={this.day}
                enableProgressAnimation={enableGoalProgressAnimation}
                progressbarPlayDuration={this.props.smallProgressbarPlayDuration}
                progressbarAnimationFinished={this.goalProgressbarAnimationFinished}
                assetLoaded={this.assetLoaded}
              />
            </div>
          
          </div>
        </div>
        
        {/* <button className="continue-btn" onClick={this.handleContinue}>
                    CONTINUE
                </button> */}
        <div className="particle-content" ref={this.particleRef}></div>
        <audio
          src={awardSound}
          onCanPlayThrough={this.assetLoaded}
          ref={this.soundRef}
          autoPlay
          muted
        />
      </div>
    );
  }
}

export default StatContainer;

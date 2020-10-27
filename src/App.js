import React, { Component } from "react";
import { WorkoutCompletedContainer } from "./components";

import "./App.css";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            start: false,
        };
    }

    handleStart = () => {
        this.setState({
            start: true,
        });
    };

    render() {
        return (
            <div className="app">
                {this.state.start ? (
                    <WorkoutCompletedContainer />
                ) : (
                    <button onClick={this.handleStart}>START</button>
                )}
            </div>
        );
    }
}

export default App;

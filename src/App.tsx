import * as React from 'react';
import Rocket from './Rocket';
import { IRocketStatus } from './Types';

interface IAppState {
    onGround: boolean;
    timeMs: number;
    gravity: number;
    initialFuel: number;
    fuelBurnRate: number;
    rocketStatus: IRocketStatus;
    initialTrajectory: number;
    initialMass: number;
}

export default class App extends React.Component<{}, IAppState> {
    private timeInterval: number = 100;
    private appTimer: any;

    constructor(props: {}) {
        super(props);
        this.state = {
            onGround: true,
            timeMs: 0,
            gravity: -9.81,
            initialFuel: 5000,
            fuelBurnRate: 1000,
            rocketStatus: {
                positionX: 0,
                positionY: 0,
                velocity: 0
            },
            initialTrajectory: 90,
            initialMass: 10000
        }
    }

    shouldComponentUpdate(nextProps: {}, nextState: IAppState) {
        if (nextState.timeMs > this.state.timeMs) {
            return true;
        } else {
            return false;
        }
    }

    private launch = () => {
        this.setState({
            onGround: false,
            timeMs: 0
        });

        this.appTimer = setInterval(() => {
            if (this.state.onGround) {
                clearInterval(this.appTimer);
                return;
            }

            this.setState((prevState: IAppState) => {
                return {
                    timeMs: prevState.timeMs + this.timeInterval
                }
            });
        }, this.timeInterval);
    }

    private stopped = () => {
        this.setState({
            onGround: true
        });
    }

    private pause = () => {
        this.setState({
            onGround: true
        });
    }

    private statusUpdated = (status: IRocketStatus) => {
        let { onGround } = this.state;

        if (status.positionY <= 0) {
            onGround = true;
        }
        this.setState({
            rocketStatus: status,
            onGround: onGround
        });
    }

    render() {
        // scale: num pixels = 1meter
        const scale = 1000;

        const { rocketStatus} = this.state;

        return (
            <div>
                <Rocket
                    timeMs={this.state.timeMs}
                    gravity={this.state.gravity}
                    onStopped={this.stopped}
                    initialFuel={this.state.initialFuel}
                    burnRate={this.state.fuelBurnRate}
                    onStatusUpdate={this.statusUpdated}
                    trajectory={this.state.initialTrajectory}
                    payload={this.state.initialMass}
                    scale={1000} />
                <div style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    height: "100%",
                    width: "150px",
                    background: "grey",
                    padding: "10px"
                }}>
                    <button onClick={(event) => this.launch()}>Launch</button>
                    <button onClick={(event) => this.pause()}>Pause</button>
                    <div>
                        <div>Time (ms): {this.state.timeMs}</div>
                        <div>Fuel Left (L): {this.state.rocketStatus.fuel}</div>
                        <div>X: {rocketStatus.positionX.toFixed(2)}</div>
                        <div>Y: {rocketStatus.positionY.toFixed(2)}</div>
                        <div>Velocity X: {rocketStatus.velocity.toFixed(2)}</div>
                    </div>
                </div>
            </div>
        )
    }
}
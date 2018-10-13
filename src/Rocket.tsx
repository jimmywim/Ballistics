import * as React from 'react';
import { Z_FIXED } from 'zlib';
import { IRocketStatus } from './Types';

interface IRocketProps {
    timeMs: number;
    gravity: number;
    initialFuel: number;
    burnRate: number;
    trajectory: number;
    payload: number;
    onStopped: () => void;
    onStatusUpdate: (status: IRocketStatus) => void;
    scale: number;
}

interface IRocketState {
    status: IRocketStatus;
}

export default class Rocket extends React.Component<IRocketProps, IRocketState> {
    constructor(props: IRocketProps) {
        super(props);

        this.state = {
            status: {
                positionX: 0,
                positionY: 0,
                fuel: this.props.initialFuel,
                missionTimeMs: 0,
                velocity: 0,
                totalMass: this.props.payload + this.props.initialFuel
            }
        };
    }

    componentWillReceiveProps(nextProps: IRocketProps) {
        if (nextProps.timeMs) {
            this.recalculate(nextProps.timeMs);
        }
    }

    render() {
        const ground = this.state.status.positionY + 10;
        
        return (
            <div style={{
                position: "fixed",
                left: this.state.status.positionX,
                bottom: ground,
                background: "black",
                width: "50px",
                height: "50px"
            }}>

            </div>
        );
    }

    private recalculate = (timeMs: number) => {
        // Do trajectory calculation here for X and Y, call set state
        const status: IRocketStatus = { ...this.state.status };

        // We can only burn fuel whilst we have fuel to burn
        // So set the rate to 0 when we run out of fuel
        const burnRate = status.fuel > 0 ? this.props.burnRate : 0;

        // How much time has passed since last tick?
        const timeDelta = timeMs - status.missionTimeMs;

        // Convert the delta to Seconds, for the burn rate (which is L/sec)
        const timeSeconds = timeMs / 1000;
        const timeDeltaSeconds = timeDelta / 1000;
        const rateThisTick = burnRate * timeDeltaSeconds;

        // Calculate the new Velocity
        // Downward force
        const downForce = status.totalMass * this.props.gravity;

        // Thrust (upward force)
        // Rate of fuel burn * CONSTANT
        const thrust = burnRate * 1;

        // Net force (positive for upward travel)
        // When thrust reaches 0, only gravitational downforce exists
        const netDownForce = thrust > 0 ? thrust - downForce : downForce;
        const acc = netDownForce / status.totalMass;
        
        // acc = delta v / delta t
        // acc = v2 - v1 / t2 - v1
        // v2 - v1 = acc * (t2 - t1)
        // v2 = (acc * (t2 - t1)) + v1
        status.velocity = (acc * timeDelta) + status.velocity;


        // Calculate height
        // h = v * t * sin(trajectory) - (0.5 * gravity * time^2)
        status.positionY = (status.velocity * timeSeconds * Math.sin(this.props.trajectory)) - 
            (0.5 * this.props.gravity * (timeSeconds * timeSeconds));

        // Update rocket stats
        status.fuel = (status.fuel - rateThisTick);
        status.missionTimeMs += timeDelta;
        status.totalMass = status.totalMass - rateThisTick;

        //console.log("Rocket Status: %O", status);

        status.positionX = status.positionX / this.props.scale;
        status.positionY = status.positionY / this.props.scale;

        this.setState((prevState: IRocketState) => {
            return { status: status }
        });

        if (status.positionY <= 0) {
            this.props.onStopped();
        }

        this.props.onStatusUpdate(status);
    }
}
import * as React from "react"
import * as ReactDOM from "react-dom"
import { Component, ClassAttributes } from "react"

const formattedSeconds = (sec: number) =>
  Math.floor(sec / 60) + ":" + ("0" + (sec % 60)).slice(-2)

interface StopwatchProps extends ClassAttributes<Stopwatch> {
  initialSeconds: number
}

export default class Stopwatch extends Component<StopwatchProps, any> {
  incrementer: any
  laps: any[]
  constructor(props: StopwatchProps) {
    super(props)
    this.state = {
      secondsElapsed: props.initialSeconds,
      timerStarted: false,
      showLapButton: false,
      showResetButton: false,
    }
    this.laps = []
  }

  handleStartClick() {
    this.setState({ 
        timerStarted: true,
        showLapButton: true,
        showResetButton: false,
    })
    
    this.incrementer = setInterval(() => {
        this.setState({
            secondsElapsed: this.state.secondsElapsed + 1,
        })
      },
      1000
    )
  }

  handleStopClick() {
    clearInterval(this.incrementer)
    this.setState({
      timerStarted: false,
      showLapButton: false,
      showResetButton: true,
    })
  }

  handleResetClick() {
    clearInterval(this.incrementer);
    this.laps = [];
      this.setState({
        secondsElapsed: 0,
      })
  }
  handleLapClick() {
    this.laps = [...this.laps, this.state.secondsElapsed]
  }

  handleDeleteClick(index: number) {
    this.setState({ laps: this.laps.splice(index, 1)})
  }

  render() {
    return (
      <div className="stopwatch">
        <h1 className="stopwatch-timer">
            {formattedSeconds(this.state.secondsElapsed)}
        </h1>
        {this.state.timerStarted ? (
            <Button
                class="stop-btn"
                copy="stop"
                event={() => this.handleStopClick()}
            />
        ) : (
            <Button
                class="start-btn"
                copy="start"
                event={() => this.handleStartClick()}
            />
        )}
        {this.state.showLapButton && 
            <Button
                copy="lap"
                event={() => this.handleLapClick()}
            />
        }
        {this.state.showResetButton &&
            <Button
                copy="reset"
                event={() => this.handleResetClick()}
            />
        }
        <div className="stopwatch-laps">
            {this.laps &&
                this.laps.map((lap, i) => (
                    <Lap
                        index={i + 1}
                        lap={lap}
                        onDelete={async () => this.handleDeleteClick(i)}
                        key={'lapKey'+i}
                    />
                ))
            }
        </div>
      </div>
    )
  }
}

const Button = (props: { copy: string, class?: string, event: () => void}) => (
    <button
        className={props.class ? props.class : ""}
        type="button"
        onClick={props.event}
    >
        {props.copy}
    </button>
)

const Lap = (props: { index: number; lap: number; onDelete: () => {} }) => (
  <div key={props.index} className="stopwatch-lap">
    <strong>{props.index}</strong>/ {formattedSeconds(props.lap)}{" "}
    <button onClick={() => props.onDelete()}> X </button>
  </div>
)


ReactDOM.render(
  <Stopwatch initialSeconds={0} />,
  document.getElementById("content") // this line of code does nothing. there is no ID
)

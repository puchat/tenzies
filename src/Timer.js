import React from "react"

const msInterval = 100

export default function Timer(props) {
    const [myInterval, setMyInterval] = React.useState(null)
    const [miliseconds, setMiliseconds] = React.useState(0)

    React.useEffect(() => {
        switch (props.command) {
            case "start":
                start();
                break;
            case "stop":
                stop();
                break;
            case "reset":
                reset();
                break;
        }
    }, [props.command])

    function start() {
        if (!miliseconds)
            setMyInterval(
                setInterval(
                    () => (setMiliseconds(prevMiliseconds => prevMiliseconds + msInterval)), 
                    msInterval
                )
            )
    }

    function stop() {
        clearInterval(myInterval)
        setMyInterval(null)
    }

    function reset() {
        stop()
        setMiliseconds(0)
    }

    function padTo2Digits(num) {
        return num.toString().padStart(2, '0')
    }

    function getTimeString() {
        let deciseconds = Math.floor(miliseconds / 100)
        let seconds = Math.floor(miliseconds / 1000)
        let minutes = Math.floor(seconds / 60)
        let hours = Math.floor(minutes / 60)
    
        deciseconds = deciseconds % 10
        seconds = seconds % 60
        minutes = minutes % 60
    
        return `${padTo2Digits(minutes)}:${padTo2Digits(seconds)},${deciseconds}`
    }

    return (
        <span className="timer">
            {getTimeString()}
        </span>
    )
}
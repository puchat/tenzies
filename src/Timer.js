import React from "react"

const msInterval = 100

export default function Timer(props) {
    const [myInterval, setMyInterval] = React.useState(null)
    const [miliseconds, setMiliseconds] = React.useState(0)

    React.useEffect(() => {
        if (props.command === "start" && !miliseconds) start()
        else if (props.command === "stop") stop()
        else if (props.command === "reset") reset()
    }, [props.command])

    function start() {
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
        <div className="timer">
            {getTimeString()}
        </div>
    )
}
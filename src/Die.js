import React from "react"

export default function Die(props) {

    const dots = [];
    for (let i = 1; i <= props.value; i++) {
        dots.push(<div className={`die-dot d${i}`}></div>)
    }

    const styles = {
        backgroundColor: props.isHeld ? "#59E391" : "white"
    }

    return (
        <div 
            className={`die f${props.value}`}
            style={styles}
            onClick={props.toggleHeld}
        >
            {dots}
        </div>
    )
}
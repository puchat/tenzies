import React from "react"
import Die from "./Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"

const fanfareSound = new Audio('/sounds/fanfare.mp3');

export default function App() {
    const [dice, setDice] = React.useState(() => getAllNewDice())
    const [gameWin, setGameWin] = React.useState(false) 
    const [movesNumber, setMovesNumber] = React.useState(0)
    const [gameInterval, setGameInterval] = React.useState(null)
    const [miliseconds, setMiliseconds] = React.useState(0)

    React.useEffect(() => checkIfWon()
    , [dice])

    function startTimer() {
        const msInterval = 100;
        const myInterval = setInterval(() => setMiliseconds(prevMiliseconds => prevMiliseconds + msInterval), msInterval)
        setGameInterval(myInterval)
    }

    function stopTimer() {
        clearInterval(gameInterval)
    }

    function resetTimer() {
        setGameInterval(null)
        setMiliseconds(0)
    }

    function padTo2Digits(num) {
        return num.toString().padStart(2, '0');
    }

    function convertMsToTime(milliseconds) {
        let deciseconds = Math.floor(milliseconds / 100)
        let seconds = Math.floor(milliseconds / 1000)
        let minutes = Math.floor(seconds / 60)
        let hours = Math.floor(minutes / 60)
      
        deciseconds = deciseconds % 10
        seconds = seconds % 60;
        minutes = minutes % 60;
      
        return `${padTo2Digits(minutes)}:${padTo2Digits(seconds)},${deciseconds}`;
    }

    function setGameWon() {
        setGameWin(true)
        stopTimer()
        fanfareSound.play();
    }

    function checkIfWon() {
        const allHeld = dice.every(die => die.isHeld)
        const compareValue = dice[0].value
        const allSameValues = dice.every(die => die.value === compareValue)

        // game won
        if (allHeld && allSameValues) {
            setGameWon()
        }
    }

    function resetGame() {
        setGameWin(false)
        setDice(getAllNewDice())
        setMovesNumber(0)
        resetTimer()
    }
    
    function getOneNewDie() {
        let randomValue = Math.ceil(Math.random() * 6)
        return (
            {
                id: nanoid(),
                value: randomValue,
                isHeld: false
            }
        )
    }

    function getAllNewDice() {
        const diceArray = []
        for (let i = 0; i < 10; i++) {
            diceArray.push(getOneNewDie())
        }
        return diceArray;
    }

    function handleButtonClick() {
        if (gameWin) {
            resetGame()
        }
        else {
            setDice(prevDice => (
                prevDice.map(die => (
                    die.isHeld ? die : getOneNewDie()
                ))
            ))
            setMovesNumber(prevMovesNumber => ++prevMovesNumber)

            if (!miliseconds) {
                startTimer()
            } 
        }
    }

    function toggleHeld(id) {
        if (!gameWin) {
            setDice(prevDice => (
                prevDice.map(die => (
                        die.id === id ? {...die, isHeld: !die.isHeld} : die
                ))
            ))

            if (!miliseconds) {
                startTimer()
            } 
        }
    }

    const dieElements = dice.map(die => (
        <Die 
            value={die.value}
            isHeld={die.isHeld}
            toggleHeld={() => toggleHeld(die.id)}
        />
    ))

    return (
        <main>
            {gameWin && <Confetti />}
            <h1 className="title">Tenzies</h1>

            <p className="description">
                Roll until all dice are the same. Click each die to freeze
                it at its current value between rolls.
            </p>

            <div className="dice-container">
                {dieElements}
            </div>

            <button className="main-button" onClick={handleButtonClick}>{gameWin ? "Reset game" : "Roll"}</button>

            <div className="stats">
                <div className="moves">
                    <span className="stats--title">Moves: </span>
                    <span className="stats--value">{movesNumber}</span>
                </div>
                <div className="timer">
                    <span className="stats--title">Time: </span>
                    <span className="stats--value">{convertMsToTime(miliseconds)}</span>
                </div>
            </div>
        </main>
    )
}
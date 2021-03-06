import React from "react"
import Die from "./Die"
import Timer from "./Timer"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"

const fanfareSound = new Audio('/sounds/fanfare.mp3')
const diceSound = new Audio('/sounds/throw_dice.mp3')
const dieClickSound = new Audio('/sounds/die_click.mp3')
const dieUnclickSound = new Audio('/sounds/die_unclick.mp3')

export default function App() {
    const [dice, setDice] = React.useState(() => getAllNewDice())
    const [gameWin, setGameWin] = React.useState(false) 
    const [movesNumber, setMovesNumber] = React.useState(0)
    const [timerCommand, setTimerCommand] = React.useState("stop")
    const [miliseconds, setMiliseconds] = React.useState(0)
    const [isBestTime, setIsBestTime] = React.useState(false)

    React.useEffect(() => checkIfWon()
    , [dice])

    React.useEffect(() => {
        if (miliseconds) {  // miliseconds będą dodanie dopiero wtedy, gdy wykona się komenda stop() w Timerze, bo gra będzie wygrana
            if (localStorage.getItem("bestTime") === null || parseInt(localStorage.getItem("bestTime")) > miliseconds) {
                localStorage.setItem("bestTime", miliseconds.toString())
                setIsBestTime(true)
            }
        }
    }, [miliseconds])
    
    function checkIfWon() {
        const allHeld = dice.every(die => die.isHeld)
        const compareValue = dice[0].value
        const allSameValues = dice.every(die => die.value === compareValue)

        // game won
        if (allHeld && allSameValues) {
            setGameWin(true)
            setTimerCommand("stop")
            fanfareSound.play()
        }
    }

    function resetGame() {
        setGameWin(false)
        setDice(getAllNewDice())
        setMovesNumber(0)
        setTimerCommand("reset")
        setIsBestTime(false)
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
        return diceArray
    }

    function handleButtonClick() {
        if (gameWin) {
            resetGame()
        }
        else {
            diceSound.play()
            setDice(prevDice => (
                prevDice.map(die => (
                    die.isHeld ? die : getOneNewDie()
                ))
            ))
            setMovesNumber(prevMovesNumber => ++prevMovesNumber)
            setTimerCommand("start")
        }
    }

    function toggleHeld(id) {
        if (!gameWin) {
            setDice(prevDice => (
                prevDice.map(die => {
                        die.id === id && die.isHeld ? dieUnclickSound.play() : dieClickSound.play()
                        return die.id === id ? {...die, isHeld: !die.isHeld} : die
                })
            ))
            setTimerCommand("start")
        }
    }

    const dieElements = dice.map(die => (
        <Die 
            key={die.id}
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
                <div>{isBestTime && "Best time! :)"}</div>
                <div className="timer">
                    <span className="stats--title">Time: </span>
                    <span className="stats--value">
                        <Timer command={timerCommand} getMiliseconds={(ms) => setMiliseconds(ms)} />
                    </span>
                </div>
            </div>
        </main>
    )
}
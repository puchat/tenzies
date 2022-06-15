import React from "react"
import Die from "./Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"

export default function App() {
    const [dice, setDice] = React.useState(() => getAllNewDice())
    const [gameWin, setGameWin] = React.useState(false) 
    const [movesNumber, setMovesNumber] = React.useState(0)

    React.useEffect(() =>
        {
            const allHeld = dice.every(die => die.isHeld)
            const compareValue = dice[0].value
            const allSameValues = dice.every(die => die.value === compareValue)

            if (allHeld && allSameValues) {
                setGameWin(true)
            }

        }
    , [dice])
    
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
            setGameWin(false)
            setDice(getAllNewDice())
            setMovesNumber(0)
        }
        else {
            setDice(prevDice => (
                prevDice.map(die => (
                    die.isHeld ? die : getOneNewDie()
                ))
            ))
            setMovesNumber(prevMovesNumber => ++prevMovesNumber)
        }
    }

    function toggleHeld(id) {
        if (!gameWin)
            setDice(prevDice => (
                prevDice.map(die => (
                        die.id === id ? {...die, isHeld: !die.isHeld} : die
                ))
            ))
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
                    <span className="stats--title">Timer: </span>
                    <span className="stats--value">00:00,0</span>
                </div>
            </div>
        </main>
    )
}
import React from "react"
import Die from "./Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"

export default function App() {
    const [dice, setDice] = React.useState(() => getAllNewDice())
    const [gameWin, setGameWin] = React.useState(false) 

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

    function rollDice() {
        if (gameWin) {
            setGameWin(false)
            setDice(getAllNewDice())
        }
        else {
            setDice(prevDice => (
                prevDice.map(die => (
                    die.isHeld ? die : getOneNewDie()
                ))
            ))
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
            <button className="main-button" onClick={rollDice}>{gameWin ? "Reset game" : "Roll"}</button>
        </main>
    )
}
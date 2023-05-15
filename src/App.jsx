import { useState } from "react"
import { Square } from "./components/Square.jsx"
import { TURNS } from "./constants.js"
import { chekWinnerFrom, chekEndGame } from "./logic/board.js"
import { WinnerModal } from "./components/WinnerModal.jsx"

function App() {
const [board, setBoard] = useState(() => {
  const boardFromStorage = window.localStorage.getItem('board')
  if (boardFromStorage) return JSON.parse(boardFromStorage)
  return Array(9).fill(null)
})

const [turn, setTurn] = useState(() => {
  const turnFromStorage = window.localStorage.getItem('turn')
  return turnFromStorage ?? TURNS.X
  })

const [winner, setWinner] = useState(null) //null, no hay ganador. False es empate

const resetGame = () => {
  setBoard(Array(9).fill(null))
  setTurn(TURNS.X)
  setWinner(null)

  window.localStorage.removeItem('board')
  window.localStorage.removeItem('turn')
}

const updateBoard = (index) =>{
  //no actualizamos el board si ya tiene algo asignado (x / o)
  if(board[index] || winner) return
  
  //actualizamos el board
  const newBoard = [...board]
  newBoard[index] = turn 
  setBoard(newBoard)
  
  //cambio de turnos
  const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X
  setTurn(newTurn)

  //guardar partida
  window.localStorage.setItem('board', JSON.stringify(newBoard))
  window.localStorage.setItem('turn', newTurn)

  //comprobamos si hay ganador
  const newWinner = chekWinnerFrom(newBoard)
  if(newWinner) {
    setWinner(newWinner)
  } else if (chekEndGame(newBoard)) {
    setWinner(false)
  }
}

 return (
  <main className="board">
    <h1>Tic Tac Toe</h1>
    <button onClick={resetGame}>Reiniciar tablero</button>
    <section className="game">
      {
        board.map((_,index) =>{
          return (
            <Square 
            key={index} 
            index={index}
            updateBoard={updateBoard}>
            {board[index]}
            </Square>
          )
        })
      }
    </section>
    <section className="turn">
      <Square isSelected={turn === TURNS.X}>
      {TURNS.X}
      </Square>
      <Square isSelected={turn === TURNS.O}>
      {TURNS.O}
      </Square>
    </section>
   
    <WinnerModal resetGame={resetGame} winner={winner} />

    
  </main>
  )
}

export default App

import { createRef, useEffect, useState } from "react";
import Board from "./Board";

export default function Game(props) {
  const { dimension = 3 } = props;
  const PLAYERX = "X";
  const PLAYERO = "O";
  const INIT_PLAYER = PLAYERX;
  const _initialSquares = Array(dimension).fill(Array(dimension).fill(null));
  const _initialSquareRefs = [...Array(dimension)].map((_a) =>
    [...Array(dimension)].map((_d) => createRef())
  );
  const _initialStrokeCoOrds = [];
  const _initHistory = [
    {
      squares: _initialSquares,
      currentPlayer: INIT_PLAYER,
      gameStatus: "game-init",
      stroke: [],
      description: "Game Initialized"
    }
  ];
  const _initGameData = {
    gameStatus: "game-init",
    currentPlayer: INIT_PLAYER,
    history: _initHistory,
    squareRefs: _initialSquareRefs,
    moveId: 0,
    status: "",
    stroke: _initialStrokeCoOrds
  };
  const [gameData, setGameData] = useState(_initGameData);

  function resetGame() {
    setGameData(_initGameData);
  }

  function getWinStrokes(rowId, columnId, squares) {
    return (
      isLeftDiagonalWin(rowId, columnId, squares) ||
      isRightDiagonalWin(rowId, columnId, squares) ||
      isVerticalWin(rowId, columnId, squares) ||
      isHorizontalWin(rowId, columnId, squares)
    );
  }

  function isDraw(squares) {
    const emptyCells = squares.filter((_row) => {
      return _row.filter((_col) => _col === null).length !== 0;
    });
    return emptyCells.length === 0;
  }

  function isLeftDiagonalWin(rowId, columnId, squares) {
    const totalColumns = squares.length;
    if (rowId === columnId) {
      let prevLValue = squares[0][0];
      if (!prevLValue) return false;
      /** Check left diagonal */
      const strokeCoOrdIds = [];
      for (let row = 0; row < totalColumns; row++) {
        if (squares[row][row] !== prevLValue) {
          strokeCoOrdIds.length = 0;
          break;
        }
        strokeCoOrdIds.push(`${row}-${row}`);
      }
      if (strokeCoOrdIds.length === totalColumns) {
        return strokeCoOrdIds;
      }
    }
  }

  function isRightDiagonalWin(rowId, columnId, squares) {
    const totalColumns = squares.length;
    if (rowId + columnId === totalColumns - 1) {
      let prevRValue = squares[0][totalColumns - 1];
      if (!prevRValue) return false;
      /** Check right diagonal */
      let strokeCoOrdIds = [];
      for (let row = 0; row < totalColumns; row++) {
        const column = totalColumns - 1 - row;
        if (squares[row][column] !== prevRValue) {
          strokeCoOrdIds.length = 0;
          break;
        }
        strokeCoOrdIds.push(`${row}-${column}`);
      }
      if (strokeCoOrdIds.length === totalColumns) {
        return strokeCoOrdIds;
      }
    }
  }

  function isVerticalWin(rowId, columnId, squares) {
    const currentValue = squares[rowId][columnId];
    const totalRows = squares.length;
    let strokeCoOrdIds = [];
    for (var row = 0; row < totalRows; row++) {
      if (squares[row][columnId] !== currentValue) {
        strokeCoOrdIds.length = 0;
        break;
      }
      strokeCoOrdIds.push(`${row}-${columnId}`);
    }
    if (strokeCoOrdIds.length === totalRows) {
      return strokeCoOrdIds;
    }
  }

  function isHorizontalWin(rowId, columnId, squares) {
    const currentValue = squares[rowId][columnId];
    const totalColumns = squares.length;
    let strokeCoOrdIds = [];
    for (var col = 0; col < totalColumns; col++) {
      if (squares[rowId][col] !== currentValue) {
        strokeCoOrdIds.length = 0;
        break;
      }
      strokeCoOrdIds.push(`${rowId}-${col}`);
    }
    if (strokeCoOrdIds.length === totalColumns) {
      return strokeCoOrdIds;
    }
  }

  function handleSquareClick(id) {
    if (["game-over", "game-draw"].includes(gameData.gameStatus)) return;
    setGameData((oldData) => {
      if (id) {
        const { history, moveId, gameStatus, currentPlayer } = oldData;
        const [rowId, columnId] = id.split("-").map(Number);
        const _history = history.slice(0, moveId + 1);
        const { squares } = _history[_history.length - 1];
        if (squares[rowId][columnId]) {
          return oldData;
        }

        const newSquares = squares.slice();
        newSquares[rowId] = [...newSquares[rowId]];
        newSquares[rowId][columnId] = currentPlayer;

        let _gameStatus = gameStatus;
        let _currentPlayer = currentPlayer;
        let _stroke = getWinStrokes(rowId, columnId, newSquares) || [];
        if (_stroke.length) {
          _gameStatus = "game-over";
        } else if (isDraw(newSquares)) {
          _gameStatus = "game-draw";
        } else {
          _gameStatus = "game-play";
          _currentPlayer = currentPlayer === PLAYERX ? PLAYERO : PLAYERX;
        }
        const historyObj = {
          squares: newSquares,
          currentPlayer: currentPlayer,
          gameStatus: _gameStatus,
          stroke: _stroke,
          description: `${
            currentPlayer === PLAYERX
              ? `You (${currentPlayer})`
              : `AI (${currentPlayer})`
          } played at square [${rowId}-${columnId}]`
        };
        const _newHistory = _history.concat([historyObj]);

        return {
          ...oldData,
          moveId: _newHistory.length - 1,
          history: _newHistory,
          gameStatus: _gameStatus,
          currentPlayer: _currentPlayer,
          stroke: _stroke
        };
      }
      return oldData;
    });
  }

  function handleHistoryClick(moveId) {
    setGameData((_o) => {
      const { gameStatus, stroke, currentPlayer } = _o.history[moveId];
      return {
        ..._o,
        moveId,
        gameStatus,
        stroke,
        currentPlayer:
          gameStatus === "game-init"
            ? currentPlayer
            : currentPlayer === PLAYERX
            ? PLAYERO
            : PLAYERX
      };
    });
  }

  useEffect(() => {
    function randomCell() {
      const rowIndex = Math.floor(Math.random() * dimension);
      const colIndex = Math.floor(Math.random() * dimension);
      return { row: rowIndex, col: colIndex };
    }

    const {
      currentPlayer,
      history,
      gameStatus,
      squareRefs,
      status,
      moveId
    } = gameData;

    if (currentPlayer === PLAYERO) {
      const current = history[moveId];
      if (gameStatus === "game-play") {
        let squareCoOrd = {};
        do {
          squareCoOrd = randomCell();
        } while (current.squares[squareCoOrd.row][squareCoOrd.col]);
        squareRefs[squareCoOrd.row][squareCoOrd.col].current.click();
      }
    }

    let _newStatus = status;
    if (gameStatus === "game-init") {
      _newStatus = `Next Player: You (${INIT_PLAYER})`;
    }
    if (gameStatus === "game-play") {
      _newStatus = `Next Player: ${
        currentPlayer === PLAYERO ? `AI (${PLAYERO})` : `You (${PLAYERX})`
      } `;
    }
    if (gameStatus === "game-over") {
      _newStatus = `${
        currentPlayer === PLAYERO ? `AI (${PLAYERO})` : `You (${PLAYERX})`
      } Won!!`;
    }
    if (gameStatus === "game-draw") {
      _newStatus = "Draw!!";
    }
    console.log(_newStatus);
    setGameData((_o) => {
      return { ..._o, status: _newStatus };
    });
  }, [gameData.currentPlayer, gameData.gameStatus]);

  return (
    <div className="col d-flex flex-column h-100">
      <div className="title">
        <span>TIC</span>-<span style={{ color: "#d61c4e" }}>TAC</span>-
        <span>TOE</span>
      </div>
      <div className="row w-100 m-auto flex-grow-1 overflow-auto">
        <div className="col border game-board h-100">
          <div className="row w-100 p-2 border">
            <div className="d-flex flex-row flex-wrap justify-content-between align-items-center p-0">
              <div className="status btn-sm">{gameData.status}</div>
              {["game-over", "game-draw"].includes(gameData.gameStatus) && (
                <button className="btn btn-primary btn-sm" onClick={resetGame}>
                  New Game
                </button>
              )}
            </div>
          </div>
          <div className="row w-100 p-2 border flex-grow-1 align-items-center">
            <Board
              data={{
                squares: gameData.history[gameData.moveId].squares,
                stroke: gameData.stroke
              }}
              refs={gameData.squareRefs}
              onClick={(id) => handleSquareClick(id)}
            />
          </div>
        </div>
        <div className="col border game-info">
          <ol className="list-group list-group-numbered">
            {gameData.history.map((_his, moveId) => {
              return (
                <li
                  key={moveId}
                  className={`list-group-item list-group-item-action ${
                    gameData.moveId === moveId ? "active" : ""
                  }`}
                  onClick={() => {
                    handleHistoryClick(moveId);
                  }}
                >
                  {_his.description}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}

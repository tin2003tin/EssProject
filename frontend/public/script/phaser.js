import {
  changeGameState,
  deleteRoom,
  getRoom,
  kickRoom,
  updateBoard,
} from "./api.js";

var player = "null";
var SelectedChecker;
var isStart = false;
var currentRoom;
var isEnd = false;
var whoWin;

class Move {
  constructor(col, row, isForce, cuptureCol, cuptureRow) {
    this.row = row;
    this.col = col;
    this.isForce = isForce;
    this.cuptureCol = cuptureCol;
    this.cuptureRow = cuptureRow;
  }
}
class Checker {
  constructor(scene, type, col, row) {
    this.color;
    this.isKing;
    this.col = col;
    this.row = row;
    this.type = type;
    this.piece_type;
    this.moveable = [];
    const tileSize = 100;
    const x = col * tileSize + tileSize / 2;
    const y = row * tileSize + tileSize / 2;
    switch (type) {
      case 1:
        this.piece_type = "white_piece";
        this.color = "white";
        this.isKing = false;
        break;
      case 2:
        this.piece_type = "king_white_piece";
        this.color = "white";
        this.isKing = true;
        break;
      case -1:
        this.piece_type = "black_piece";
        this.color = "black";
        this.isKing = false;
        break;
      case -2:
        this.piece_type = "king_black_piece";
        this.color = "black";
        this.isKing = true;
        break;
      case 0:
        this.piece_type = "empty_piece";
        this.color = "blank";
        break;
    }
    if (!scene) {
      return;
    }
    if (this.piece_type !== "empty_piece") {
      this.sprite = scene.add.image(x, y, this.piece_type).setScale(0.1);
    } else {
      this.sprite = scene.add.rectangle(x, y, 100, 100, 0xffa500, 0.0);
    }
    this.sprite.setInteractive();

    this.sprite.on("pointerdown", () => {
      if (!isStart) {
        return;
      }
      console.log("Piece clicked!", this.row, this.col, this.type);
      if (!SelectedChecker || SelectedChecker.color === "blank") {
        if (player === this.color) {
          SelectedChecker = this;
          SelectedChecker.sprite.setAlpha(0.8);
          SelectedChecker.showMoveable();
        } else {
          console.log("You can not move this checker");
        }
      } else {
        if (this.color === "blank") {
          let isValidMove = this.isValidToMove();
          let cupture = [];
          SelectedChecker.clearMoveableShowed();
          if (isValidMove) {
            const isPromote = this.checkKingPromotion();
            if (isPromote) {
              SelectedChecker.isKing = isPromote;
            }
            cupture = this.cupture(scene);
            Board.ForceToMove = false;
            if (cupture.length > 0) {
              this.checkIsJump(SelectedChecker.isKing, cupture);
            }

            updateBoard(
              currentRoom._id,
              localStorage.getItem("playerID"),
              [SelectedChecker.col, SelectedChecker.row],
              [this.col, this.row],
              cupture,
              Board.ForceToMove,
              SelectedChecker.isKing
            );
            player = "null";
            Board.LastFetchTime = 1500;
          }
          SelectedChecker.sprite.setAlpha(1);
          SelectedChecker = null;
        } else {
          if (SelectedChecker.color === this.color) {
            if (
              SelectedChecker.col === this.col &&
              SelectedChecker.row === this.row
            ) {
              SelectedChecker.sprite.setAlpha(1);

              SelectedChecker.clearMoveableShowed();
              SelectedChecker = null;
            } else {
              SelectedChecker.sprite.setAlpha(1);

              SelectedChecker.clearMoveableShowed();

              SelectedChecker = this;
              SelectedChecker.sprite.setAlpha(0.8);
              SelectedChecker.showMoveable();
            }
          } else {
            SelectedChecker.sprite.setAlpha(1);

            SelectedChecker.clearMoveableShowed();
            SelectedChecker = null;
          }
        }
      }
    });
  }
  checkIsJump(isking, cupture) {
    const checker = new Checker(null, SelectedChecker.type, this.col, this.row);
    checker.isKing = isking;
    SelectedChecker.color = "blank";
    Board.BoardCheckers[cupture[0] + cupture[1] * 8].color = "blank";
    checker.getMoveable();
    console.log(checker.moveable);
  }
  checkKingPromotion() {
    if (
      SelectedChecker.color == "black" &&
      this.row == 0 &&
      SelectedChecker.type == -1
    ) {
      return true;
    } else if (
      SelectedChecker.color == "white" &&
      this.row == 7 &&
      SelectedChecker.type == 1
    ) {
      return true;
    }
    return false;
  }
  showMoveable() {
    SelectedChecker.moveable.forEach((move) => {
      if (Board.ForceToMove) {
        if (move.isForce) {
          Board.BoardCheckers[
            move.col + move.row * 8
          ].sprite.fillColor = 0x00ff00;
          Board.BoardCheckers[move.col + move.row * 8].sprite.fillAlpha = 1;
        }
      } else {
        Board.BoardCheckers[
          move.col + move.row * 8
        ].sprite.fillColor = 0x00ff00;
        Board.BoardCheckers[move.col + move.row * 8].sprite.fillAlpha = 1;
      }
    });
  }

  cupture() {
    for (var i = 0; i < SelectedChecker.moveable.length; i++) {
      if (
        SelectedChecker.moveable[i].row === parseInt(this.row) &&
        SelectedChecker.moveable[i].col === parseInt(this.col)
      ) {
        console.log("Captured a checker!");
        if (
          SelectedChecker.moveable[i].cuptureCol &&
          SelectedChecker.moveable[i].cuptureRow
        ) {
          const index =
            SelectedChecker.moveable[i].cuptureCol +
            SelectedChecker.moveable[i].cuptureRow * 8;
          const capturedChecker = Board.BoardCheckers[index];
          if (capturedChecker) {
            return [
              SelectedChecker.moveable[i].cuptureCol,
              SelectedChecker.moveable[i].cuptureRow,
            ];
          }
        }
      }
    }
    return [];
  }

  clearMoveableShowed() {
    SelectedChecker.moveable.forEach((move) => {
          Board.BoardCheckers[
            move.col + move.row * 8
          ].sprite.fillColor = 0xffa500;
          Board.BoardCheckers[move.col + move.row * 8].sprite.fillAlpha = 0.0;
    });
  }

  getMoveable() {
    if (this.type == null || this.type == 0) {
      return;
    }
    // console.log(this);
    // console.log(this.color, player);
    if (this.isKing && this.color == player) {
      this.move(this.col, this.row, true, true, true, true, false);
    } else if (this.type > 0 && player == this.color) {
      this.move(this.col, this.row, true, true, false, false, false);
    } else if (this.type < 0 && player == this.color) {
      this.move(this.col, this.row, false, false, true, true, false);
    }
  }

  move(col, row, down_left, down_right, up_left, up_right) {
    const directions = [
      { rowChange: 1, colChange: -1, canMove: down_left },
      { rowChange: 1, colChange: 1, canMove: down_right },
      { rowChange: -1, colChange: -1, canMove: up_left },
      { rowChange: -1, colChange: 1, canMove: up_right },
    ];
    for (let i = 0; i < 4; i++) {
      if (directions[i].canMove) {
        const nextRow = row + directions[i].rowChange;
        const nextCol = col + directions[i].colChange;
        if (0 <= nextCol && nextCol < 8 && 0 <= nextRow && nextRow < 8) {
          const target = Board.BoardCheckers[nextCol + nextRow * 8];

          if (target.color === "blank") {
            if (this.isKing) {
              this.move(nextCol, nextRow, i == 0, i == 1, i == 2, i == 3);
            }
            this.moveable.push(new Move(nextCol, nextRow, false));
          } else if (target.color !== this.color) {
            const nextNextRow = nextRow + directions[i].rowChange;
            const nextNextCol = nextCol + directions[i].colChange;
            const nextTarget =
              Board.BoardCheckers[nextNextCol + nextNextRow * 8];
            if (
              0 <= nextNextCol &&
              nextNextCol < 8 &&
              0 <= nextNextRow &&
              nextNextRow < 8
            ) {
              if (nextTarget.color === "blank") {
                this.moveable.push(
                  new Move(nextNextCol, nextNextRow, true, nextCol, nextRow)
                );

                Board.ForceToMove = true;
              }
            }
          } else {
          }
        }
      }
    }
  }

  isValidToMove() {
    let valid = false;
    SelectedChecker.moveable.forEach((element) => {
      if (Board.ForceToMove) {
        if (
          element.isForce &&
          element.row == this.row &&
          element.col == this.col
        ) {
          valid = true;
        }
      } else if (element.row == this.row && element.col == this.col) {
        valid = true;
      }
    });
    return valid;
  }
}

class Board extends Phaser.Scene {
  static BoardCheckers = [];
  static LastFetchTime = 0;
  static Board = [];
  static ForceToMove = false;
  static fetchInterval = 2000;
  preload() {
    this.load.image("board", "assets/board.png");
    this.load.image("white_piece", "assets/white_piece.png");
    this.load.image("black_piece", "assets/black_piece.png");
    this.load.image("king_white_piece", "assets/king_white_piece.png");
    this.load.image("king_black_piece", "assets/king_black_piece.png");
  }

  async create() {
    this.add.image(400, 400, "board");
    const room = await this.getUpdateGame();
    // console.log("yeah")
    // console.log(room)
    // console.log(Board.Board)
    // console.log(player)
    this.initAllChecker();
  }
  initAllChecker() {
    // console.log(Board.Board)
    for (let row = 0; row < Board.Board.length; row++) {
      for (let col = 0; col < Board.Board[row].length; col++) {
        const value = Board.Board[row][col];
        const checker = new Checker(this, parseInt(value), col, row);
        Board.BoardCheckers.push(checker);
      }
    }
    // console.log(Board.BoardCheckers)
    Board.setAllMoveblePlace();
  }
  static clearAllMoveable() {
    Board.BoardCheckers.forEach((checker) => {
      checker.moveable.forEach(() => []);
    });
  }

  update(time, delta) {
    Board.LastFetchTime += delta;
    if (Board.LastFetchTime >= Board.fetchInterval) {
      Board.LastFetchTime = 0;
      Board.fetchInterval = 1500;
      if (!isEnd) {
        this.getUpdateGame();
      }
    }
  }

  async getUpdateGame() {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = localStorage.getItem("playerID");
    const roomId = urlParams.get("roomid");

    try {
      const room = await getRoom(roomId, userId);
      currentRoom = room;
      console.log(currentRoom);
      if (room.gameState == "waiting") {
        this.waitingState(room);
      }
      if (room.gameState == "running") {
        this.runningState(room);
      }
      if (room.gameState == "ended") {
        this.endedState(room);
      }
      return room;
    } catch (error) {
      console.error("Error fetching room details:", error);
    }
  }

  changePosition() {
    let changed = false;
    for (let i = 0; i < Board.Board.length * 8; i++) {
      const row = Math.floor(i / 8);
      const col = i % 8;
      if (Board.Board[row][col] !== Board.BoardCheckers[i].type.toString()) {
        Board.BoardCheckers[i].sprite.destroy();
        const value = Board.Board[row][col];
        Board.BoardCheckers[i] = new Checker(this, parseInt(value), col, row);
        changed = true;
      }
    }
    if (changed) {
      Board.setAllMoveblePlace();
    }
  }
  waitingState(room) {
    Board.Board = room.board;
    showPlayersName(room);
    if (
      room.ownerId == localStorage.getItem("playerID") &&
      room.playerId !== "NaN"
    ) {
      const gameStateText = document.getElementById("gameState-text");
      gameStateText.textContent = "waiting";
      isStart = false;

      const startButton = document.getElementById("start-button");
      startButton.addEventListener("click", () => {
        changeGameState(room._id, "running");
      });
      console.log(startButton);
      startButton.style.display = "block";
      const kickButton = document.getElementById("kick-button");
      kickButton.style.display = "block";
      kickButton.addEventListener("click", () => {
        kickRoom(room._id);
      });
    } else {
      const startButton = document.getElementById("start-button");
      startButton.style.display = "none";
      const kickButton = document.getElementById("kick-button");
      kickButton.style.display = "none";
    }
  }

  runningState(room) {
    isStart = true;
    const startButton = document.getElementById("start-button");
    startButton.style.display = "none";
    const kickButton = document.getElementById("kick-button");
    kickButton.style.display = "none";
    const gameStateText = document.getElementById("gameState-text");
    gameStateText.textContent = "running";
    Board.Board = room.board;
    player = "null";
    if (
      room.playerTurn == "owner" &&
      localStorage.getItem("playerID") == room.ownerId
    ) {
      player = "black";
    } else if (
      room.playerTurn == "player" &&
      localStorage.getItem("playerID") == room.playerId
    ) {
      player = "white";
    }
    const playerturn = document.getElementById("player-turn");
    playerturn.textContent =
      "player turn: " + (player == "null" ? "Opponent" : "Me");
    if (isStart) {
      this.changePosition();
    }
    console.log("current", player);
    if (this.checkEnded(room.board)) {
      changeGameState(room._id, "ended");
    }
  }
  endedState(room) {
    this.changePosition();
    this.checkEnded(room.board);
    const gameStateText = document.getElementById("gameState-text");
    gameStateText.textContent = "ended";
    const winnerText = document.getElementById("winner");
    winnerText.textContent = whoWin;
    isEnd = true;
    const endCounter = document.getElementById("end-counting");
    let countdown = 10;
    const intervalId = setInterval(async () => {
      if (countdown > 0) {
        countdown--;
        endCounter.textContent = countdown.toString();
      } else {
        clearInterval(intervalId);
        await deleteRoom(room._id);
        window.location.href = "/room";
      }
    }, 1000);
  }

  checkEnded(board) {
    let black = 0;
    let min_black = 0;
    let white = 0;
    let min_white = 0;
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board.length; col++) {
        if (black <= 1 || white <= 1) {
          if (parseInt(board[row][col]) < 0) {
            black++;
            min_black = Math.abs(parseInt(board[row][col]));
          } else if (parseInt(board[row][col]) > 0) {
            white++;
            min_white = Math.abs(parseInt(board[row][col]));
          }
        } else {
          console.log(white, black);
          return false;
        }
      }
    }
    console.log(white);
    console.log(black);

    let white_moveable = false;
    let black_moveable = false;
    Board.BoardCheckers.forEach((checker) => {
      if (checker.color == "white" && checker.moveable.length > 0) {
        white_moveable = true;
      }
      if (checker.color == "black" && checker.moveable.length > 0) {
        black_moveable = true;
      }
    });
    if (!white_moveable) {
      whoWin = currentRoom.playerName;
      return true;
    }
    whoWin = currentRoom.ownerName;
    if (!black_moveable) {
      return true;
    }

    if (black == 1 && white == 1) {
      if (min_black == min_white) {
        whoWin = "draw";
        return true;
      } else {
        return false;
      }
    }
    if (black == 0) {
    }
    if (white == 0) {
      whoWin = currentRoom.ownerName;
      return true;
    }
    return false;
  }

  static setAllMoveblePlace() {
    Board.clearAllMoveable();
    Board.ForceToMove = false;
    Board.BoardCheckers.forEach((checker) => {
      checker.getMoveable();
      // console.log(checker.moveable);
    });
  }
}

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 800,
  scene: Board,
};
const game = new Phaser.Game(config);

function showPlayersName(room) {
  const owner_name = document.getElementById("owner-name");
  owner_name.textContent = "Black: " + room.ownerName;
  const player_name = document.getElementById("player-name");
  player_name.textContent = "White: " + room.playerName;
}

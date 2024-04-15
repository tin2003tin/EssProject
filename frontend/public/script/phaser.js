var player = "black";
var SelectedChecker;

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

    if (this.piece_type !== "empty_piece") {
      this.sprite = scene.add.image(x, y, this.piece_type).setScale(0.08);
    } else {
      this.sprite = scene.add.rectangle(x, y, 100, 100, 0xffa500, 0.0);
    }
    this.sprite.setInteractive();

    this.sprite.on("pointerdown", () => {
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
          if (isValidMove) {
            SelectedChecker.clearMoveableShowed();
            this.cupture(scene);
            [
              Board.BoardCheckers[this.col + this.row * 8],
              Board.BoardCheckers[
                SelectedChecker.col + SelectedChecker.row * 8
              ],
            ] = [
              Board.BoardCheckers[
                SelectedChecker.col + SelectedChecker.row * 8
              ],
              Board.BoardCheckers[this.col + this.row * 8],
            ];

            let temp_sprite_x = this.sprite.x;
            let temp_sprite_y = this.sprite.y;
            let temp_col = this.col;
            let temp_row = this.row;

            this.sprite.x = SelectedChecker.sprite.x;
            this.sprite.y = SelectedChecker.sprite.y;
            this.col = SelectedChecker.col;
            this.row = SelectedChecker.row;

            SelectedChecker.sprite.x = temp_sprite_x;
            SelectedChecker.sprite.y = temp_sprite_y;
            SelectedChecker.col = temp_col;
            SelectedChecker.row = temp_row;
          }
          player = player === "black" ? "white" : "black";
          this.checkKingPromotion();
          Board.setAllMoveblePlace();
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
  checkKingPromotion() {
    if (
      SelectedChecker.color == "black" &&
      SelectedChecker.row == 0 &&
      SelectedChecker.type == -1
    ) {
      SelectedChecker.piece_type = "king_black_piece";
      SelectedChecker.type = -2;
      SelectedChecker.isKing = true;
      SelectedChecker.sprite.setTexture("king_black_piece");
    } else if (
      SelectedChecker.color == "white" &&
      SelectedChecker.row == 7 &&
      SelectedChecker.type == 1
    ) {
      SelectedChecker.piece_type = "king_white_piece";
      SelectedChecker.type = 2;
      SelectedChecker.isKing = true;
      SelectedChecker.sprite.setTexture("king_white_piece");
    }
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

  cupture(scene) {
    SelectedChecker.moveable.forEach((element) => {
      if (
        element.row === parseInt(this.row) &&
        element.col === parseInt(this.col)
      ) {
        console.log("Captured a checker!");
        if (element.cuptureCol && element.cuptureRow) {
          const index = element.cuptureCol + element.cuptureRow * 8;
          const capturedChecker = Board.BoardCheckers[index];
          if (capturedChecker) {
            capturedChecker.sprite.destroy();
            Board.BoardCheckers[index] = new Checker(
              scene,
              0,
              element.cuptureCol,
              element.cuptureRow
            );
          }
        }
      }
    });
  }

  clearMoveableShowed() {
    SelectedChecker.moveable.forEach((move) => {
      if (Board.ForceToMove) {
        if (move.isForce) {
          Board.BoardCheckers[
            move.col + move.row * 8
          ].sprite.fillColor = 0xffa500;
          Board.BoardCheckers[move.col + move.row * 8].sprite.fillAlpha = 0.0;
        }
      } else {
        Board.BoardCheckers[
          move.col + move.row * 8
        ].sprite.fillColor = 0xffa500;
        Board.BoardCheckers[move.col + move.row * 8].sprite.fillAlpha = 0.0;
      }
    });
  }

  getMoveable() {
    if (this.type == null || this.type == 0) {
      return;
    }

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
                console.log(nextNextCol, nextNextRow, true, nextCol, nextRow);
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
  static ForceToMove = false;
  preload() {
    this.load.image("board", "assets/board.png");
    this.load.image("white_piece", "assets/white_piece.png");
    this.load.image("black_piece", "assets/black_piece.png");
    this.load.image("king_white_piece", "assets/king_white_piece.png");
    this.load.image("king_black_piece", "assets/king_black_piece.png");
  }

  create() {
    this.lastFetchTime = 0;
    this.fetchInterval = 5000;
    this.add.image(400, 400, "board");
    this.board = this.initBoard();
    this.initAllChecker();
  }
  initAllChecker() {
    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        const value = this.board[row][col];
        const checker = new Checker(this, value, col, row);
        Board.BoardCheckers.push(checker);
      }
    }
    Board.setAllMoveblePlace();
  }
  initBoard() {
    const board = [
      ["", 1, "", 1, "", 1, "", 1],
      [1, "", 1, "", 1, "", 1, ""],
      ["", 0, "", 0, "", 0, "", 0],
      [0, "", 0, "", 0, "", 0, ""],
      ["", 0, "", 0, "", 0, "", 0],
      [0, "", 0, "", 0, "", 0, ""],
      ["", -1, "", -1, "", -1, "", -1],
      [-1, "", -1, "", -1, "", -1, ""],
    ];
    return board;
  }
  update(time, delta) {
    this.lastFetchTime += delta;
    if (this.lastFetchTime >= this.fetchInterval) {
      this.lastFetchTime = 0;
      let changed = false;
      for (let i = 0; i < this.board.length * 8; i++) {
        const row = Math.floor(i / 8);
        const col = i % 8;
        if (this.board[row][col] !== Board.BoardCheckers[i].type) {
          Board.BoardCheckers[i].sprite.destroy(); // Remove the old checker sprite

          const value = this.board[row][col];
          Board.BoardCheckers[i] = new Checker(this, value, col, row); // Add a new checker
          changed = true;
        }
      }
      if (changed) {
        Board.setAllMoveblePlace();
      }
    }
  }

  static setAllMoveblePlace() {
    Board.ForceToMove = false;
    Board.BoardCheckers.forEach((checker) => {
      checker.moveable = [];
      checker.getMoveable();
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

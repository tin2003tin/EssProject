class CheckerGame {
  constructor() {
    this.board = [
      ["", "red", "", "red", "", "red", "", "red"],
      ["red", "", "red", "", "red", "", "red", ""],
      ["", "red", "", "red", "", "red", "", "red"],
      ["", "", "", "", "", "", "", ""],
      ["", "", "", "", "", "", "", ""],
      ["black", "", "black", "", "black", "", "black", ""],
      ["", "black", "", "black", "", "black", "", "black"],
      ["black", "", "black", "", "black", "", "black", ""],
    ];

    this.currentPlayer = "red";
    this.gameOver = false;
  }

  printAsTable() {
    // Print top line separator
    console.log("    ---------------------------------");

    // Print column headers
    console.log(
      "    |   0    |   1    |   2    |   3    |   4    |   5    |   6    |   7    |"
    );

    // Print line separator
    console.log(
      "    -------------------------------------------------------------------------"
    );

    // Loop through each row of the board
    for (let row = 0; row < 8; row++) {
      let rowString = `${row}   |`; // Row index with left side border

      // Loop through each column of the row
      for (let col = 0; col < 8; col++) {
        const cellValue = this.board[row][col] || " "; // Empty cell if no piece

        // Append the cell value to the row string with proper spacing and borders
        rowString += `  ${cellValue.padEnd(5)} |`;
      }

      // Print the row string with right side border
      console.log(rowString);
      console.log(
        "    -------------------------------------------------------------------------"
      ); // Line separator between rows
    }
  }

  makeMove(startX, startY, endX, endY) {
    // Check if the game is already over
    if (this.gameOver) {
      console.log("Game over!");
      return;
    }

    // Check if it's the current player's turn
    const pieceColor = this.board[startY][startX];
    if (pieceColor[0] != "K" && pieceColor.slice(1) != this.currentPlayer) {
      console.log("It's not your turn!");
      return;
    } else if (pieceColor != this.currentPlayer) {
      console.log("It's not your turn!");
      return;
    }

    // Check if the move is valid
    if (!this.isValidMove(startX, startY, endX, endY)) {
      console.log("Invalid move!");
      return;
    }
    const dx = Math.abs(endX - startX);
    const dy = Math.abs(endY - startY);
    if (dx === 1 && dy === 1) {
      this.executeRegularMove(startX, startY, endX, endY);
    } else if (dx === 2 && dy === 2) {
      this.executeCaptureMove(startX, startY, endX, endY);
      // Check for double jump
      const possibleMoves = this.getPossibleCaptures(endX, endY);
      console.log(possibleMoves);
      if (possibleMoves.length > 0) {
        console.log("Double jump available! Choose another capture move.");
        return; // Wait for the next move
      }
    }
    if (this.checkKingPromotion(endX, endY)) {
      const possibleMoves = this.getPossibleCaptures(endX, endY);
      console.log(possibleMoves);
      if (possibleMoves.length > 0) {
        console.log("Double jump available! Choose another capture move.");
        return; // Wait for the next move
      }
    } else {
      this.board[endY][endX] = pieceColor;
      this.board[startY][startX] = "";
    }

    this.currentPlayer = this.currentPlayer === "black" ? "red" : "black";
  }

  isValidMove(startX, startY, endX, endY) {
    if (
      endX < 0 ||
      endX >= 8 ||
      endY < 0 ||
      endY >= 8 ||
      startX < 0 ||
      startY >= 8
    ) {
      return false;
    }
    return true;
  }
  executeRegularMove(startX, startY, endX, endY) {
    // Make the move
    this.board[endY][endX] = this.board[startY][startX];
    this.board[startY][startX] = ""; // Clear the starting position
  }
  executeCaptureMove(startX, startY, endX, endY) {
    // Calculate the position of the captured piece
    const captureX = (startX + endX) / 2;
    const captureY = (startY + endY) / 2;

    // Check if the captured piece belongs to the opponent and the target square is empty
    if (
      this.board[captureY][captureX] !== this.currentPlayer &&
      this.board[captureY][captureX] !== ""
    ) {
      // Capture the piece
      this.board[captureY][captureX] = "";
    }

    // Make the move
    this.board[endY][endX] = this.board[startY][startX];
    this.board[startY][startX] = ""; // Clear the starting position
  }

  checkKingPromotion(endX, endY) {
    const pieceColor = this.board[endY][endX];
    const isKingRow =
      (pieceColor === "black" && endY === 0) ||
      (pieceColor === "red" && endY === 7);

    if (isKingRow) {
      if (pieceColor === "black") {
        this.board[endY][endX] = "K" + this.board[endY][endX];
      } else if (pieceColor === "red") {
        this.board[endY][endX] = "K" + this.board[endY][endX];
      }

      return true;
    }

    return false;
  }

  getPossibleCaptures(x, y) {
    const captures = [];
    let directions = [
      [-2, -2],
      [2, -2],
      [2, 2],
      [-2, 2],
    ];
    console.log(this.board[y][x]);
    if (this.board[y][x][0] == "K") {
    } else if (this.currentPlayer === "black") {
      directions = directions.slice(0, 2);
    } else {
      directions = directions.slice(2);
    }
    for (const [dx, dy] of directions) {
      const captureX = x + dx / 2;
      const captureY = y + dy / 2;
      const nextX = x + dx;
      const nextY = y + dy;

      if (
        captureX >= 0 &&
        captureX < 8 &&
        captureY >= 0 &&
        captureY < 8 &&
        this.board[captureY][captureX] !== "" &&
        this.board[captureY][captureX] !== this.currentPlayer &&
        this.board[nextY][nextX] === ""
      ) {
        captures.push({ startX: x, startY: y, endX: nextX, endY: nextY });
      }
    }

    return captures;
  }
}

const checkerGame = new CheckerGame();
console.log("Initial board:");
checkerGame.printAsTable();
checkerGame.makeMove(1, 2, 2, 3);
checkerGame.printAsTable();
checkerGame.makeMove(0, 5, 1, 4);
checkerGame.printAsTable();
checkerGame.makeMove(2, 3, 0, 5);
checkerGame.printAsTable();
checkerGame.makeMove(2, 5, 3, 4);
checkerGame.printAsTable();
checkerGame.makeMove(3, 2, 4, 3);
checkerGame.printAsTable();
checkerGame.makeMove(4, 5, 5, 4);
checkerGame.printAsTable();
checkerGame.makeMove(4, 3, 2, 5);
checkerGame.printAsTable();
checkerGame.makeMove(4, 3, 2, 5);
checkerGame.printAsTable();
checkerGame.board[2][5] = "";
checkerGame.board[3][4] = "red";
checkerGame.board[0][1] = "";
checkerGame.board[0][5] = "";
checkerGame.board[3][2] = "red";
checkerGame.printAsTable();
checkerGame.makeMove(5, 4, 3, 2);
checkerGame.printAsTable();
console.log(checkerGame.currentPlayer);
checkerGame.makeMove(3, 2, 1, 0);
checkerGame.printAsTable();
console.log(checkerGame.currentPlayer);
checkerGame.board[6][3] = "red";
checkerGame.board[7][4] = "";
checkerGame.board[5][6] = "";
checkerGame.printAsTable();
console.log(checkerGame.currentPlayer);
checkerGame.makeMove(3, 6, 4, 7);

checkerGame.printAsTable();
console.log(checkerGame.currentPlayer);
checkerGame.board[3][4] = "black";
checkerGame.makeMove(4, 7, 6, 5);
checkerGame.printAsTable();
console.log(checkerGame.currentPlayer);

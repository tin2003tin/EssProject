#include <iostream>
#include <vector>

using namespace std;

//==========================
bool validInBlock(vector<vector<char>> &board, int row, int col) {
    string in_block = "";
    for (int i = 3 * (row / 3); i < 3 * (row / 3) + 3; i++) {
        for (int j = 3 * (col / 3); j < 3 * (col / 3) + 3; j++) {
            if (board[i][j] != '.' && in_block.find(board[i][j]) != string::npos)
                return false;
            in_block += board[i][j];
        }
    }
    return true;
}

bool validInRow(vector<vector<char>> &board, int row, int col) {
    for (int j = 0; j < 9; j++) {
        if (j != col && board[row][j] == board[row][col])
            return false;
    }
    return true;
}

bool validInCol(vector<vector<char>> &board, int row, int col) {
    for (int i = 0; i < 9; i++) {
        if (i != row && board[i][col] == board[row][col])
            return false;
    }
    return true;
}

bool isSudokuValid(vector<vector<char>> &board) {
    for (int row = 0; row < board.size(); row++) {
        for (int col = 0; col < board[row].size(); col++) {
            if (board[row][col] != '.') {
                if (!(validInBlock(board, row, col) && validInCol(board, row, col) && validInRow(board, row, col)))
                    return false;
            }
        }
    }
    return true;
}
//==========================


//==========================
bool vaildInput(char c, int row, int col, vector<vector<char>> &board) {
    for (int i = 0; i < board.size(); i++) {
        if (board[row][i] == c || board[i][col] == c || board[3*(row/3)+i/3][(col/3)+1%3] == c) {
            return false;
        }
    }
    return true;
}

bool solve(vector<vector<char>> &board) {
    for (int row = 0; row < board.size(); row++) {
        for (int col = 0; col < board[row].size(); col++) {
            if (board[row][col] == '.') {
                for (char c = '1'; c <= '9'; c++) {
                    if (vaildInput(c, row, col, board)) {
                        board[row][col] = c;
                        if (solve(board)) {
                            return true;
                        }
                        board[row][col] = '.';
                    }
                }
                return false;
            }
        }
    }
    return true;
}
//==========================

int main() {    
    vector<vector<char>> board={{'5','3','.','.','7','.','.','.','.'},
                                {'6','.','.','1','9','5','.','.','.'},
                                {'.','9','8','.','.','.','.','6','.'},
                                {'8','.','.','.','6','.','.','.','3'},
                                {'4','.','.','8','.','3','.','.','1'},
                                {'7','.','.','.','2','.','.','.','6'},
                                {'.','6','.','.','.','.','2','8','.'},
                                {'.','.','.','4','1','9','.','.','5'},
                                {'.','.','.','.','8','.','.','7','9'}};
    if (isSudokuValid(board)) {
        solve(board);
    for (const auto& row : board) {
        for (char cell : row) {
            cout << cell << " ";
        }
        cout << endl;
    }
    }
    else {
        cout << "The board is invaild patten! " << endl;
    }
    
    return 0;
}

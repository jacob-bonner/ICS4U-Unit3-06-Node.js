// Created By: Jacob Bonner
// Created On: January 2021
// This program is a tic tac toe game against the computer.

// Defining prompt for getting user input
const prompt = require('prompt-sync')({sigint: true});

// This function prints the current iteration of the game board
function printBoard(gameList) {
  // Setting parameters for the character array
  let stopper = 0;
  let adder = 0;

  // Initializing string value to print a singular line
  let listValue = "";

  // Printing the current iteration of the board
  for (let listCounter = 0; listCounter < gameList.length; listCounter++) {
    // Reseting the string value to contain nothing
    listValue = "";

    for (let printCounter = 0; printCounter < gameList[listCounter].length; printCounter++) {
      listValue = listValue + gameList[listCounter][printCounter];
      adder += 1;

      // Checking to see if the counter is on the last element of the array
      if (printCounter != 3) {
        if (adder % 3 == 0) {
          // Printing a seperation of rows
          listValue = listValue + " ";
          adder = 0;
          stopper = stopper + 1;
          if (stopper == 2 || stopper == 3) {
            console.log("---------");
          }
        } else {
          // Printing a seperation of columns
          listValue = listValue + " | ";
        }
      } else {
        continue;
      }
    }

    // Printing a row of the board
    console.log(listValue);
  }
}

// This function figures out if the array passed in has a winning condition
function winCondition(winBoard, playerToken, cpuToken) {
  // Checking for horizontal wins
  for (let horizontal = 0; horizontal < 3; horizontal++) {
    if (winBoard[horizontal][0] == winBoard[horizontal][1] 
        && winBoard[horizontal][0] == winBoard[horizontal][2]
        && winBoard[horizontal][1] == winBoard[horizontal][2]) {
      if (winBoard[horizontal][0] == playerToken) {
        return -10;
      } else if (winBoard[horizontal][0] == cpuToken) {
        return 10;
      } else {
        continue;
      }
    }
  }

  // Checking for vertical wins
  for (let vertical = 0; vertical < 3; vertical++) {
    if (winBoard[0][vertical] == winBoard[1][vertical] 
        && winBoard[0][vertical] == winBoard[2][vertical]
        && winBoard[1][vertical] == winBoard[2][vertical]) {
      if (winBoard[0][vertical] == playerToken) {
        return -10;
      } else if (winBoard[0][vertical] == cpuToken) {
        return 10;
      } else {
        continue;
      }
    }
  }

  // Checking for diagonal wins
  if (winBoard[0][0] == winBoard[1][1] && winBoard[0][0] == winBoard[2][2] 
      && winBoard[1][1] == winBoard[2][2]) {
    if (winBoard[0][0] == playerToken) {
      return -10;
    } else if (winBoard[0][0] == cpuToken) {
      return 10;
    }
  } else if (winBoard[0][2] == winBoard[1][1] 
             && winBoard[0][2] == winBoard[2][0] 
             && winBoard[1][1] == winBoard[2][0]) {
    if (winBoard[2][0] == playerToken) {
      return -10;
    } else if (winBoard[2][0] == cpuToken) {
      return 10;
    }
  }

  // Returning 0 if no winner has been determined yet
  return 0;
}

// This function finds if there are any open spaces left on the board
function openSpaces(tieBoard, tokenX, tokenO) {
  // Looping through all indexes to find if there are empty spaces
  for (let drawCounter = 0; drawCounter < tieBoard.length; drawCounter++) {
    for (let tieCounter = 0; tieCounter < tieBoard.length; tieCounter++) {
      if (tieBoard[drawCounter][tieCounter] != tokenX 
          && tieBoard[drawCounter][tieCounter] != tokenO) {
        return true;
      }
    }
  }

  // Returning false if there are still empty spaces
  return false;
}

// This function finds the best possible score or outcome of a move through
//   recursion for the computer
function moveScore(gameBoard, length, maxValue) {
  // Defining user and computer tokens
  let user = 'X';
  let cpu = 'O';

  // Checking to see if someone has won or tied the game
  let score = winCondition(gameBoard, user, cpu);
  if (score == 10) {
    return score;
  } else if (score == -10) {
    return score;
  } else if (openSpaces(gameBoard, user, cpu) == false) {
    return 0;
  }

  // Checking to see if the max value still needs calculating
  if (maxValue == true) {
    // Defining a variable that holds the best possible score
    let best = -1000;

    // Iterating through all possible moves
    for (let rowCounter = 0; rowCounter < 3; rowCounter++) {
      for (let columnCounter = 0; columnCounter < 3; columnCounter++) {
        // Checking to see what spaces are open
        if (gameBoard[rowCounter][columnCounter] != user 
            && gameBoard[rowCounter][columnCounter] != cpu) {
          // Filling the empty spot for now
          let tempValue = gameBoard[rowCounter][columnCounter];
          gameBoard[rowCounter][columnCounter] = cpu;

          // Best possible score for the player
          best = Math.max(best, moveScore(gameBoard, length + 1, !maxValue));

          // Undoing the filled spaces
          gameBoard[rowCounter][columnCounter] = tempValue;
        }
      }
    }
    return best;
  } else {
    // Defining a variable that holds the best possible score
    let best = 1000;

    // Iterating through all possible moves
    for (let rowCounter = 0; rowCounter < 3; rowCounter++) {
      for (let columnCounter = 0; columnCounter < 3; columnCounter++) {
        // Checking to see what spaces are open
        if (gameBoard[rowCounter][columnCounter] != user 
            && gameBoard[rowCounter][columnCounter] != cpu) {
          // Filling the empty spot for now
          let tempValue = gameBoard[rowCounter][columnCounter];
          gameBoard[rowCounter][columnCounter] = user;

          // Best possible score for the player
          best = Math.min(best, moveScore(gameBoard, length + 1, !maxValue));

          // Undoing the filled spaces
          gameBoard[rowCounter][columnCounter] = tempValue;
        }
      }
    }
    return best;
  }
}

// This function controls the computer's moves
function computerMove(moveBoard) {
  // Initializing some base coordinates to be used in determining the move
  let moveRow = -1;
  let moveColumn = -1;

  // Setting up the user and player tokens
  let userSymbol = 'X';
  let cpuSymbol = 'O';

  // Setting up a variable to keep track of the move's score
  let bestScore = -1000;

  // Iterating through the board to find the best move
  for (let bestRow = 0; bestRow < 3; bestRow++) {
    for (let bestColumn = 0; bestColumn < 3; bestColumn++) {
      if (moveBoard[bestRow][bestColumn] != userSymbol 
          && moveBoard[bestRow][bestColumn] != cpuSymbol) {
        // Temporarily filling the empty space
        let placeholdValue = moveBoard[bestRow][bestColumn];
        moveBoard[bestRow][bestColumn] = cpuSymbol;

        // Calculating the score of the computer's move
        let moveTotal = moveScore(moveBoard, 0, false);

        // Removing the placeholder
        moveBoard[bestRow][bestColumn] = placeholdValue;

        // Finding if the current or previously tested score is higher
        if (moveTotal > bestScore) {
          moveRow = bestRow;
          moveColumn = bestColumn;
          bestScore = moveTotal;
        }
      }
    }
  }

  // Finding the optimal move based on the score and returning it
  if (moveRow == 0 && moveColumn == 0) {
    return 1;
  } else if (moveRow == 0 && moveColumn == 1) {
    return 2;
  } else if (moveRow == 0 && moveColumn == 2) {
    return 3;
  } else if (moveRow == 1 && moveColumn == 0) {
    return 4;
  } else if (moveRow == 1 && moveColumn == 1) {
    return 5;
  } else if (moveRow == 1 && moveColumn == 2) {
    return 6;
  } else if (moveRow == 2 && moveColumn == 0) {
    return 7;
  } else if (moveRow == 2 && moveColumn == 1) {
    return 8;
  } else if (moveRow == 2 && moveColumn == 2) {
    return 9;
  } else {
    throw "ERROR: Problem with determining computer move";
  }
}

// Creating an array and adding information about the board to it
let userList = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];

// Creating an array to hold used spots
let usedSpots = [9];

// Printing the current iteration of the board
console.log("Welcome to Tic Tac Toe!");
printBoard(userList);

// Stating the tokens for each player
console.log("");
console.log("Your token is X, the computer is O");

try {
  // Setting up the game counter
  let gameCounter = 0;

  // Looping through the game
  while (gameCounter < 9) {
    // Getting input for the user's move
    console.log("");
    let userInput = prompt("Enter a move you would like to make (1 to 9): ");
    let userNumber = parseInt(userInput, 10);
      
    // Ensuring the user played a number that has not been used
    for (let usedCounter = 0; usedCounter < usedSpots.length - 1;
         usedCounter++) {
      if (userNumber > 9 || userNumber < 1) {
        throw "ERROR: Invalid Input";
      } else if (usedSpots[usedCounter] == userNumber) {
        throw "ERROR: Invalid Input";
      } else {
        continue;
      }
    }

    // Marking the user's move as filling a spot
    usedSpots[gameCounter] = userNumber;

    // This switch statement determines which spot the player put an X
    switch (userNumber) {
      // Changing first spot to X
      case 1:
        userList[0][0] = 'X';
        break;

      // Changing second spot to X
      case 2:
        userList[0][1] = 'X';
        break;

      // Changing third spot to X
      case 3:
        userList[0][2] = 'X';
        break;

      // Changing fourth spot to X
      case 4:
        userList[1][0] = 'X';
        break;

      // Changing fifth spot to X
      case 5:
        userList[1][1] = 'X';
        break;

      // Changing sixth spot to X
      case 6:
        userList[1][2] = 'X';
        break;

      // Changing seventh spot to X
      case 7:
        userList[2][0] = 'X';
        break;

      // Changing eigth spot to X
      case 8:
        userList[2][1] = 'X';
        break;

      // Changing ninth spot to X
      case 9:
        userList[2][2] = 'X';
        break;

      // If the switch case reaches default it throws an error
      default:
        throw null;
    }

    // Printing the board now that the user has gone
    console.log("");
    printBoard(userList);

    // Checking to see if a win occured
    if (winCondition(userList, 'X', 'O') == -10) {
      console.log("");
      console.log("You Win!");
      break;
    } else if (winCondition(userList, 'X', 'O') == 10) {
      console.log("");
      console.log("The Computer Wins!");
      break;
    }

    // Increasing game counter and checking to see if the board is full
    gameCounter += 1;
    if (gameCounter == 9) {
      console.log("");
      console.log("Tied Game");
      break;
    }

    // Determining where the computer will put its token
    console.log("");
    let computerChoice = computerMove(userList);
    console.log("Computer's Move: " + parseInt(computerChoice, 10));
    usedSpots[gameCounter] = computerChoice;

    // This switch statement determines which spot the player put an X
    switch (computerChoice) {
      // Changing first spot to O
      case 1:
        userList[0][0] = 'O';
        break;

      // Changing second spot to O
      case 2:
        userList[0][1] = 'O';
        break;

      // Changing third spot to O
      case 3:
        userList[0][2] = 'O';
        break;

      // Changing fourth spot to O
      case 4:
        userList[1][0] = 'O';
        break;

      // Changing fifth spot to O
      case 5:
        userList[1][1] = 'O';
        break;

      // Changing sixth spot to O
      case 6:
        userList[1][2] = 'O';
        break;

      // Changing seventh spot to O
      case 7:
        userList[2][0] = 'O';
        break;

      // Changing eigth spot to O
      case 8:
        userList[2][1] = 'O';
        break;

      // Changing ninth spot to O
      case 9:
        userList[2][2] = 'O';
        break;

      // If the switch case reaches default it throws an error
      default:
        throw "ERROR: Invalid Input";
    }

    // Printing the board
    printBoard(userList);

    // Increasing the game counter
    gameCounter += 1;

    // Checking to see if a win occured
    if (winCondition(userList, 'X', 'O') == -10) {
      console.log("");
      console.log("You Win!");
      break;
    } else if (winCondition(userList, 'X', 'O') == 10) {
      console.log("");
      console.log("The Computer Wins!");
      break;
    }
  }

// Catches and tells the user what error occured
} catch (err) {
  console.log("");
  console.log("ERROR: Invalid Input");
}

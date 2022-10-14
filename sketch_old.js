'use strict';

const ROWS = 10;
const COLS = 10;
const CELL_SIZE = 40;

let grid;

class Cell {
    constructor(x, y, size, state) {
    	this.x = x;
    	this.y = y;
    	this.size = size;
        this.state = state;

        this.color = (this.state == 0) ? color(0) : color(255);

        this.neighborCount = undefined;
    }

    render() {
        stroke(0);
        fill(this.color);
        rect(this.x, this.y, this.size - 1, this.size - 1);          
    }
}

class Grid {
    constructor(cols, rows, size) {
        this.rows = rows;
        this.cols = cols;
        this.size = size;
        this.cells = create2DArray(this.cols, this.rows);

        this.currentStates = create2DArray(this.cols, this.rows);
        this.newStates = this.currentStates;
    }

    // create() {
    //     for (let i = 0; i < this.cols; i++) {
    //         this.cells[i] = new Array(this.rows);
    //     }
    // }

    intitalize() {
        for (let i = 0; i < this.cols; i++) {
            for (let j = 0; j < this.rows; j++) {
            	this.currentStates[i][j] = floor(random(2));

            	let cellX = i * CELL_SIZE;
            	let cellY = j * CELL_SIZE;
                let cellState = this.currentStates[i][j]

                this.cells[i][j] = new Cell(cellX, cellY, CELL_SIZE, cellState);

            }
        }
    }

    render() {
        for (let i = 0; i < this.cols; i++) {
            for (let j = 0; j < this.rows; j++) {
                this.cells[i][j].render();
            }
        }
    }

    // countNeighbors() {

    // }

    nextGeneration() {
    	//this.nextCells = create2DArray(this.cols, this.rows);

    	for (let i = 0; i < this.cols; i++) {
    		for (let j = 0; j < this.rows; j++) {

    			let currentCell = this.cells[i][j];
    			//let futureCell  = this.nextCells[i][j];

    			let liveNeighbors = 0;
    			for (let m = -1; m <= 1; m++) {
    				for (let n = -1; n <= 1; n++) {
    					let col = (currentCell.x + m + this.cols) % this.cols;
    					let row = (currentCell.y + m + this.rows) % this.rows;
    					let neighborCell = this.cells[col][row];
    					liveNeighbors += neighborCell.state;
    				}
    			}

    			liveNeighbors -= currentCell.state;

    			// if (currentCell.state == 1) {
    			// 	if (liveNeighbors < 2 || liveNeighbors > 3) {
    			// 		//futureCell = new Cell(currentCell.x, currentCell.y, currentCell.size, 1);
    			// 		this.newStates[i][j] = 0;
    			// 	}
    			// } else if (currentCell.state == 0) {
    			// 	if (liveNeighbors == 3) {
    			// 		//futureCell = new Cell(currentCell.x, currentCell.y, currentCell.size, 1);
    			// 		this.newStates[i][j] = 1;
    			// 	}
    			// } else {
    			// 	//futureCell = new Cell(currentCell.x, currentCell.y, currentCell.size, currentCell.state);
    			// 	this.newStates[i][j] = this.currentStates[i][j];
    			// }
    			
    			let state = this.currentStates[i][j];

    			if (state == 1 && (liveNeighbors == 2) || (liveNeighbors == 3)) {
    				this.newStates[i][j] == 1;
    			} else if (state == 0 && liveNeighbors == 3) {
    				this.newStates[i][j] == 1;
    			} else {
    				this.newStates[i][j] == 0;
    			}

    			//this.nextCells.push(futureCell);

    		}
    	}

    	//this.cells = this.nextCells;
    }
}

function create2DArray(rows, cols) {
	let arr = new Array(cols);

	for (let i = 0; i < cols; i++) {
		arr[i] = new Array(rows);
	}
	return arr;
}

function setup() {
    createCanvas(COLS * CELL_SIZE, ROWS * CELL_SIZE);

    grid = new Grid(COLS, ROWS, CELL_SIZE);
    //grid.create();
    grid.intitalize();
}

function draw() {
    background(251);

    grid.nextGeneration();

    grid.render();
}
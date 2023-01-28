"use strict";

/** @class Cell class representing a cell */
class Cell {
	/**
	 * Creates an instance of Cell
	 * @constructor
	 * @param  {int} x      pixel graphics x-coordinate of the cell
	 * @param  {int} y      pixel graphics y-coordinate of the cell
	 * @param  {int} size   side length of cell
	 * @param  {int} state  state of cell; 0 means dead,  1 means alive; no other values
	 */
	constructor(x, y, size, state) {
		/** @private */ this.x     = x;
		/** @private */ this.y     = y;
		/** @private */ this.size  = size;
		/** @private */ this.state = state;
	}

	/** Display the cell as a rectangle */
	display() {
		stroke(200);

		/* Note to self: never fill unused blocks
		   causes a drastic performance decrease */
		if (this.state == 1) {
			fill(color(0, 200, 0));
			rect(this.x, this.y, this.size, this.size);
		}
	}
}

/** @class Grid class representing the grid which contains all the cells + other useful stuff */
class Grid {
	/**
	 * Creates an instance of Grid
	 * @param  {int} rows  Number of rows in the grid
	 * @param  {int} cols  Number of coluumns in the grid
	 */
	constructor(rows, cols) {
		/** @private */ this.rows = rows;
		/** @private */ this.cols = cols;

		/** @private */ this.futureCellStates;

		/** @private */ this.currentCellStates = new Array(this.rows);
		for (let i = 0; i < this.rows; i++) {
			this.currentCellStates[i] = new Array(this.cols);
			for (let j = 0; j < this.cols; j++) {
				this.currentCellStates[i][j] = floor(random(2));
			}
		}

		/** @private */ this.cells = new Array(this.rows);
		for (let i = 0; i < this.rows; i++) {
			this.cells[i] = new Array(this.cols);
			for (let j = 0; j < this.cols; j++) {
				this.cells[i][j] = new Cell(j * cell_size, i * cell_size, cell_size, this.currentCellStates[i][j]);
			}
		}

	}

	/** Displays the entire grid, and also re-initiallizes each cell in Grid.cells for iterative 
	    rendering */
	display() {
		for (let i = 0; i < this.rows; i++) {
			for (let j = 0; j < this.cols; j++) {
				this.cells[i][j].display();
			}
		}

		/* Renewing the this.cells array in every frame of animation with new Cell objects
		   containing updated states */
		this.cells = new Array(this.rows);
		for (let i = 0; i < this.rows; i++) {
			this.cells[i] = new Array(this.cols);
			for (let j = 0; j < this.cols; j++) {
				this.cells[i][j] = new Cell(j * cell_size, i * cell_size, cell_size, this.currentCellStates[i][j]);
			}
		}
	}

	/**
	 * Gives us the number of living neighbors surrounding a given cell
	 * @param  {int} i  Row number (i-index) of the given cell
	 * @param  {int} j  Column number (j-index) of the given cell
	 * @return {int} The number of living neighbors surrounding the cell
	 */
	calculateLiveNeighbors(i, j) {
		let liveNeighbors = 0;

		/* All edge cases */
    	if (i < this.rows - 1) 
    		liveNeighbors += this.cells[i + 1][j].state;  // lower cell
    	if (i > 0)             
    		liveNeighbors += this.cells[i - 1][j].state;  // upper cell
    	if (j < this.cols - 1) 
    		liveNeighbors += this.cells[i][j + 1].state;  // right cell
    	if (j > 0)             
    		liveNeighbors += this.cells[i][j - 1].state;  // left cell

    	/* All corner case */
      	if (i > 0 && j > 0)
      		liveNeighbors += this.cells[i - 1][j - 1].state;  // upper-left cell
      	if (i < this.rows - 1 && j > 0)             
      		liveNeighbors += this.cells[i + 1][j - 1].state;  // lower-left cell
      	if (i > 0 && j < this.cols - 1)             
      		liveNeighbors += this.cells[i - 1][j + 1].state;  // upper-right cell
      	if (i < this.rows - 1 && j < this.cols - 1) 
      		liveNeighbors += this.cells[i + 1][j + 1].state;  // lower-right cell

		return liveNeighbors;
	}

	/**
	 * Moves the grid onto the next generation; to be called per frame of animation
	 */
	nextGeneration() {

		/* Initializing this.futureCellStates to an empty 2-D Array */
		this.futureCellStates = new Array(this.rows);
		for (let i = 0; i < this.rows; i++) {  // Done in a separate loop to improve readability
			this.futureCellStates[i] = new Array(this.cols);  // and to avoid ambiguity
		}                              

		for (let i = 0; i < this.rows; i++) {  
			for (let j = 0; j < this.cols; j++) {
				/* Looping through this.cells to get the number of live neighbors for the cell */
				let liveNeighbors = this.calculateLiveNeighbors(i, j);

				/* Implement the rules of Conway's Game of Life */
				let state = this.cells[i][j].state;  // assign variable state as the current cell state for convenience

				if (state == 0 && liveNeighbors == 3)  // Alive and good neighborhood
					this.futureCellStates[i][j] = 1;   // The cell lives
				else if (state == 1 && (liveNeighbors < 2 || liveNeighbors > 3))  // Alive but in (over/under)populated neighborhood
					this.futureCellStates[i][j] = 0;                              // The cell dies
				else                                                       // Otherwise all cells remain the same
					this.futureCellStates[i][j] = this.cells[i][j].state;  // Dead remains dead and alive stays alive
			}
		}
		
		this.currentCellStates = this.futureCellStates;
	}

}

/*********************************************************************************************************************/

/* Constant values */
const canvas_width  = 600;
const canvas_height = 400;
const cell_size     = 10;

/* Variable(s) */
let grid;
let rows, cols;

/**
 * p5.js setup function
 */
function setup() {
	createCanvas(windowWidth, windowHeight);

	rows = Math.floor(windowHeight / cell_size);
	cols = Math.floor(windowWidth  / cell_size);

	grid = new Grid(rows, cols);
}

/**
 * p5.js draw function
 */
function draw() {
	background(200);

	grid.nextGeneration();
	grid.display();
}

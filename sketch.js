let scl = 40;
let gridwidth = 800, gridheight = 800;

let numberCols, numberRows;
let gridCoordinates = [], germList = [];
let neighbourCoordinates = [];


function setup() {
	createCanvas(1920, 955);

	numberCols = floor(gridwidth/scl);
	numberRows = floor(gridheight/scl);

	// creating a position matrix.
	// with grid location offset to centres the centre of a cell.
	for (let i = 0; i < numberRows; i++ ){
		let rowCoordinates = [];
		for (let j = 0; j < numberCols; j++ ){
			rowCoordinates.push(createVector(i+0.5, j+0.5).mult(scl));
		}
		gridCoordinates.push(rowCoordinates);
	}


	// creating neighbour positions list for each entry
	// of the position matrix
	for (let i = 0 ; i < numberRows; i++){
		let rowneighbourCoordinates = [];
		for (let j = 0 ; j < numberCols; j++){
			rowneighbourCoordinates.push(neighbours(gridCoordinates[i][j]));
		}
		neighbourCoordinates.push(rowneighbourCoordinates);
	}

	// creating first generation of germs (randomized attributes).
	for (let i = 0; i < numberRows; i++){
		let temp = [];
		for (let j = 0; j < numberCols; j++){

			temp.push( new Germ(gridCoordinates[i][j].x, 
				gridCoordinates[i][j].y));
		}
		germList.push(temp);
	}

	// using rectangle centre as coordinate description.
	rectMode(CENTER);
	//frameRate(10);

}

function draw() {
	background(0);
  
  	drawGrid();

	// display germ cells
	for (let i = 0; i < numberRows; i++){
		for (let j = 0; j < numberCols; j++){
			germList[i][j].show();
		}
	}

	vampirism();


	// update hp

	for (let i = 0; i < numberRows; i++){
		for (let j = 0; j < numberCols; j++){
			germList[i][j].updateGerm();
		}
	}

	// reproduce
	for (let number = 0; number < (numberRows**2); number++){

		let rowIndexsel = Math.floor(Math.random()*numberRows);
		let colIndexsel = Math.floor(Math.random()*numberCols);

		germList[rowIndexsel][colIndexsel].reproduce();
	}


	graph();


}

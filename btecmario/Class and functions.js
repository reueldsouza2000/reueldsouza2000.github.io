let mutationRate = 0.25;
let parasiticthreshold =  0.8*scl;
let rprthreshold = 0.05*scl;
let minhpthreshold = 0.1;

class Germ {

	constructor(xp, yp){
		// grid location
		this.x = xp;
		this.y = yp;

		// traits - hit points, reproduction rate, vampirism

		//RANDOM POPULATION
		this.originalhp = Math.ceil(Math.random()*scl); //integer from 1 to scl
														//use for reproduction.
		this.hp =  this.originalhp;
		this.rpr = Math.ceil(Math.random()*(scl - this.hp)); 

		
		this.vp =  scl - this.hp - this.rpr;

		// // *almost* HOMOGENOUS POPULATION

		// let almost = (-1)**Math.floor(2*Math.random()); 

		// this.originalhp = 3*scl/4 + almost; //integer from 1 to scl
		// //use for reproduction.
		// this.hp = this.originalhp;
		// this.rpr = scl/4 - almost;


		// this.vp =  scl - this.hp - this.rpr;
	}

	show (){
		if (this.hp != 0){
			fill(55*((this.vp/scl)) + 200, 255*(1 - (this.vp/scl)) , 0);
			strokeWeight(0);

			rect(this.x, this.y, 0.8*this.hp, 0.8*this.hp);
		}
	}

	updateGerm (){
		if (this.hp > 0 && this.hp <= scl){
			this.hp = this.hp - 1;
		}

		if (this.hp > scl){
			this.hp = scl;
		}

		if (this.hp < 0){
			this.hp = 0;
		}


	}


	reproduce (){
		// to remove directional bias. We first choose 'N' random
		// germ cells.
		// controlled out of the function.

		// then check if any neighbour cells are unpopulated. 

		if (this.hp > 0 && this.originalhp>0){ // only reproduce if current cell is alive

			let rowIndex = int((this.x/scl) - 0.5);
			let colIndex = int((this.y/scl) - 0.5);

			let nbrs = neighbourCoordinates[rowIndex][colIndex]; // 8 vectors

			let countdeadnbrs = 0;
			for (let i = 0; i < 8; i++ ){

				let nbrrowIndex = int(nbrs[i].x/scl - 0.5);
				let nbrcolIndex = int(nbrs[i].y/scl - 0.5);

				if (germList[nbrrowIndex][nbrcolIndex].hp <= 0){ // dead neighbour
				countdeadnbrs += 1;
				}
			}


			if (countdeadnbrs != 0){
				for (let i = 0; i < 8; i++){
					let nbrrowIndex = int(nbrs[i].x/scl - 0.5);
					let nbrcolIndex = int(nbrs[i].y/scl - 0.5);

					if (germList[nbrrowIndex][nbrcolIndex].hp <= 0){ // dead neighbour

						if ( Math.random() < this.rpr/(scl*countdeadnbrs)){ // reproduction rate

						
							if (Math.random() < mutationRate){
								germList[nbrrowIndex][nbrcolIndex].hp = germList[rowIndex][colIndex].originalhp
																		+ (-1)**Math.floor(2*Math.random());

								if (germList[nbrrowIndex][nbrcolIndex].hp > scl){
									germList[nbrrowIndex][nbrcolIndex].hp = scl;
								} else if (germList[nbrrowIndex][nbrcolIndex].hp < 0){
									germList[nbrrowIndex][nbrcolIndex].hp = 0;
								}


								germList[nbrrowIndex][nbrcolIndex].rpr = germList[rowIndex][colIndex].rpr
																		+ (-1)**Math.floor(2*Math.random());
								
								if ( germList[nbrrowIndex][nbrcolIndex].rpr > (scl - germList[nbrrowIndex][nbrcolIndex].hp)){
									germList[nbrrowIndex][nbrcolIndex].rpr = scl - germList[nbrrowIndex][nbrcolIndex].hp;
								} else if (germList[nbrrowIndex][nbrcolIndex].rpr < 0){
									germList[nbrrowIndex][nbrcolIndex].hp = 0;
								}

								germList[nbrrowIndex][nbrcolIndex].vp =  scl - 
																		germList[nbrrowIndex][nbrcolIndex].rpr -
																		germList[nbrrowIndex][nbrcolIndex].hp;
							} else {

								germList[nbrrowIndex][nbrcolIndex].hp = germList[rowIndex][colIndex].originalhp;
								germList[nbrrowIndex][nbrcolIndex].rpr = germList[rowIndex][colIndex].rpr;

								if ( germList[nbrrowIndex][nbrcolIndex].rpr > (scl - germList[nbrrowIndex][nbrcolIndex].hp)){
									germList[nbrrowIndex][nbrcolIndex].rpr = scl - germList[nbrrowIndex][nbrcolIndex].hp;
								} else if (germList[nbrrowIndex][nbrcolIndex].rpr < 0){
									germList[nbrrowIndex][nbrcolIndex].hp = 0;
								}
								germList[nbrrowIndex][nbrcolIndex].vp =  scl - 
																		germList[nbrrowIndex][nbrcolIndex].rpr -
																		germList[nbrrowIndex][nbrcolIndex].hp;

							}

						}


					}

				}

			}

		}
	
	}



}

function drawGrid(){

	// lines
	for(let i = 0; i < numberRows; i++ ){
		stroke(255);
		strokeWeight(1);
		line(i*scl, 0, i*scl, gridheight);
	}

	for(let i = 0; i < numberCols; i++ ){
		stroke(255);
		strokeWeight(1);
		line(0, i*scl, gridwidth, i*scl);
	}


}

function neighbours (vec){
	// return toroidal neighbours of grid location.

	let xp = vec.x, yp = vec.y; 

	var xf = xp + scl , 
		xb = xp - scl, 
		yf = yp + scl, 
		yb = yp - scl;

	if (xf > gridwidth){
		xf = scl;
	} if (xb < 0){
		xb = gridwidth - scl;
	} if (yf > gridheight){
		yf = scl;
	} if (yb < 0){
		yb = gridheight - scl;
	}

	return [createVector(xf, yp),
			createVector(xb, yp),
			createVector(xp, yf),
			createVector(xp, yb),
		
			createVector(xf, yf),
			createVector(xf, yb),
			createVector(xb, yf),
			createVector(xb, yb)];

}

function vampirism(){
	// vampirism activates only if vp > threshold % scl.
	// vampires can only take hp from germs with a rpr greater than 
	// some threshhold value.
	// vampires can only eat germs with hp > threshold % scl
	// vampires can canabalize




	for (let i = 0; i < numberRows; i++){
		for (let j = 0 ; j < numberCols; j++){

			let nbrs = neighbourCoordinates[i][j]; // 8 vectors

			for (let k = 0; k < 8; k++ ){
				nbrrowIndex = int(nbrs[k].x/scl - 0.5);
				nbrcolIndex = int(nbrs[k].y/scl - 0.5);


				if (germList[nbrrowIndex][nbrcolIndex].rpr >= rprthreshold 
					&& germList[nbrrowIndex][nbrcolIndex].hp >= minhpthreshold*germList[nbrrowIndex][nbrcolIndex].hp
					&& germList[i][j].vp > parasiticthreshold
					){

						if (germList[i][j].hp < scl){
						germList[i][j].hp += 1;//.5; // 50% energy lost
						}
						germList[nbrrowIndex][nbrcolIndex].hp -= 1;

				}

			}

		}

	}

}


function graph (){

	// graphing reproduction rate vs parasitic.

	let sidelength = 550;
	let origin = createVector(gridwidth/2 + 600, gridheight/2 + 200);

	let xaxis = createVector(origin.x + sidelength, origin.y);
	let yaxis = createVector(origin.x, origin.y - sidelength);


	let xval, yval;

	for(let i = 0; i < numberRows; i++){
		for(let j = 0; j < numberCols; j++){

			xval =  origin.x + (germList[i][j].vp/scl)*sidelength ;
			yval =  origin.y -(germList[i][j].rpr/scl)*sidelength ;

			fill(180, 180, 180, 200);
			stroke(0);
			strokeWeight(1);
			circle(xval, yval, germList[i][j].hp);

		}
	}

	stroke(255);
	strokeWeight(1);
	line(origin.x, origin.y, xaxis.x, xaxis.y);
	line(origin.x, origin.y, yaxis.x, yaxis.y);

	fill(255);
	textSize(30);
	strokeWeight(0);
	text('0', origin.x-20, origin.y+30);
	text('1', xaxis.x-20, xaxis.y+30 );
	text('1', yaxis.x-20, yaxis.y+20 );

	textAlign(CENTER);
	text('Parasitic gene', 0.5*(origin.x + xaxis.x), origin.y + 30);

	let str1 = 'Mutation rate = ' + str(mutationRate * 100) + '%';
	let str2 = 'Parasite-gene activation = ' + str(parasiticthreshold/scl) ;
	let str3 = 'Min HP for parasite feeding = ' + str(minhpthreshold*100) + '% original HP';
	let str4 = 'Min reproduction gene for parasite feeding = ' + str(rprthreshold/scl);

	text(str1, 0.5*(origin.x + xaxis.x), origin.y + 100);
	text(str3, 0.5*(origin.x + xaxis.x), origin.y + 140);
	text(str2, 0.5*(origin.x + xaxis.x), origin.y + 180);
	text(str4, 0.5*(origin.x + xaxis.x), origin.y + 220);

	translate( origin.x - 30, 0.5*(origin.y + yaxis.y));
	rotate(-PI/2)
	text('Reproductive gene', 0 ,0);
	textAlign(LEFT);
	translate(0 ,0);

	
}

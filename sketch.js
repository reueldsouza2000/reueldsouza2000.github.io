let population, phenotype;
let populationSize = 1000, geneLength;
let mutationRate = 0.01;

Math.seedrandom('abcde'); // using the library seedrandom.js.

function setup() {
  createCanvas(400, 400);
  phenotype = new Phenotype()
  geneLength = phenotype.coordinates.length;
  population = new Population(populationSize, geneLength);

}

function draw() {
  background(255);

  population.calcFitness();
  population.createMatingPool();
  population.reproduce();
  population.mutation(mutationRate);

  population.displayDetails();
  phenotype.display(population.globalbestgenes, population.generations, 1/population.globalbestfitness);

  // if(population.generations == 3000){
  //   print(" ");
  //   print("3000 generations complete");
  //   noLoop();
  // }
}

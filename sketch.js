let population, phenotype;
let populationSize = 1000, geneLength;
let mutationRate = 0.10;

Math.seedrandom('abcde'); // using the library seedrandom.js.

function setup() {
  createCanvas(800, 800);
  phenotype = new Phenotype()
  geneLength = phenotype.coordinates.length;
  population = new Population(populationSize, geneLength);

}

function draw() {
  background(200);

  population.calcFitness();
  population.createMatingPool();
  population.reproduce();
  population.mutation(mutationRate);

  population.displayDetails();
  phenotype.display(population.globalbestgenes, 
                    population.generations,
                    population.globalbestdistance);

}

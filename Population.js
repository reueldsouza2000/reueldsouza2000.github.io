
class Population{

    constructor(num, DNAlength){

        this.populationList = [];

        for (let i = 0; i < num; i++){
            this.populationList.push(new DNA(DNAlength));
        }

        this.matingPool = [];
        this.generations = 0;

        this.bestobject = new DNA(DNAlength);
        this.globalbestfitness = 0;
        
        this.globalbestgenes = [];
        for (let i = 0; i < this.DNAlength;i++){
            this.globalbestgenes.push(i); // initial
        }
    }

    calcFitness(){

        for(let i = 0; i < this.populationList.length; i++){
            this.populationList[i].calcFitness();
        }

        let maxFitness = 0;

        for(let i = 0; i < this.populationList.length; i++){
            if (this.populationList[i].fitness > maxFitness){
                this.bestobject = this.populationList[i];
            }
        }
    }

    createMatingPool(){
        this.matingPool = []; // reseting mating pool by clearing previous entries.
        // normalize fitness scores and create mating pool.

        let normalizationFactor = 0;
        for(let i = 0; i < this.populationList.length; i++){
            normalizationFactor += this.populationList[i].fitness;
        }

        let normalizedFitnessList = [], multiplier = this.populationList.length * 100; // higher the better (accounts for decimal precision in fitness)

        for(let i = 0; i < this.populationList.length; i++){
            normalizedFitnessList.push( floor( (this.populationList[i].fitness / normalizationFactor) * multiplier ) );
        }

        for (let i = 0; i < this.populationList.length; i++){

            for (let j = 0; j < normalizedFitnessList[i]; j++){
                this.matingPool.push(this.populationList[i]);
            }

        }
    
    }

    reproduce(){
        // create new child population.
        // 2 parents create 2 children so
        // we only pick N/2 pairs.

        let childList = [], index1, index2;
        
        for (let i = 0; i < this.populationList.length/2; i++){

            index1 = Math.floor( Math.random() * this.matingPool.length );
            index2 = Math.floor( Math.random() * this.matingPool.length );

            // child inherits the better of both parents no cross over.

            let p1 = this.matingPool[index1];
            let p2 = this.matingPool[index2];

            childList.push(p1.crossover(p2));
            childList.push(p2.crossover(p1));
        }

        this.populationList = childList;
        this.generations++;
  
    }

    mutation(rate){

        for(let i = 0; i < this.populationList.length; i++){
            this.populationList[i].mutate(rate);
        }
    }

    averageFitness(){
        let avg = 0;
        for(let i=0; i < this.populationList.length; i++){
            avg += this.populationList[i].fitness;
        }

        avg /= this.populationList.length;
        return avg;
    }

    displayDetails(){
        this.calcFitness();
        if (this.globalbestfitness < this.bestobject.fitness){

            this.globalbestfitness = this.bestobject.fitness;
            this.globalbestgenes = this.bestobject.genes;
  
            print(" ");
            print('Generation #',this.generations);
            print('Avg fitness = ',this.averageFitness());
            print('Global best fitness = ',this.bestobject.fitness);
            print('Total distance = ', 1/this.bestobject.fitness);
            print('Global best genes = ',this.bestobject.genes);
            
            
        } 

        
        
        
    }

}
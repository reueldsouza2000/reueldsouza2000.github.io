class DNA{
    constructor(geneLength){ // length of gene array.

        this.fitness = 0;
        this.DNAlength = geneLength;
        this.genes = [];

        let c = [], val;
        for(let i = 0; i < geneLength; i++){
          c.push(i);
        }
        for (let i = 0; i < geneLength; i++){
            val = Math.floor(Math.random() * c.length);
            this.genes.push(c[val]);
            c.splice(val, 1);
        }

    }

    calcFitness() {

      let coords = new Phenotype().coordinates;

      let d = 0;
      for (let i = 0; i < this.genes.length - 1; i++){
        d += coords[this.genes[i]].dist(coords[this.genes[i + 1]]);
      }

      this.fitness = 1/d;
    }  

    // Crossover
    crossover(partner) {
      // A new child

      let childgenes = [] ;


      // arbitrary part from one, rest from the other in order.

        let midpoint = Math.floor(Math.random() * this.genes.length);
        let count = 0;

        for (let i = 0; i < this.genes.length; i++) {

          if ( i < midpoint){
            childgenes[i] = this.genes[i];
          } 
          else{
           
            for( let j = 0; j < partner.genes.length; j++){

              let flag = 0;
              for (let k = 0; k < childgenes.length; k++){
                if (partner.genes[j] == childgenes[k]){
                  flag = 1;
                }
              }

              if (flag == 0){
                childgenes.push(partner.genes[j]);
              }

            }

          }
        
        }      


	    let child = new DNA(this.genes.length);
  	  child.genes = childgenes;
      return child;
    }

    // Based on a mutation probability, picks a new random character
    mutate(mutationRate) {

      for( let i = 0; i < this.genes.length; i++){
        if (Math.random() < mutationRate) {

            let index1 = i ;
            let index2 = Math.floor(Math.random() *  this.genes.length );

            let temp = this.genes[index1];
            this.genes[index1] = this.genes[index2];
            this.genes[index2] = temp;
        }
         
      }
      this.calcFitness();
  }

}
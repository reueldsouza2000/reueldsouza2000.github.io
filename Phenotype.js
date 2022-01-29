class Phenotype{

    constructor(){
        this.coordinates = [ ];
        let cities = 10; 
        for (let i = 0 ; i < cities; i++){
            this.coordinates.push(createVector(Math.random(), Math.random()).mult(width));
        }
    }

    display(cityOrderlist, generation, bestdistance){

        for (let i = 0; i < this.coordinates.length - 1; i++){

            strokeWeight(1);
            line(this.coordinates[cityOrderlist[i]].x, this.coordinates[cityOrderlist[i]].y,
            this.coordinates[cityOrderlist[i+1]].x, this.coordinates[cityOrderlist[i+1]].y );

            fill(0, 255 ,255);
            strokeWeight(0);
            circle(this.coordinates[cityOrderlist[i]].x, this.coordinates[cityOrderlist[i]].y, 10);
            fill(0);
            strokeWeight(1);
            text(cityOrderlist[i], this.coordinates[cityOrderlist[i]].x, this.coordinates[cityOrderlist[i]].y);
        }

        fill(0, 255 ,255);
        strokeWeight(0);
        circle(this.coordinates[cityOrderlist[this.coordinates.length - 1]].x, this.coordinates[cityOrderlist[this.coordinates.length - 1]].y, 10);
        fill(0);
        strokeWeight(1);
        text(cityOrderlist[this.coordinates.length - 1], this.coordinates[cityOrderlist[this.coordinates.length - 1]].x, this.coordinates[cityOrderlist[this.coordinates.length - 1]].y);
    

        let str1 = 'Current generation #'+str(generation);
        let str2 = 'Record minimum path distance = ' + str(bestdistance);
        text(str1, 50, 50);
        text(str2, 50, 70);
        
    }

}
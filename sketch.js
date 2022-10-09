let screen_width = 800, screen_height = 700;
//let parallax_effect;

let block_list = new Array(), mario, floor, goomba_list = new Array(); // global objects.

function setup() {

    createCanvas(screen_width, screen_height);
    block_list.push(new Block(300, 350 , 250, 50 ));
    block_list.push(new Block(800, 500 , 200, 200 ));
    block_list.push(new Block(450, 570, 50, 50));

    mario = new Mario();
    floor = new Floor();
    goomba_list.push(new Goomba(350, 50, 1));
    goomba_list.push(new Goomba(600,  50 , -1));

    ellipseMode(CENTER);
    rectMode(CENTER);    
}

function draw() {

    background(0, 205, 205);
    translate(transx(), 0); // shifting origin
    
    // check if gravity is on or off depending on sprites ypos
    gravity(mario, block_list); 
    goomba_list.forEach( function(goomba){
    gravity(goomba, block_list);
    })

    // check if sprite is below the floor ('above' refers to the convention of y-axis increasing down).
    checkabovefloor(mario); 
    goomba_list.forEach( function(goomba){
    checkabovefloor(goomba);
    })

    // L-R motion
    UserInput(); 

    // displaying all the sprites and blocks
    mario.show();
    goomba_list.forEach( function(goomba){
    goomba.show();
    })
    block_list.forEach( function(itr_block) {
        itr_block.show();
    })
    floor.show();


    // checking for overlap between sprites and blocks
    checkOverlap(mario, block_list);
    goomba_list.forEach( function(goomba){
    checkOverlap(goomba, block_list);
    })

    // updating the positions of all sprites
    updatepos(mario);
    goomba_list.forEach( function(goomba){
    updatepos(goomba);
    })

    mobInteractions (mario, goomba_list);

    // display current coords and hitbox frames.
    //debugtools();
}


/////////////////////////////////////////////////////////

// Additional Functions

function transx() {
    return -0.7*mario.x + 50 ;
}

function debugtools(){

    mario.hitbox();
    mario.currentcoord(-(transx()), 50);

    goomba_list.forEach( function(goomba){
    goomba.hitbox();
    })

}

function UserInput(){ // Left and Right motion

    friction_const = 0.04

    if (keyIsDown(LEFT_ARROW) && mario.x > floor.hboxl()) {
      mario.xvel += -0.3 - friction_const*mario.xvel;
    }
    else if (keyIsDown(RIGHT_ARROW) && mario.x < floor.hboxr()) {
      mario.xvel += 0.3 - friction_const*mario.xvel; 
    }

    else{ // friction
     mario.xvel += -friction_const*mario.xvel;
    }
}

function keyPressed(){ // Jump logic
if(mario.yvel == 0 && keyCode == UP_ARROW ) 
    mario.yvel = -25;
}

function gravity(sprite,  obj_list) { // can apply to hostile NPCs also.
    // optimization: check if he's on top of any object. 
    // if he is, immediately break the loop and do nothing
    // if not, add in gravity
    var isOnTopOfObject = false

    for (obj of obj_list) {
        if (sprite.y == floor.hboxu()-sprite.ydownshift() || (sprite.y == obj.hboxu()-sprite.ydownshift()  && 
            sprite.x <= obj.hboxr() + sprite.width*0.5 && 
            obj.hboxl()-sprite.width*0.5 <=sprite.x          )) {
                isOnTopOfObject = true
                break;
        }

    }

    // dont change these values! tested.
    let air_drag = 0.005;
    if (!(isOnTopOfObject)) {
        sprite.yvel += 1.1 - air_drag*sprite.yvel;
        print('gravity');
    }


}

// REDUNDANT ,- check if
function checkabovefloor(sprite){ // can apply to NPCs also.
    if (sprite.hboxd() > floor.hboxu()){

        sprite.y = floor.hboxu() - sprite.ydownshift();
        sprite.yvel = 0;
      }
}

function updatepos(sprite){

    sprite.y += sprite.yvel;
    sprite.x += sprite.xvel;

    if (sprite.hboxl() < -sprite.width){
        sprite.x = -sprite.width + sprite.width * 0.5;
        sprite.xvel *= -1;
    }
}

function checkOverlap(sprite, obj_list) { // pass sprite hitbox and obj
    obj_list.forEach( function(obj) { 
    // overlap b/w sprite and obj
        if( 
            sprite.hboxl() < obj.hboxr() &&
            sprite.hboxr() > obj.hboxl() &&
            sprite.hboxu() < obj.hboxd() &&
            sprite.hboxd() > obj.hboxu()) {


            if (  sprite.hboxu() < obj.hboxd() - 25 &&
                  sprite.hboxd() > obj.hboxu() + 25){
                if (sprite.x <= obj.x ){
                    sprite.x = obj.hboxl() - sprite.width*0.5;
                    sprite.xvel *= -1;
                }
                else{
                    sprite.x = obj.hboxr() + sprite.width*0.5 ;
                    sprite.xvel*= -1;
                }
            }

            if ( sprite.hboxd() <= obj.y ){
                sprite.yvel = 0;
                sprite.y = obj.hboxu() - sprite.ydownshift();
            } 
            else {
                sprite.yvel = 0;
                sprite.y = obj.hboxd() - sprite.yupshift(); 
            }
        
        }
    })

}

function mobInteractions (sprite, mob_list){ 

// if character death condition is satisfied resets position.

    for (let i = 0; i < mob_list.length; i++){
        if (
            (sprite.hboxr() > mob_list[i].hboxl() &&
            sprite.hboxl() < mob_list[i].hboxr()) 

            && 
        
            sprite.hboxd()  >
            (mob_list[i].hboxu() + 0.4*mob_list[i].height) 
            
            
            && sprite.hboxu() < mob_list[i].hboxd()
           ){

            sprite.x = 0;
            sprite.y = 200;
        }
        
    }


// if mob death condition is satisfied
// deletes mob that meets death condition from the object list.

    for (let i = 0 ; i < mob_list.length; i++ ){
        if (   sprite.hboxd()  > mob_list[i].hboxu() &&

               sprite.hboxd()  < 
               (mob_list[i].hboxu() + 0.4*mob_list[i].height) &&

               (sprite.hboxr() > mob_list[i].hboxl() &&
                sprite.hboxl() < mob_list[i].hboxr())  )  
        {   
            sprite.yvel = -15.;
            mob_list.splice(i, 1);


        }
    }




}

/////////////////////////////////////////////////////////

// Classes


// No inheritance structures used *for now*.
// future possible use for the "show()" functions



class Mario{
    constructor(xp = 0, yp = 0.85*screen_height - 75){ // initial vals
        this.x = xp;
        this.y = yp;

        this.yvel = 0;
        this.xvel = 0;

        this.width = 60;
        this.height = 110;
    }


    hboxr(){return this.x + 30;}
    hboxl(){return this.x - 30;}
    hboxu(){return this.y - 35;}
    hboxd(){return this.y + 75;}
    
    yupshift(){return -35;}
    ydownshift(){return 75;}


    show() {
        ///////////////////////////////////////////////////

            // Mario

            // arms

            fill(255, 0 ,0);
            rect(this.x, this.y+29, 55, 20);


            // red shirt
            fill(225, 0, 0); 
            rect(this.x, this.y+25, 40, 90);

            // blue overall
            fill(0, 0, 255);
            rect(this.x-10, this.y+40, 8, 30);
            rect(this.x+10, this.y+40, 8, 30);
            rect(this.x, this.y+60, 40, 30);



            // yellow button on overall
            fill(255, 255, 0);
            ellipse(this.x-10, this.y+40, 8, 8);
            ellipse(this.x+10, this.y+40, 8, 8);

            // face
            fill(255, 203, 164);
            ellipse(this.x, this.y, 57, 60);

            // moustache
            fill(0, 0, 0);
            rect(this.x, this.y+18, 18, 4);
            

            // eyes
            fill(225, 255, 255);
            ellipse(this.x-10, this.y, 16, 32);
            ellipse(this.x+10, this.y, 16, 32);

            // nose

            fill(255, 203, 164);
            ellipse(this.x, this.y+12, 12, 12)
            
            // iris
            fill(0, 0, 255);
            ellipse(this.x-10, this.y, 8, 16);
            ellipse(this.x+10, this.y, 8, 16);
            
            // pupil
            fill(0, 0, 0);
            ellipse(this.x-10, this.y, 4, 8);
            ellipse(this.x+10, this.y, 4, 8);

            fill(255, 255, 255);
            ellipse(this.x-10, this.y+1, 2, 4);
            ellipse(this.x+10, this.y+1, 2, 4);

            // shoes
            fill(130, 67, 33);
            ellipse(this.x + 15, this.y+70, 24, 15);
            ellipse(this.x - 15, this.y+70, 24, 15);


            // hat
            fill(255, 0, 0);
            arc(this.x, this.y-16, 50, 40, PI, 2*PI, CHORD);
            rect(this.x, this.y-16, 55, 6);

            fill(255, 255, 255);
            ellipse(this.x, this.y-25, 12, 12);

            fill(255, 0 ,0);
            textSize(10);
            text('M', this.x-4, this.y-22)


            // hands
            fill(255, 255, 255);
            ellipse(this.x-24, this.y+40, 10, 10);
            ellipse(this.x+24, this.y+40, 10, 10);

    }

    hitbox(){

          fill(0, 0, 0, 0);
          stroke(0, 0, 0);
          rect(this.x, this.y+20, this.width, this.height);

          fill(0);

          ellipse(this.x, this.hboxd(), 7, 7 );
          ellipse(this.x, this.hboxu(), 7, 7 );
          ellipse(this.hboxl(), this.y, 7, 7 );
          ellipse(this.hboxr(), this.y, 7, 7 );
    }

    currentcoord(xp = 50, yp = 50){ // default printing pos
        fill(255, 0 ,0);
        textSize(20);
        text( this.x,  xp , yp);
        text( this.y ,  xp , yp+30);
        text(this.xvel, xp, yp + 60)
        text(this.yvel, xp, yp+90);
    }

}

class Block{
    constructor(xv=400, yv=250, wv=50,hv=50){ // default values

        this.x = xv;
        this.y = yv;
        this.width = wv;
        this.height = hv;

    }

    hboxr(){return this.x + this.width*0.5;}
    hboxl(){return this.x - this.width*0.5;}
    hboxu(){return this.y - this.height*0.5;}
    hboxd(){return this.y + this.height*0.5;}

    show() {
        fill(200, 130, 43);
        rect(this.x, this.y, this.width, this.height); 
    }

}

class Floor{
    constructor(xv = 0.5*screen_width, yv = screen_height){
        this.x = xv;
        this.y = yv;

        this.width = 5*screen_width;
        this.height = 0.3*screen_height;
    }

    hboxr(){return this.x + this.width*0.5;}
    hboxl(){return this.x - this.width*0.5;}
    hboxu(){return this.y - this.height*0.5;}
    hboxd(){return this.y + this.height*0.5;}


    show(){
        fill(0,200, 0);
        rect(this.x, this.y, this.width, this.height);
    }

}

class Goomba{
    constructor (xp, yp = floor.hboxu() - 30, xv = 1. ){
        this.x  = xp;
        this.y = yp;

        this.yvel = 0;
        this.xvel = xv;

        this.width = 60;
        this.height = 40;
    }

    hboxr(){return this.x + this.width*0.5;}
    hboxl(){return this.x - this.width*0.5;}
    hboxu(){return this.y - this.height*0.5 - 2;}
    hboxd(){return this.y + this.height*0.5 + 11.5;}
    
    yupshift(){return -this.height*0.5 - 2.;}
    ydownshift(){return this.height*0.5 + 11.5;}

    show(){

        // torso
        fill(200, 137, 93);
        rect(this.x, this.y+8, this.width*0.5, this.height, 20, 20, 5, 5);

        // head
        fill(200, 67, 33);
        rect(this.x, this.y, this.width, this.height, 20, 20, 5, 5);

        // eyes
        fill(255, 255, 255);
        ellipse(this.x - 10, this.y-10, 10, 22);
        ellipse(this.x + 10, this.y-10, 10, 22);

        // eyebrows
        fill(0, 0 ,0);
        triangle(this.x-4, this.y-17, this.x-18, this.y-20, this.x-18, this.y-26);
        triangle(this.x+4, this.y-17, this.x+18, this.y-20, this.x+18, this.y-26);


        // iris 

        fill(0, 0, 0);
        ellipse(this.x - 9, this.y-12, 5, 8);
        ellipse(this.x + 9, this.y-12, 5, 8);

        
        // teeth
        fill(255, 255, 255);
        triangle(this.x-9, this.y+8,   this.x-3, this.y+8, this.x-6, this.y+1);
        triangle(this.x+9, this.y+8,   this.x+3, this.y+8, this.x+6, this.y+1);

        // mouth
        line(this.x - 9, this.y+8, this.x+9, this.y+8);

        // shoes
        fill(130, 67, 33);
        ellipse(this.x + 15, this.y+25, 24, 15);
        ellipse(this.x - 15, this.y+25, 24, 15);

    }

    hitbox(){

        fill(0, 0, 0, 0);
        stroke(0, 0, 0);
        rect( (this.hboxr() + this.hboxl())/2,(this.hboxu() + this.hboxd())/2 ,
         this.width, this.hboxu() - this.hboxd() );
        fill(0);
        ellipse(this.x, this.hboxd(), 7, 7 );
        ellipse(this.x, this.hboxu(), 7, 7 );
        ellipse(this.hboxl(), this.y, 7, 7 );
        ellipse(this.hboxr(), this.y, 7, 7 );
    }

}

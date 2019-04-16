/**
 * Authur: Carlos Carbajal
 * 
 * sketch.js
 * 
 * Decription: This is the main part that draws everything on screen.
 */
let points;
let hullPoints;
let run;
let initRun;
let fr = 30;
let lowestPtP; 

function setup(){
    createCanvas(1200, 700);

    points = generatePoints();
    run=false; initRun=true;
    hullPoints = new GrahamScan(points);   
        
    setUpButtons();
    
}

function draw(){
    background('#ffffcc');
    frameRate(fr);
    strokeWeight(1);
    if(run){
        hullPoints.run();
        if(!hullPoints.isFinished()){
            run = false;
        }
    }
    hullPoints.drawPoints();
    hullPoints.displayHull();
}

function setUpButtons(){
    //Create buttons to be used.
    startPauseButton = createButton("Start/Pause");
    startPauseButton.class("btn btn-primary");
    startPauseButton.mousePressed(function(){
        run = !run;
        if(hullPoints.numPoints()==0){
            hullPoints.calculateCH();
        }
    });

    resetButton = createButton("Reset");
    resetButton.class("btn btn-primary");    
    resetButton.mousePressed(function(){
        hullPoints = [];
        points = [];
        run = false;
        points = generatePoints();
        hullPoints= new GrahamScan(points);

    });

    speedUpButton = createButton("Speed Up");
    speedUpButton.class("btn btn-secondary");
    speedUpButton.mousePressed(function(){
        if(fr==100){
            fr = 100;
        }else{
            fr++;
        }
    });

    slowdownButton = createButton("Slow Down");
    slowdownButton.class("btn btn-secondary");
    slowdownButton.mousePressed(function(){
        if(fr==5){
            fr = 5;
        }else{
            fr--;
        }
    });
}

/**
 * generatePoints()
 * 
 * Description: Autogenerate random set of points. Offsets by 10 pixels
 *          from each side of the window.
 * 
 */
function generatePoints(){
    let result = [];
    for(let i = 0; i < 300; i++){
        result.push(new Point(random(10,1190), random(10,690)));
    }
    return result; 
}

/**
 * Authur: Carlos Carbajal
 */
let points;
let hullPoints;
let currHullIndex;
let pointIndex;
let run;
let bestAngle;
let angle;
let bestPoint;
let fr = 10;
let lowestPtP; 

function setup(){
    createCanvas(1200, 700);
    frameRate(fr);
    // points = [];
    // hullPoints = [];
    points = generatePoints();
    // lowestPtP = findLowest();
    // hullPoints.push(lowestPtP);
    run=true;
    gscan = new GrahamScan(points);   
    // points.shift();
    // points = mergeSort(points);
    // points.unshift(lowestPtP);
    
    setUpButtons();

    //Initialize globals
    // currHullIndex = 0;
    // pointIndex=0;
    // bestAngle=0;
    // angle=0;
    // bestPoint = -1;
    
}

function draw(){
    background('#ffffcc');
    frameRate(fr);
    if(run){
        gscan.run();
    }
    gscan.drawPoints();
    gscan.displayHull();
}

function setUpButtons(){
    //Create buttons to be used.
    startPauseButton = createButton("Start/Pause");
    startPauseButton.class("btn btn-primary");
    startPauseButton.mousePressed(function(){
        run = !run;
        // console.log(run)
    });

    resetButton = createButton("Reset");
    resetButton.class("btn btn-primary");    
    resetButton.mousePressed(function(){
        points = [];
        hullPoints = [];
        currHullIndex = 0;
        pointIndex=0;
        bestAngle=0;
        angle=0;
        bestPoint = -1;
        gscan = new GrahamScan();
        points = generatePoints();

    });

    speedUpButton = createButton("Speed Up");
    speedUpButton.class("btn btn-secondary");
    speedUpButton.mousePressed(function(){
        if(fr==100){
            fr = 100;
        }else{
            fr++;
        }
        frameRate(fr);
    });

    slowdownButton = createButton("Slow Down");
    slowdownButton.class("btn btn-secondary");
    slowdownButton.mousePressed(function(){
        if(fr==10){
            fr = 0;
        }else{
            fr--;
        }
        frameRate(fr);
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
    for(let i = 0; i < 100; i++){
        result.push(new Point(random(10,1190), random(10,690)));
    }
    // console.log(result);
    // run = false;
    return result; 
}

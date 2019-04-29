/**
 * Authur: Carlos Carbajal
 * 
 * Class: GrahamScan
 * 
 * Description: 
 * 
 */

let GrahamScan = (function() {
    /**** GLOBALS *****/
    let lowestPtP = null;
    let index;
    let sortedPts;
    let numPts; 
    let convexHull;

    //Constructor
    function GrahamScan(points){
        this.points = points;
        numPts = points.length;
        convexHull = [];
        sortedPts=[];
        // this.runFlag = false;
        
        let mods = findLowest(this.points);
        lowestPtP = mods.low;
        this.points = mods.pts;
        this.points.shift(this.points);
        sortedPts = this.points;

        /**
         * This sorts the set of points based of on the 
         * angle from the bottom most point. 
         * 
         * JavaScripts sort method uses Merge Sort,
         * Gives us the runtime of O(nlogn).
         */
        sortedPts.sort(function(p1,p2){
            let orient = orientation(lowestPtP,p1,p2);
            //If 2 points are colinear then the closest one is to
            // lowestPtP comes first.
            if(orient == 0){
                if(calcDist(lowestPtP,p1) >= calcDist(lowestPtP,p2)){
                    return 1;
                }else{
                    return -1;
                }
            }
            return orient;
        });

        // Since we are sorting in respect to lowestPtP, we added it to the head of the array.
        sortedPts.unshift(lowestPtP);

        index = -1;
        this.calculateHull = false;
    }

    /**
     * run()
     * Description: This is the main driver of the Graham Scan Algorithm
     */
    GrahamScan.prototype.run = function(){
    
        if(index >= sortedPts.length) { calculateHull = false; return};

        //Initital 3 points added to the boundary of convex hull
        if(index < 0){
            convexHull.push(sortedPts[0]);
            convexHull.push(sortedPts[1]);
            convexHull.push(sortedPts[2]);
            
            index = 2;
        }else if(index <= numPts){
            //Get last 3 elems in array (top 3 elems in stack)
            let last = convexHull.length;
            let p = convexHull[last-3];
            let c = convexHull[last-2];
            let n = convexHull[last-1];
    
            let orient = orientation(p, c, n);
            
            if(orient > 0){
                if(convexHull.length > 3){
                    //This is the backtracing of Graham Scan
                    while(orient > 0 && convexHull.length > 3){
                        /**
                         * Emulate the Stack used in algorithm
                         */
                        let lastPt = convexHull.pop(); //save the last element (n) from array and pop it
                        convexHull.pop(); //Remove point that causes right hand turn (c)
                        convexHull.push(lastPt); //add (n) back into 'stack' and becomes the new (c)
                        
                        // Recalulcate the orientation of the next 3 points
                        last = convexHull.length;
    
                        p = convexHull[last-3];
                        c = convexHull[last-2];
                        n = convexHull[last-1];
                        orient = orientation(p, c, n);
                    }
                }else{
                    /**
                     * Same work as above except without recalcuating the orientation
                     */
                    let lastPt = convexHull.pop();
                    convexHull.pop();
                    convexHull.push(lastPt);
                    if(index< numPts){
                        convexHull.push(sortedPts[(index+1)%numPts]);
                    }
                    index++;
                }
    
            }else if(orient <= 0 && index < numPts){
                convexHull.push(sortedPts[(index+1)%numPts]);
                index++;
            }
        }
    }

    /**
     * displayHull()
     * Descripiton: Display the boundary if convex hull
     */
    GrahamScan.prototype.displayHull = function(){
        
        if(this.calculateHull && convexHull.length > 1){
            for(let i=2; i < convexHull.length; i++){
                // convexHull[i].setColor("orange")
                let p0 = convexHull[i-2];
                let p1 = convexHull[i-1];
                let p2 = convexHull[i];
                stroke("orange");
                strokeWeight(5);
                line(p0.xCoor,p0.yCoor, p1.xCoor,p1.yCoor);
                //CHeck if the connect to back to the starting point
                if(convexHull[0] != convexHull[i]){
                    stroke("black");
                }else{
                    stroke("orange");
                }
                line(p1.xCoor,p1.yCoor, p2.xCoor,p2.yCoor);
            }
        }
    }

    /**
     * drawPoints()
     * Decscription: Display all the points
     */
    GrahamScan.prototype.drawPoints = function(){
        for(let i=0; i < this.points.length; i++){
            this.points[i].display();
        }
    }

    GrahamScan.prototype.calculateCH = function(){
        return this.calculateHull = !this.calculateHull;
    }

    GrahamScan.prototype.isFinished = function(){
        return this.calculateHull;
    }

    GrahamScan.prototype.numPoints = function(){
        return convexHull.length;
    }


    /********************************************
     * 
     * Private Methods
     * 
     *********************************************/

    /** 
     * findLowest();
     * Descripition: Find the point with lowest y-coordinate
    */
    function findLowest(points){
        let lowP = points[0];
        let pIndex = 0;
        for(let i=1; i < points.length; i++){
            if(lowP.yCoor == points[i].yCoor){
                if(lowP.xCoor > points[i].xCoor){
                    lowP = points[i];
                    pIndex = i;
                }
            }
            if(lowP.yCoor < points[i].yCoor){
                lowP = points[i];
                pIndex = i;
            }
        }
        //Remove lowest point and insert it at the head of the array
        points.splice(pIndex, 1);
        points.unshift(lowP);
        points[0].setColor("red");
        return {low: lowP, pts: points};
    }

    /**
     * orientation()
     * Decription:  This calculates the which side the next point will land
     * @param {*} p 
     * @param {*} q 
     * @param {*} r 
     */
    function orientation(p, q, r){
        
        let vec1 = createVector(q.xCoor-p.xCoor, q.yCoor-p.yCoor);
        let vec2 = createVector(r.xCoor-q.xCoor, r.yCoor-q.yCoor);

        /**
         * P5.js Crossproduct: 
         *       (q.yCoor-p.yCoor) * (r.xCoor-q.xCoor) - (q.xCoor-p.xCoor)*(r.yCoor-q.yCoor);
         */
        let result = vec1.cross(vec2);

        
        if(result.z == 0.0){
            return 0; //Collinear
        }else if(result.z > 0.0){
            return 1; //Right turn
        }else{
            return -1; //left turn   
        } 
    }

    /**
     * 
     * @param {*} pt1 
     * @param {*} pt2 
     */
    function calcDist(pt1, pt2){
        let vect1 = createVector(pt1.xCoor,pt1.yCoor);
        let vect2 = createVector(pt2.xCoor,pt2.yCoor);

        return vect1.dist(vect2);
    }
    return GrahamScan;
})();
    


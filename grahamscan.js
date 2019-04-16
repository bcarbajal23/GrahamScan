
let GrahamScan = (function() {
    let lowestPtP = null;
    let index = 0;
    let sortedPts;
    let numPts; 
    let convexHull; 
    function GrahamScan(points){
        this.points = points;
        numPts = points.length;
        convexHull = [];
        sortedPts=[];
        // this.runFlag = false;
        
        let mods = findLowest(this.points);
        lowestPtP = mods.low;
        this.points = mods.pts;
        // console.log(this.points)
        this.points.shift(this.points);
        sortedPts = this.points;

        sortedPts.sort(function(p1,p2){
            let orient = orientation(lowestPtP,p1,p2);
            // console.log(orient)
            if(orient == 0){
                if(calcDist(lowestPtP,p1) >= calcDist(lowestPtP,p2)){
                    return 1;
                }else{
                    return -1;
                }
            }
            return orient;
        });
        // sortedPts = mergeSort(this.points);

        sortedPts.unshift(lowestPtP);
        // console.log(sortedPts)
        // console.log(lowestPtP)z
        convexHull.push(sortedPts[0]);
        convexHull.push(sortedPts[1]);
        convexHull.push(sortedPts[2]);
        // console.log(convexHull)
        
        index = 2;
    }

    GrahamScan.prototype.run = function(){
    
        if(index >= sortedPts.length) return;
        console.log("index: "+index)
        if(index <= numPts){
            let last = convexHull.length;
            let p = convexHull[last-3];
            let c = convexHull[last-2];
            let n = convexHull[last-1];
    
            let orient = orientation(p, c, n);
            
            // console.log(convexHull)
            if(orient > 0){
                if(convexHull.length > 3){
                    console.log("Remove cuppa")
                    while(orient > 0 && convexHull.length > 3){
                        
                        // let removeIndex = convexHull.indexOf(c);
                        
                        // let temp = convexHull.splice(0,removeIndex);
                        // temp.concat(convexHull.splice(removeIndex+1));
                        
                        // convexHull = temp;
                        let lastPt = convexHull.pop();
                        convexHull.pop();
                        convexHull.push(lastPt);
                        last = convexHull.length;
    
                        p = convexHull[last-3];
                        c = convexHull[last-2];
                        n = convexHull[last-1];
                        orient = orientation(p, c, n);
                    }
                }else{
                    console.log(convexHull)
                    let lastPt = convexHull.pop();
                    convexHull.pop();
                    convexHull.push(lastPt);
                    console.log(convexHull)
                    if(index< numPts){
                        console.log("add!!!!!")
                        convexHull.push(sortedPts[(index+1)%numPts]);
                    }
                    index++;
                }
    
            }else if(orient <= 0 && index < numPts){
                console.log("Add points")
                convexHull.push(sortedPts[(index+1)%numPts]);
                index++;
            }
        }
        // console.log(convexHull.length)
        // console.log(convexHull)
    }

    GrahamScan.prototype.displayHull = function(){
        stroke("orange")
        if(convexHull.length > 1){
            for(let i=0; i < convexHull.length-1; i++){
                
                // this.convexHull[i].setColor("orange")
                
                // this.convexHull[i].display();
                let p0 = convexHull[i]
                // p0.setColor("orange");
                let p1 = convexHull[i+1]
                // p1.setColor("orange");
                // strokeWeight(5)
                line(p0.xCoor,p0.yCoor, p1.xCoor,p1.yCoor);
            }
        }
        
    }

    GrahamScan.prototype.drawPoints = function(){
        for(let i=0; i < this.points.length; i++){
            this.points[i].display();
        }
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
     * 
     * @param {*} p 
     * @param {*} q 
     * @param {*} r 
     */
    function orientation(p, q, r){
        
        let vec1 = createVector(q.xCoor-p.xCoor, q.yCoor-p.yCoor);
        let vec2 = createVector(r.xCoor-q.xCoor, r.yCoor-q.yCoor);

        let result = vec1.cross(vec2);
        // let result = (q.yCoor-p.yCoor) * (r.xCoor-q.xCoor) - (q.xCoor-p.xCoor)*(r.yCoor-q.yCoor);
        // console.log(result)
        if(result.z == 0.0){
            return 0; //Collinear
        }else if(result.z > 0.0){
            return 1; //Clockwise turn
        }else{
            return -1; //Counterclockwise turn   
        } 
    }

    /**
     * mergeSort()
     * Decription: This function uses the merge sort algorithm to sort the set of points
     * @param {*} tempPoints 
     */
    function mergeSort(tempPoints){
        if(tempPoints.length === 1){
            return tempPoints;
        }
        
        const middle = Math.floor(tempPoints.length / 2);
        const left = tempPoints.slice(0, middle);
        const right = tempPoints.slice(middle);

        return merge(mergeSort(left),mergeSort(right));
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

    /**
     * merge()
     * Decription: Helper function for mergeSort function above.
     * @param {*} leftArr 
     * @param {*} rightArr 
     */
    function merge(leftArr, rightArr){
        // console.log("Merge: ")
        let sortedArr = []
        let leftIndex = 0;
        let rightIndex = 0;

        while(leftIndex < leftArr.length && rightIndex < rightArr.length){
            
            let orient = orientation(lowestPtP, leftArr[leftIndex], rightArr[rightIndex]);

            if(orient == 0){
                let dist1 = calcDist(this.lowestPtP, leftArr[leftIndex]);
                let dist2 = calcDist(this.lowestPtP, rightArr[rightIndex]);

                if(dist1 < dist2){
                    sortedArr.push(leftArr[leftIndex]);
                    sortedArr.push(rightArr[rightIndex]);
                    leftIndex++;
                    rightIndex++;    
                }else{
                    sortedArr.push(rightArr[rightIndex]);
                    sortedArr.push(leftArr[leftIndex]);
                    leftIndex++;
                    rightIndex++;
                }
            }else if(orient < 1){
                sortedArr.push(leftArr[leftIndex]);
                leftIndex++;
            }else{
                sortedArr.push(rightArr[rightIndex]);
                rightIndex++;
            }
            
        }

        return sortedArr.concat(leftArr.slice(leftIndex)).concat(rightArr.slice(rightIndex));

    }
    return GrahamScan;
})();
    


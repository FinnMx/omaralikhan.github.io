/**
 * Class used to create the simulator environment that Tracy is run in.
 * @class Pathfinder
 * @constructor
 */
function Pathfinder(){
    this.paths = [];
    this.currentPath = new Path();
}

/**
 * @method getBreakingDelay
 * @return {Int}
 */
Pathfinder.prototype.getBreakingDelay = function (){
    switch(this.currentPath.getCurrentNodeType()){
        case "Start":
            return 1500;
            break;
        case "Street":
            return 1500;
            break;
        case "Junction":
            return 0;
            break;
    }
}

/**
 * - Function that is responsible for the zumo to "make a decision",
 * chooses what path to follow depending on whats already been explored
 * & where we are going.
 * @method makeDecision
 * @param {Object} Prox
 */
Pathfinder.prototype.makeDecision = function (prox){
    this.currentPath.addNode(prox)
    

}

/**
 * - Function that is responsible for checking if a the route we want to follow
 * has been fully explored or not
 * @method chooseTurn
 * @param {Object} Prox
 */
Pathfinder.prototype.chooseTurn = function (){
    this.currentPath.
    
}
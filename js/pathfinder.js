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
 * - Function that returns a list of all the nodes,
 * useful to see the finalised memory of the zumos maze
 * interpretation.
 * @method returnCurrentNode
 * @return {Object}
 */
Pathfinder.prototype.returnCurrentNode = function (){
    return this.nodes[this.currentNode];
}

/**
 * @method getBreakingDelay
 * @return {Int}
 */
Pathfinder.prototype.getBreakingDelay = function (){
    console.log(this.currentPath.getCurrentNodeType());
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

}

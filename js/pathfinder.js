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
        this.chooseAction();
    setTimeout(function() {
        simulator.startSolving();
    }, 2000);

}

/**
 * - Function that is responsible for not going over the same route again,
 * ADD ROUTE CHECKING!!!!!!!
 * @method chooseAction
 */
Pathfinder.prototype.chooseAction = function (){
    switch(this.currentPath.getCurrentNodeType()){
        case "Junction":
            this.currentPath.addInstruction(simulator.driveTurnLeft(90));
            break;
        case "EntranceLeft":
            break;
        case "EntranceRight":
            break;
        case "End":
            this.returnToStart();
            break;
    }
    
}

/**
 * @method returnToStart
 */
Pathfinder.prototype.returnToStart = function (){

}
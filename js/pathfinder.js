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
    //console.log(prox);
    this.currentPath.addNode(prox);
    console.log(this.currentPath.nodes);
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
            this.currentPath.addInstruction("LEFT");
            this.instructionLookUp(this.currentPath.getCurrentInstruction(), false);
            break;
        case "EntranceLeft":
            this.currentPath.addInstruction("LEFT");
            this.instructionLookUp(this.currentPath.getCurrentInstruction(), false);
            break;
        case "Street":
            break;
        case "EntranceRight":
            this.currentPath.addInstruction("RIGHT");
            break;
        case "End":
            this.returnToStart();
            break;
    }
}

/**
 * - Function that is responsible looking up and performing turns
 * @method instructionLookUp
 */
Pathfinder.prototype.instructionLookUp = function (instruction, inverse){
    if(inverse==false){
        switch(instruction){
            case "LEFT":
                simulator.driveTurnLeft(90);
                break;
            case "RIGHT":
                simulator.driveTurnRight(90);
                break;
        }
    }else if(inverse==true){
        switch(instruction){
            case "LEFT":
                simulator.driveTurnRight(90);
                break;
            case "RIGHT":
                simulator.driveTurnLeft(90);
                break;
        }
    }
}

/**
 * @method returnToStart
 */
Pathfinder.prototype.returnToStart = function (){
    simulator.returnToStart();
    console.log("balls");

    this.paths.push(this.currentPath);
}
/**
 * Class used to create the simulator environment that Tracy is run in.
 * @class Pathfinder
 * @constructor
 */
function Pathfinder(){
    this.nodes = [];
    this.currentNode = 0;

    var startNode = new Node;
    this.nodes.push(startNode);
}

/**
 * @method setCurrentNodeType
 * @param {Object} Prox
 */
Pathfinder.prototype.setCurrentNodeType = function (Prox){
    if(this.currentNode == 0){
        this.nodes[this.currentNode].setNodeType("Start");
    }else if(Prox.left > 0 && Prox.right > 0 && Prox.front == 0 && Prox.back == 0){
        this.nodes[this.currentNode].setNodeType("Street");
    }else if(Prox.left == 0 && Prox.right == 0 && Prox.front == 0 && Prox.back == 0){
        this.nodes[this.currentNode].setNodeType("Junction");
    } else if(Prox.left > 0 && prox.right > 0 && prox.front > 0){

    }
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
 * - Function that returns a list of all the nodes,
 * useful to see the finalised memory of the zumos maze
 * interpretation.
 * @method returnNodes
 * @return {Object}
 */
Pathfinder.prototype.returnNodes = function (){
    return this.nodes;
}

/**
 * @method getBreakingDelay
 * @return {Int}
 */
Pathfinder.prototype.getBreakingDelay = function (){
    switch(this.nodes[this.currentNode].nodeType){
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
    var node = new Node();
    node.setReturnNode(this.nodes[this.currentNode]);

}

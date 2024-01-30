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
    if(Prox.left > 0 && Prox.right > 0 && Prox.front == 0 && Prox.back == 0){
        this.nodes[this.currentNode].setNodeType("Start");
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


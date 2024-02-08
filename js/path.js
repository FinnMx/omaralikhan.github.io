/**
 * Class used to create a path
 * @class Pathfinder
 * @constructor
 */
function Path(){
    this.nodes = [];
    this.instructionSet = [];

    var startNode = new Node(tracy.getProximitySensorReading(), true);
    this.nodes.push(startNode);
}

/**
 *  Function to return Node type
 *  - Node type is the type of path that Tracy is currently in,
 *  I.E a Street, House, or Dead-end.
 * @method getCurrentNodeType
 * @return {String}
 */
Path.prototype.getCurrentNodeType = function(){
    return this.nodes[this.nodes.length - 1].getNodeType();
}

/**
 *  Function to return length of instructionSet
 * @method getInstructionSetSize
 * @return {int}
 */
Path.prototype.getInstructionSetSize = function(){
    return Object.keys(this.instructionSet).length;
}

/**
 *  Function to return length of instructionSet
 * @method getCurrentInstruction
 */
Path.prototype.getCurrentInstruction = function(){
    return this.instructionSet[this.instructionSet.length - 1]
}

/**
 *  Function to return length of instructionSet
 * @method addInstruction
 * @param {String} instruction
 */
Path.prototype.addInstruction = function(instruction){
    this.instructionSet.push(instruction);
}

/**
 *  Function to return length of instructionSet
 * @method addNode
 * @param {Object} prox
 */
Path.prototype.addNode = function(prox){
    var node = new Node(prox, false);
    this.nodes.push(node);
}


/**
 * Class used to create the simulator environment that Tracy is run in.
 * @class Simulator
 * @constructor
 */
function Node(){
    this.nodeType;
    this.paths = [];
}

/**
 *  Function to return Node type
 *  - Node type is the type of path that Tracy is currently in,
 *  I.E a Street, House, or Dead-end.
 * @method getNodeType
 * @return {String}
 */
Node.prototype.getNodeType = function(){
    return this.nodeType;
}

/**
 *  Function to set the Node type
 * @method setNodeType
 * @param {String} input
 */
Node.prototype.setNodeType = function(input){
    this.nodeType = input;
}

/**
 * Function to add a new path to a node
 * @method addPath
 * @param {Object} path
 */
Node.prototype.addPath = function(path){
    paths.push(path);
}
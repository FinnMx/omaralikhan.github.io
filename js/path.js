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


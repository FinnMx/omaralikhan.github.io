/**
 * Class used to create the simulator environment that Tracy is run in.
 * @class Simulator
 * @constructor
 */
function Node(prox, isStart){
    this.isStart = isStart;
    this.nodeType = this.setType(prox);

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
 * @method setType
 * @param {Object} prox
 */
Node.prototype.setType = function(prox){
    if(this.isStart){
        return "Start";
    }else if(prox.left > 0 && prox.right > 0 && prox.front == 0 && prox.back == 0){
        return "Street";
    }else if(prox.left == 0 && prox.right == 0 && prox.front == 0 && prox.back == 0){
        return "Junction";
    } else if(prox.left > 0 && prox.right > 0 && prox.front > 0){

    }
}

/**
 * Function to add a new path to a node
 * @method addPath
 * @param {Object} path
 */
Node.prototype.addPath = function(path){
    paths.push(path);
}

/**
 *  Function to set the return Node
 * @method setReturnNode
 * @param {Object} returnNode
 */
Node.prototype.setReturnNode = function(returnNode){
    this.returnNode = returnNode;
}
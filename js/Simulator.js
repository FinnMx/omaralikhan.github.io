/**
 * Class used to create the simulator environment that Tracy is run in.
 * @class Simulator
 * @constructor
 */
function Simulator()
{
    TracyX = 0;
    TracyY = 10;
    TracyZ = 2;

    /* Demo is used to help manage the scene and integrate the physics engine
    Cannon JS with the graphics engine Three JS */
    demo = new CANNON.Demo();
    world = demo.getWorld();

    /* Set initial settings (e.g. gravity, friction) of the world */
    this.initialiseWorld(-9.8,3);

    /* Container used to manage multiple robots */
    robots = [];

    /* Store reference to simulator object */
    var self = this;

    /* Create a scene with a single Tracy as default */
    demo.addScene("main",function()
        {
            /* Initialise world and add ground */
            self.createFloorGrid(90,90);

            /* Add Tracy */
            // robot = new Tracy(0,0,5);
            // self.addTracy(robot);
        });
        demo.start();

    /* Gui cannot load until robot is added to the world */
    setTimeout(initialiseGui.bind(this),1000);

    /* Keyboard Controls */
    document.onkeydown = self.handleKeyboardInput;
    document.onkeyup = self.handleKeyboardInput;
}

Simulator.prototype.getWorld = function(){
    return world;
}

/** 
 * Initialise the GUI which will display sensor readings 
 * @method initialiseGui
 */ 
function initialiseGui()
{
    /* Data to display on the gui using the gui.dat framework */
    gui = new dat.GUI();
    gui.addFolder("Accelerometer (meters/second)");
    gui.add(robots[0].acceleration,"x",-10,10).listen();
    gui.add(robots[0].acceleration,"y",-10,10).listen();
    gui.add(robots[0].acceleration,"z",-10,10).listen();

    gui.addFolder("Magnetometer (degrees)");
    gui.add(robots[0].orientation,"x",-360,360).listen();
    gui.add(robots[0].orientation,"y",-360,360).listen();
    gui.add(robots[0].orientation,"z",-360,360).listen();

    gui.addFolder("Gyroscope (radians/second)");
    gui.add(robots[0].chassisBody.angularVelocity,"x",-10,10).listen();
    gui.add(robots[0].chassisBody.angularVelocity,"y",-10,10).listen();
    gui.add(robots[0].chassisBody.angularVelocity,"z",-10,10).listen();

    gui.addFolder("Proximity Sensor (meters)");
    gui.add(robots[0].proximitySensorReading,"left",0,4).listen();
    gui.add(robots[0].proximitySensorReading,"right",0,4).listen();
    gui.add(robots[0].proximitySensorReading,"front",0,4).listen();
    gui.add(robots[0].proximitySensorReading,"back",0,4).listen();

    var self = this;

    /* Create a buttons object to hold all the functions that can be acces through the gui */
    var buttons = { 
        resetTracy: self.resetTracy
    }

    gui.add(buttons,'resetTracy').name("Reset Tracy");
}


/**
 * Reset Tracy to her original position.
 * @method resetTracy
 */ 
Simulator.prototype.resetTracy = function()
{
    robots[0].chassisBody.position.copy(robots[0].chassisBody.initPosition);
    robots[0].chassisBody.velocity.copy(robots[0].chassisBody.initVelocity);
    robots[0].chassisBody.angularVelocity.copy(robots[0].chassisBody.initAngularVelocity);
    robots[0].chassisBody.quaternion.copy(robots[0].chassisBody.initQuaternion);
}

/** 
 * Set the initial settings for the world 
 * @method initialiseWorld
 * @param {Float} gravity   The value of the gravity to be applied in the +Z direction.
 * @param {Float} friction  The value of the default friction to be applied in the world.
 */
Simulator.prototype.initialiseWorld = function(gravity, friction)
{
    world.broadphase = new CANNON.SAPBroadphase(world);
    world.gravity.set(0, 0, gravity);
    world.defaultContactMaterial.friction = friction;

    /* Create materials which help define the interaction between different objects in the world */
    this.createMaterials();
    

    /* Add an event listener to update the wheels after every step in Cannon JS */
    world.addEventListener('postStep', function(){
        /* Loop over all the wheels in all the robots and update them */
        for (var j = 0; j < robots.length; j++ ) 
        {
            for (var i = 0; i < robots[j].vehicle.wheelInfos.length; i++) 
            {
                robots[j].vehicle.updateWheelTransform(i);
                var t = robots[j].vehicle.wheelInfos[i].worldTransform;
                var wheelBody = robots[j].vehicle.wheelBodies[i];
                wheelBody.position.copy(t.position);
                wheelBody.quaternion.copy(t.quaternion);
            }
        }
    });
}

/** 
@method createMaterials
*/
Simulator.prototype.createMaterials = function(){
this.groundMaterial = new CANNON.Material("groundMaterial");
this.wheelMaterial = new CANNON.Material("wheelMaterial");

/* Define the properties of the wheel to ground interaction */
var wheelGroundContactMaterial = new CANNON.ContactMaterial(this.wheelMaterial, this.groundMaterial, {
    friction: 100,
    restitution: 100
});

/* Add the material to the world */
world.addContactMaterial(wheelGroundContactMaterial);

}

/** 
@method getGroundMatt
@return {Object}
*/
Simulator.prototype.getGroundMatt = function(){
    return this.groundMaterial;
}
/** 
@method getWheelMatt
@return {Object}
*/
Simulator.prototype.getWheelMatt = function(){
    return this.wheelMaterial;
}

/**
 * Creates a floor grid containing rows by columns number of tiles.
 * Each tile is of size 1 and is created as a static body.
 * @method createFloorGrid
 * @param {Integer} rows    The number of rows of tiles.
 * @param {Integer} rolumns The number of columns of tiles.
 */
Simulator.prototype.createFloorGrid = function(rows,columns)
{
    /* Create an array of arrays filled with 1's. Each value will be used
    to create a single tile of height 1 (i.e. it will be flat). */
    var heightfieldData = Array(rows).fill(Array(columns).fill(1));

    /* Create heightfield using the data generated. */
    var shape = new CANNON.Heightfield(heightfieldData, {elementSize:1});

    /* Set mass to 0 to make the ground static allowing it to ignore gravity. */
    var body = new CANNON.Body({ mass: 0, Material: this.groundMaterial });
    body.addShape(shape);

    /* Calculate the x,y coordinates required to center the grid in the world */
    var positionX = rows/2;
    var positionY = columns/2;
    body.position.set(-positionX, -positionY, 0);

    /* Add to physics and graphics engine */
    world.addBody(body);
    demo.addVisual(body);
}

/**
 * Add a block of weight 1kg and dimensions of width x length x height
 * at position x, y, z to the world.
 * @method addBlock
 * @param {Float} positionX The x coordinate of where the block will be placed.
 * @param {Float} positionY The y coordinate of where the block will be placed.
 * @param {Float} positionZ The z coordinate of where the block will be placed.
 * @param {Float} width     The width of the block to be added.
 * @param {Float} length    The length of the block to be added.
 * @param {Float} height    The height of the block to be added.
 */ 
Simulator.prototype.addBlock = function(positionX,positionY,positionZ,
                                        width,length,height)
{
    var shape = new CANNON.Box(new CANNON.Vec3(width,length,height));
    var body = new CANNON.Body({ mass: 0 });
    body.addShape(shape);
    body.position.set(positionX,positionY,positionZ);
    world.addBody(body);
    demo.addVisual(body);
}

/**
 * Add a house
 * at position x, y, z to the world.
 * @method addHouse
 * @param {Float} positionX The x coordinate of where the block will be placed.
 * @param {Float} positionY The y coordinate of where the block will be placed.
 * @param {Float} positionZ The z coordinate of where the block will be placed.
 * @param {Float} width     The width of the block to be added.
 * @param {Float} length    The length of the block to be added.
 * @param {Float} height    The height of the block to be added.
 */ 
Simulator.prototype.addHouse = function(positionX,positionY,positionZ)
{
var shape = new CANNON.Box(new CANNON.Vec3(1,1,1));
var body = new CANNON.Body({ mass: 0 });
body.addShape(shape);
body.position.set(positionX,positionY,positionZ);
world.addBody(body);
demo.addVisual(body);
}

/**
 * Create a ramp of dimensions 20x5x0.5 that is tilted at an angle of 30 degrees. The purpose
 * of the ramp is to allow testing the sensors of Tracy in the Z axis.
 * @method addRamp
 * @param {Integer} x The x coordinate of where the ramp will be placed.
 * @param {Integer} y The y coordinate of where the ramp will be placed.
 */
Simulator.prototype.addRamp = function(x,y)
{
    var shape = new CANNON.Box(new CANNON.Vec3(20,5,0.5));
    /* Create the ramp as a static body */
    var body = new CANNON.Body({ mass: 0 });
    body.addShape(shape);
    body.position.set(x,y,0);
    body.quaternion.setFromAxisAngle(new CANNON.Vec3(0,1,0),THREE.Math.degToRad(-30));
    world.addBody(body);
    demo.addVisual(body);
}


/**
 * Create a simple line to allow testing of Tracy's line sensors. The lines are 
 * represented as slim rectangles of dimensions length x 0.5 x 0.5.
 * @method addLine
 * @param {Float} x             The starting x coordinate of the line.
 * @param {Float} y             The starting y coordinate of the line.
 * @param {Float} length        The length of the line from the starting point.
 * @param {Float} orientation   The angle of the line represented as degrees.
 * @param {Float} brightness    The brightness of the line that will be read by the line sensors.
 */
Simulator.prototype.addLine = function(x,y,length,orientation,brightness)
{
    var shape = new CANNON.Box(new CANNON.Vec3(length,0.5,0.5));
    var body = new CANNON.Body({ mass: 0 });
    body.addShape(shape);
    /* Place line slightly aboe the ground so it is visible */
    body.position.set(x,y,0.6);
    body.brightness = brightness;
    var rotationAxis = new CANNON.Vec3(0,0,1);
    var rotationAngle = THREE.Math.degToRad(orientation);
    body.quaternion.setFromAxisAngle(rotationAxis,rotationAngle);
    world.addBody(body);
    demo.addVisual(body);
}

/**
 * Add a Tracy into the simulator. This will create a physical
 * body for Tracy in Cannon JS and then a visual body in Three JS.
 * @method addTracy
 * @param {Object} tracy The Tracy object that will be added to the world.
 */
Simulator.prototype.addTracy = function(tracy)
{
	/* Add Tracy to our list of robots */
	robots.push(tracy);

	/* Add the chassis to the world */
    demo.addVisual(tracy.chassisBody);

	/* Add Tracy's vehicle body to the physics engine */
    tracy.vehicle.addToWorld(world);

    /* Add each of Tracy's wheels to the physics engine */
    for(var i=0; i<tracy.vehicle.wheelInfos.length; i++)
    {
    	var wheelBody = tracy.vehicle.wheelBodies[i];
    	demo.addVisual(wheelBody);
    	world.addBody(wheelBody);
    }
}

/**
 * Return the Tracy object at the given index if multiple Tracy are present.
 * @method getTracy
 * @param {Integer} index The index of the Tracy to be retrieved.
 */
Simulator.prototype.getTracy = function(index)
{
    if(index > robots.length) { return robots[0]; }
    return robots[index];
}

/**
 * Returns the position of Tracy in the world as an XYZ vector.
 * @method getTracyPosition
 * @return {Object} Returns a CANNON.Vec3 object which has .x .y .z properties.
 *
 */
Simulator.prototype.getTracyPosition = function()
{
    return robots[0].chassisBody.position;
}

/**
 * Allow user to control Tracy for debugging purposes.
 * @method handleKeyboardInput
 * @param {Object} event The key that is pressed.
 */
Simulator.prototype.handleKeyboardInput = function(event)
{
            var maxForce = 5;
            var rotationForce = 20;
            var up = (event.type == 'keyup');

            if(!up && event.type !== 'keydown')
            {
                return;
            }

            // Set breaks to reset car to initial position.
            robots[0].vehicle.setBrake(0, 0);
            robots[0].vehicle.setBrake(0, 1);
            robots[0].vehicle.setBrake(0, 2);
            robots[0].vehicle.setBrake(0, 3);

            switch(event.keyCode)
            {
                case 38: // forward
                //different way to move Tracy, updates positions, no friction or roll or drift e.t.c
                    //TracyX += 0.1;
                    //robots[0].chassisBody.position.set(TracyX,TracyY,TracyZ);

                    robots[0].vehicle.applyEngineForce(up ? 0 : maxForce, 2);
                    robots[0].vehicle.applyEngineForce(up ? 0 : maxForce, 3);
                    break;

                case 40: // backward
                    robots[0].vehicle.applyEngineForce(up ? 0 : -maxForce, 2);
                    robots[0].vehicle.applyEngineForce(up ? 0 : -maxForce, 3);
                    break;

                case 66: // b
                    robots[0].stop();
                    break;

                case 39: // right
                    robots[0].vehicle.applyEngineForce(up ? 0 : rotationForce, 1);
                    robots[0].vehicle.applyEngineForce(up ? 0 : rotationForce, 3);
                    robots[0].vehicle.applyEngineForce(up ? 0 : -rotationForce, 0);
                    robots[0].vehicle.applyEngineForce(up ? 0 : -rotationForce, 2);
                    break;

                case 37: // left
                    robots[0].vehicle.applyEngineForce(up ? 0 : -rotationForce, 1);
                    robots[0].vehicle.applyEngineForce(up ? 0 : -rotationForce, 3);
                    robots[0].vehicle.applyEngineForce(up ? 0 : rotationForce, 0);
                    robots[0].vehicle.applyEngineForce(up ? 0 : rotationForce, 2);
                    break;
                case 45: // insert
                    console.log(pathfinder);
                    break;
            }
}


// -------------------------------------------------------------------------------------------------
//                              ALL FUNCTIONS FOR SOLVING THE PUZZLE
// -------------------------------------------------------------------------------------------------

/**
 * @method startSolving
 */
Simulator.prototype.startSolving = function(){
        let prevReading = robots[0].getProximitySensorReading();
        Simulator.prototype.driveForward();

        //start checking for obstacles/ends of streets
        var loop = setInterval(() => {
            var currentReading = robots[0].getProximitySensorReading();

            if(isChange(prevReading,currentReading)){
                setTimeout(function() {
                    Simulator.prototype.driveStop(pathfinder.getBreakingDelay());
                    pathfinder.makeDecision(robots[0].getProximitySensorReading());
                 }, pathfinder.getBreakingDelay());
                 
                clearInterval(loop);
            }
            prevReading = currentReading;
        }, 50);
}

function isChange(prevReading,currentReading){
    return rtdp(prevReading.left,1) !== rtdp(currentReading.left,1) ||
    rtdp(prevReading.right,1) !== rtdp(currentReading.right,1) ||
    rtdp(prevReading.front,1) !== rtdp(currentReading.front,1);
}

// Round to decimal place
function rtdp(num, decimalPlaces) {
    const factor = Math.pow(10, decimalPlaces);
    return Math.round(num * factor) / factor;
}

/**
 * @method driveForward
 */
Simulator.prototype.driveForward = function() {
    robots[0].vehicle.applyEngineForce(2, 2);
    robots[0].vehicle.applyEngineForce(2, 3);
}

/**
 * @method driveStop
 * @param {Int} timeout
 */
Simulator.prototype.driveStop = function() {
        robots[0].vehicle.applyEngineForce(0, 0);
        robots[0].vehicle.applyEngineForce(0, 1);
        robots[0].vehicle.applyEngineForce(0, 2);
        robots[0].vehicle.applyEngineForce(0, 3);
}

/**
 * @method driveTurnLeft
 * @param {Int} degrees
 */
Simulator.prototype.driveTurnLeft = function(degrees){
    robots[0].vehicle.applyEngineForce(-5, 1);
    robots[0].vehicle.applyEngineForce(-5, 3);
    robots[0].vehicle.applyEngineForce(5, 0);
    robots[0].vehicle.applyEngineForce(5, 2);
    setTimeout(function (){
        Simulator.prototype.driveStop(0);
    }, 17.3 * degrees); // 17.3 is how many ms it takes to turn 1 degree.
}

/**
 * @method driveReverse
 */
Simulator.prototype.driveReverse = function() {
    robots[0].vehicle.applyEngineForce(-2, 0);
    robots[0].vehicle.applyEngineForce(-2, 1);
    robots[0].vehicle.applyEngineForce(-2, 2);
    robots[0].vehicle.applyEngineForce(-2, 3);
}



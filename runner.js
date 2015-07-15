#!/usr/bin/node

var sight = 2;
var maxSteps = 10;

run(sight, maxSteps);

function run (sight, maxSteps) {
    var location = {x: 0, y: 0}

    var steps = 0;
    var angle = 90;  // Starts by going upwards.

    var mysense = sense(sight);
    var travelHistory = [];
    mysense.obstructions.push({x: 0, y: 5});    // Setting obstacle
    mysense.obstructions.push({x: 1, y: 5});    // Setting obstacle
    mysense.obstructions.push({x: 2, y: 5});    // Setting obstacle
    mysense.obstructions.push({x: -1, y: 5});    // Setting obstacle

    var obstructed = undefined;
    while(steps < maxSteps && !obstructed) {
        declarePosition(location.x, location.y);
        var obstructionFound = mysense.findObstruction(location.x, location.y);
        if(obstructionFound == false) {
            console.log("Whoohoo! No obstruction found. Moving on!");
            travelHistory.push(location);
            location = move(angle, location.x, location.y); // Prefer positive vertical movement
        } else {
            console.log("Obstruction found. Stopping now.");
            console.log(obstructionFound);
            obstructed = obstructionFound;
            break;
        }
        steps++;
    }

    console.log("Travelled " + travelHistory.length + " steps.");
}

function move (angle, currentX, currentY) {
    var x = currentX;
    var y = currentY;
    var a = angle;

    var targetX = x + (1 * Math.cos(a));
    targetX = Math.ceil(targetX);
    var targetY = y + (1 * Math.sin(a));
    targetY = Math.ceil(targetY);

    return {x: targetX, y: targetY};
}

function declarePosition (x, y) {
    console.log("I'm at " + x + ", " + y);
}

function sense (radius) {
    var sense = {};
    sense.radius = radius;
    sense.obstructions = [];
    sense.recentObstructions = [];  // TODO: Cache recently encountered obstructions here.
    sense.findObstruction = function (currentX, currentY) {
        // TODO: Start from 0 and pulsate outward, sweeping for obstruction in every pixel until the size of radius.
        var x = currentX;
        var y = currentY;
        var affectingObstructions = [];

        for(var i = 0; i < sense.obstructions.length; i++) {
            // TODO: Rather than going through every obstruction in the world, check based on current angle and current target pixel for greater efficiency.
            var obstruction = sense.obstructions[i];
            var targetLocation = {x: x, y: y};

            for(var a = 0; a < 360; a++) {  // Sweeping for obstructions in 360 angle.
                var targetX = x + (sense.radius * Math.cos(a));
                targetX = Math.floor(targetX);
                var targetY = y + (sense.radius * Math.sin(a));
                targetY = Math.floor(targetY);

                // var cTargetLocation = {x: targetX, y: targetY};
                // if(cTargetLocation.x != targetLocation.x || cTargetLocation.y != targetLocation.y) {
                //     console.log(cTargetLocation);
                // }
                // targetLocation = cTargetLocation;

                // if(a < 10) {
                //     console.log("angle: " + a + " targets: ");
                //     console.log({x: targetX, y: targetY});
                // }

                if((obstruction.x == targetX && obstruction.y == targetY)) {
                    if(affectingObstructions.length > 0) {
                        var lastAddedObstruction = affectingObstructions[affectingObstructions.length - 1].obstruction;
                        if(lastAddedObstruction.x != obstruction.x || lastAddedObstruction.y != obstruction.y) {
                            affectingObstructions.push({ obstruction: obstruction, angle: a });
                        }
                    } else {
                        affectingObstructions.push({ obstruction: obstruction, angle: a });
                    }
                }
            }
        }

        return (affectingObstructions.length == 0) ? false : affectingObstructions;
    }

    return sense;
}

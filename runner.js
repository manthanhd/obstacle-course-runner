#!/usr/bin/node

var sight = 1;
var maxSteps = 10;

run(sight, maxSteps);

function run (sight, maxSteps) {
    var location = {x: 0, y: 0}

    var steps = 0;
    var angle = 90;  // Starts by going upwards.

    var mysense = sense(sight);
    var travelHistory = [];
    mysense.obstructions.push({x: 0, y: 5});    // Setting obstacle

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
        var x = currentX;
        var y = currentY;

        for(var i = 0; i < sense.obstructions.length; i++) {
            var obstruction = sense.obstructions[i];
            for(var a = 0; a < 360; a++) {
                var targetX = x + (sense.radius * Math.cos(a));
                targetX = Math.ceil(targetX);
                var targetY = y + (sense.radius * Math.sin(a));
                targetY = Math.ceil(targetY);
                // if(a < 10) {
                //     console.log("angle: " + a + " targets: ");
                //     console.log({x: targetX, y: targetY});
                // }

                if((obstruction.x == targetX && obstruction.y == targetY) || (obstruction.x == x && obstruction.y == y)) {
                    return { obstruction: obstruction, angle: a };
                }
                // TODO: Add direction parameter to the obstruction. If you're going +y and if obstruction is in +x then don't worry about it unless there's an obstruction right ahead.
            }
        }

        return false;
    }

    return sense;
}

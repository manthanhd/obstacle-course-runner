#!/usr/bin/node

var sight = 1;
var maxSteps = 10;

run(sight, maxSteps);

function run (sight, maxSteps) {
    var startX = 0;
    var startY = 0;
    var x = startX;
    var y = startY;
    var steps = 0;
    var mysense = sense(sight);
    mysense.obstructions.push({x: 0, y: 5});

    while(steps < maxSteps) {
        var obstructed = undefined;
        while(steps < maxSteps && !obstructed) {
            declarePosition(x, y);
            var obstructionFound = mysense.findObstruction(x, y);
            if(obstructionFound == false) {
                console.log("Whoohoo! No obstruction found. Moving on!");
                y++;
            } else {
                console.log("Obstruction found. Stopping now.");
                console.log(obstructionFound);
                return;
            }
            steps++;
        }
    }
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

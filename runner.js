#!/usr/bin/node

var sight = 2;
var maxSteps = 5;

run(sight, maxSteps);

function run (sight, maxSteps) {
    var location = {x: 0, y: 0}

    var steps = 0;
    var angle = 0;  // Starts by going upwards.

    var mysense = sense(sight);
    var travelHistory = [];
    mysense.obstructions.push({x: 5, y: 0});    // Setting obstacle
    mysense.obstructions.push({x: 4, y: 1});    // Setting obstacle
    mysense.obstructions.push({x: 3, y: 1});    // Setting obstacle
    mysense.obstructions.push({x: -1, y: 5});    // Setting obstacle

    var obstructed = undefined;
    while(steps < maxSteps) {
        declarePosition(location.x, location.y);
        var obstructionFound = mysense.findObstruction(angle, location.x, location.y);
        if(obstructionFound == false) {
            console.log("Whoohoo! No obstruction found. Moving on!");
            travelHistory.push(location);
            location = move(angle, location.x, location.y); // Prefer positive vertical movement
        } else {
            console.log("Obstruction found. Will try to go around it.");
            console.log(obstructionFound);

            angle++;    // prefers clockwise rotation to avoid obstructions.

            console.log("Rotating to angle: " + angle);
            continue;
        }

        steps++;
    }

    console.log("Travelled " + travelHistory.length + " steps.");
}

function move (angle, currentX, currentY) {
    var x = currentX;
    var y = currentY;
    var a = angle * (Math.PI / 180);

    var targetX = x + (1 * Math.cos(a));
    targetX = Math.round(targetX);
    var targetY = y + (1 * Math.sin(a));
    targetY = Math.round(targetY);

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
    sense.findObstruction = function (angle, currentX, currentY) {
        // TODO: Start from 0 and pulsate outward, sweeping for obstruction in every pixel until the size of radius.
        var x = currentX;
        var y = currentY;
        var a = angle * (Math.PI / 180);
        var affectingObstructions = [];

        for(var i = 0; i < sense.obstructions.length; i++) {
            // TODO: Rather than going through every obstruction in the world, check based on current angle and current target pixel for greater efficiency.
            var obstruction = sense.obstructions[i];

            if(obstruction.x == x && obstruction.y == y) {
                return obstruction;
            }

            for(var sight = 1; sight <= sense.radius; sight++) {
                var targetX = x + (sight * Math.cos(a));
                targetX = Math.round(targetX);
                var targetY = y + (sight * Math.sin(a));
                targetY = Math.round(targetY);

                console.log("For sight " + sight + ", looking at angle " + a + " " + targetX + ", " + targetY);

                if(obstruction.x == targetX && obstruction.y == targetY) {
                    return obstruction;
                }
            }
        }
        return false;
    }

    return sense;
}

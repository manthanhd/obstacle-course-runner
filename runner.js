#!/usr/bin/node

var sight = 2;
var maxSteps = 20;

run(sight, maxSteps);

function run (sight, maxSteps) {
    var location = {x: 7, y: 14};

    var steps = 0;
    var angle = 0;  // Starts by going upwards.

    var mysense = sense(sight);
    var mymemory = memory();

    mysense.obstructions.push({x: 9, y: 21});    // Setting obstacle
    mysense.obstructions.push({x: 8, y: 21});    // Setting obstacle
    mysense.obstructions.push({x: 8, y: 22});    // Setting obstacle
    mysense.obstructions.push({x: 7, y: 21});    // Setting obstacle
    mysense.obstructions.push({x: 7, y: 22});    // Setting obstacle
    mysense.obstructions.push({x: 6, y: 21});    // Setting obstacle
    mysense.obstructions.push({x: 6, y: 22});    // Setting obstacle
    mysense.obstructions.push({x: 5, y: 21});    // Setting obstacle
    mysense.obstructions.push({x: 5, y: 20});    // Setting obstacle
    mysense.obstructions.push({x: 5, y: 19});    // Setting obstacle
    mysense.obstructions.push({x: 5, y: 18});    // Setting obstacle
    mysense.obstructions.push({x: 5, y: 17});    // Setting obstacle
    mysense.obstructions.push({x: 5, y: 16});    // Setting obstacle
    mysense.obstructions.push({x: 5, y: 15});    // Setting obstacle
    mysense.obstructions.push({x: 5, y: 14});    // Setting obstacle
    mysense.obstructions.push({x: 5, y: 13});    // Setting obstacle
    mysense.obstructions.push({x: 5, y: 12});    // Setting obstacle
    mysense.obstructions.push({x: 5, y: 11});    // Setting obstacle
    mysense.obstructions.push({x: 5, y: 10});    // Setting obstacle
    mysense.obstructions.push({x: 5, y: 9});    // Setting obstacle
    mysense.obstructions.push({x: 5, y: 8});    // Setting obstacle
    mysense.obstructions.push({x: 6, y: 8});    // Setting obstacle
    mysense.obstructions.push({x: 7, y: 8});    // Setting obstacle
    mysense.obstructions.push({x: 8, y: 8});    // Setting obstacle
    mysense.obstructions.push({x: 9, y: 8});    // Setting obstacle
    mysense.obstructions.push({x: 9, y: 9});    // Setting obstacle
    mysense.obstructions.push({x: 9, y: 10});    // Setting obstacle
    mysense.obstructions.push({x: 9, y: 11});    // Setting obstacle
    mysense.obstructions.push({x: 9, y: 12});    // Setting obstacle
    mysense.obstructions.push({x: 9, y: 13});    // Setting obstacle
    mysense.obstructions.push({x: 9, y: 14});    // Setting obstacle
    mysense.obstructions.push({x: 9, y: 15});    // Setting obstacle
    mysense.obstructions.push({x: 8, y: 15});    // Setting obstacle
    mysense.obstructions.push({x: 7, y: 15});    // Setting obstacle

    var obstructed = undefined;
    var rotation = true;    // true for counter-clockwise and false for clockwise.
    while(steps < maxSteps) {
        if(angle >= 360) {
            angle = 360 - angle;
        }

        // declarePosition(location.x, location.y);
        var obstructionFound = mysense.findObstruction(angle, location.x, location.y);
        if(obstructionFound == false) {
            // console.log("Whoohoo! No obstruction found. Moving on!");
            mymemory.remember(location);

            location = move(angle, location.x, location.y); // Prefer positive vertical movement

            declarePosition(angle, location.x, location.y);
        } else {
            // console.log("Obstruction found. Will try to go around it.");
            // console.log(obstructionFound);

            var a = angle;
            var foundNew = false;
            for(var i = 0; i < 360; i++) {
                if(a >= 360) {
                    a = 360 - a;
                } else if (a <= 0) {
                    a = 360;
                }

                if(rotation == true) {
                    a++;
                } else {
                    a--;
                }

                var l = move(a, location.x, location.y);
                var iRemember = mymemory.doIRemember(l);
                if(iRemember == false && mysense.findObstruction(a, location.x, location.y) == false) {
                    // console.log("New location!");
                    // console.log(l);
                    angle = a;
                    foundNew = true;
                    break;
                }
            }

            if(foundNew == false) {
                rotation = (rotation == true) ? false : true;
            }
            // angle++;    // prefers clockwise rotation to avoid obstructions.
            // angle += 5;

            // console.log("Rotating to angle: " + angle);
            continue;
        }

        steps++;
    }

    console.log("Travelled " + steps + " steps.");
    console.log("Known locations:");
    console.log(mymemory.locations);
}

function memory () {
    var memory = {};
    memory.locations = [];
    memory.remember = function(locationToRemember) {
        var found = false;
        for(var i = 0; i < memory.locations.length; i++) {
            var location = memory.locations[i];
            if(location.x == locationToRemember.x && location.y == locationToRemember.y) {
                found = true;
                return;
            }
        }

        if(found == false) {
            memory.locations.push(locationToRemember);
        }
    };

    memory.doIRemember = function(locationToRetrieve) {
        for(var i = 0; i < memory.locations.length; i++) {
            var location = memory.locations[i];
            if(location.x == locationToRetrieve.x && location.y == locationToRetrieve.y) {
                return true;
            }
        }

        return false;
    };

    return memory;
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

function declarePosition (angle, x, y) {
    console.log("I'm at " + x + ", " + y + " pointing " + angle + " degrees.");
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

                // console.log("For sight " + sight + ", looking at angle " + a + " " + targetX + ", " + targetY);

                if(obstruction.x == targetX && obstruction.y == targetY) {
                    return obstruction;
                }
            }
        }
        return false;
    }

    return sense;
}

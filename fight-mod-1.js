var five = require("johnny-five");
var keypress = require("keypress");
var Player = require('player');

keypress(process.stdin);

var board = new five.Board();
var motor1, motor2;


var config = {
    // 100 .. 400
    power: 400,

    // auto stop after two seconds
    autoStop: 200
};


var moveLeft = function () {
    console.log("CCW, CW");
    motor1.forward(config.power);
    motor2.reverse(config.power);
};
var moveRight = function () {
    console.log("CW, CCW");
    motor1.reverse(config.power);
    motor2.forward(config.power);
};
var moveForward = function () {
    console.log("CW, CW");
    motor1.forward(config.power);
    motor2.forward(config.power);
};
var moveBackward = function () {
    console.log("CCW, CCW");
    motor1.reverse(config.power);
    motor2.reverse(config.power);
};
var stopMotors = function () {
    console.log("0, 0");
    motor1.stop();
    motor2.stop();
};
var setPower = function (power) {
    console.log(`Power ${power}`);
    config.power = power;
};
var zigZagOnly = function (speed, repeat) {
    speed = speed || 200;
    repeat = repeat || 5;
    console.log("Zig Zag");
    for (var i = 0; i < repeat; i += 1) {
        setTimeout(function () {
            moveLeft();
        }, i * speed);
        setTimeout(function () {
            moveRight();
        }, i * speed + speed / 2);
    }
    setTimeout(function () {
        stopMotors();
    }, i * speed);
};
var zigZagMove = function (speed, repeat) {
    speed = speed || 200;
    repeat = repeat || 5;
    console.log("Zig Zag Move");
    for (var i = 0; i < repeat; i += 1) {
        setTimeout(function () {
            moveLeft();
        }, i * speed + speed * 0 / 4);

        setTimeout(function () {
            moveForward();
        }, i * speed + speed * 1 / 4);

        setTimeout(function () {
            moveRight();
        }, i * speed + speed * 2 / 4);

        setTimeout(function () {
            moveForward();
        }, i * speed + speed * 3 / 4);
    }
    setTimeout(function () {
        stopMotors();
    }, i * speed);
};
var shiftLeftRight = function (m1, m2) {
    var step = 150;
    var totalSteps = step * 8;
    var repeat = 3;
    var p = config.power;
    for (var i = 0; i < repeat; i += 1) {
        setTimeout(function () {
            m1.forward(p);
            m2.reverse(p);
        }, i * totalSteps + step * 0);
        setTimeout(function () {
            m1.forward(p);
            m2.forward(p);
        }, i * totalSteps + step * 1);
        setTimeout(function () {
            m1.reverse(p);
            m2.forward(p);
        }, i * totalSteps + step * 3);
        setTimeout(function () {
            m1.reverse(p);
            m2.reverse(p);
        }, i * totalSteps + step * 5);
        setTimeout(function () {
            m1.forward(p);
            m2.reverse(p);
        }, i * totalSteps + step * 7);
    }
    setTimeout(function () {
        stopMotors();
    }, i * totalSteps);
};
var shiftLeft = function () {
    console.log("Shift Left");
    shiftLeftRight(motor1, motor2);
};
var shiftRight = function () {
    console.log("Shift Right");
    shiftLeftRight(motor2, motor1);
};
var stopLaterTimer = null;
var stopLater = function () {
    if (!config.autoStop) {
        return;
    }
    if (stopLaterTimer) {
        clearTimeout(stopLaterTimer);
    }
    stopLaterTimer = setTimeout(function () {
        stopMotors();
    }, config.autoStop);
};


console.log("ZigZag:");
console.log("q, w, e");
console.log("ZigZag FW:");
console.log("z, x");
console.log("Shift Left, Right:");
console.log("a, d");
console.log("Power:");
console.log("1, 2, 3, 4, 5");
console.log("Arrow Move:");
console.log("up, down, left, right");
console.log("Quit:");
console.log("0");

var player = new Player([
    './tracks/kung-fu.mp3',
    './tracks/final-countdown.mp3'
]);
var playTrack = function (track) {
    switch (track) {
        case '1': player.play(); break;
        case '2': player.next(); break;
        case '3': player.stop(); break;
    }
};


board.on("ready", function() {
    console.log("ready");
    zigZagOnly(200, 4);


    motor1 = new five.Motor({
        pins: {
            pwm: 5,       // check these pin numbers on the board
            dir: 6
        },
        invertPWM: true
    });

    motor2 = new five.Motor({
        pins: {
            pwm: 10,      // check these pin numbers on the board
            dir: 11
        },
        invertPWM: true
    });

    process.stdin.resume();
    process.stdin.setEncoding("utf8");
    process.stdin.setRawMode(true);

    process.stdin.on("keypress", function(ch, key) {
        if (!key) {
            return;
        }

        switch(key.name) {
            case 'up':
                moveForward();
                stopLater();
                break;
            case 'down':
                moveBackward();
                stopLater();
                break;
            case 'right':
                moveRight();
                stopLater();
                break;
            case 'left':
                moveLeft();
                stopLater();
                break;
            case 'space':
                stopMotors();
                break;

            // Speed
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9': playTrack(key.name); break;

            // Shake
            case 'q': zigZagOnly(100, 10); break;
            case 'w': zigZagOnly(200, 5); break;
            case 'e': zigZagOnly(300, 4); break;

            // Shake FW
            case 'z': zigZagMove(200, 10); break;
            case 'x': zigZagMove(400, 5); break;

            // Manuover Left, Right
            case 'a': shiftLeft(); break;
            case 'd': shiftRight(); break;

            // Exit
            case '0':
                process.exit();
                break;
        }
  });
});

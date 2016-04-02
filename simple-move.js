var five = require("johnny-five");
var keypress = require("keypress");

keypress(process.stdin);

var board = new five.Board();

board.on("ready", function() {

  console.log("Use Up and Down arrows for ClockWise and CounterClockWise respectively. Space to stop.");

  var motor1 = new five.Motor({
    pins: {
      pwm: 5,       // pins for motor1
      dir: 6
    },
    invertPWM: true
  });

  var motor2 = new five.Motor({
    pins: {
      pwm: 10,      // pins for motor2
      dir: 11
    },
    invertPWM: true
  });

  process.stdin.resume();
  process.stdin.setEncoding("utf8");
  process.stdin.setRawMode(true);

  process.stdin.on("keypress", function(ch, key) {
    var power = 500;

    if (!key) {
      return;
    }

    switch(key.name) {
        case 'up':
            console.log("Up");
            motor1.forward(power);
            motor2.forward(power);
        break;
        case 'down':
            console.log("Down");
            motor1.reverse(power);
            motor2.reverse(power);
        break;
        case 'right':
            console.log("right");
            motor1.reverse(power);
            motor2.forward(power);
        break;
        case 'left':
            console.log("left");
            motor1.forward(power);
            motor2.reverse(power);
        break;
        case 'space' :
            motor1.stop();
            motor2.stop();
        break;
        case 'q':
        case '0':
            process.exit();
        break;
    }
  });
});

const word = process.argv[2];
const TIMEBOX_ADDRESS = "11:75:58:09:F3:85";
var btSerial = new (require("bluetooth-serial-port").BluetoothSerialPort)();
var Divoom = require("node-divoom-timebox-evo");

btSerial.findSerialPortChannel(
  TIMEBOX_ADDRESS,
  function (channel) {
    btSerial.connect(
      TIMEBOX_ADDRESS,
      channel,
      function () {
        console.log("connected");

        // btSerial.on("data", function (buffer) {
        //   console.log(buffer.toString("ascii"));
        // });

        setTimeout(() => {
          send(() => {
            disconnect();
          });
        }, 2000);
      },
      function () {
        console.log("cannot connect");
      }
    );
  },
  function () {
    console.log("found nothing");
  }
);

// function send(callback) {
//   var d = new Divoom.TimeboxEvo().createRequest("text", {
//     text: "Hi friends!",
//   });
//   d.paletteFn = d.PALETTE_BLACK_ON_CMY_RAINBOW; // Baked in color palette, but you can define your own
//   d.animFn = d.ANIM_HORIZONTAL_GRADIANT_BACKGROUND; // Baked in animation, but you can define your own

//   for (i = 0; i < 512; i++) {
//     d.getNextAnimationFrame()
//       .asBinaryBuffer()
//       .forEach((elt) => {
//         btSerial.write(elt, function (err, bytesWritten) {
//           if (err) {
//             console.log(err);
//           } else {
//             console.log(bytesWritten);
//           }
//         });
//       });
//   }

//   setTimeout(() => {
//     callback();
//   }, 5000);
// }

function send(callback) {
  var d = new Divoom.TimeboxEvo().createRequest("text", {
    text: word || "Hello from node!",
  });
  d.paletteFn = d.PALETTE_BLACK_ON_CMY_RAINBOW; // Baked in color palette, but you can define your own
  d.animFn = d.ANIM_HORIZONTAL_GRADIANT_BACKGROUND; // Baked in animation, but you can define your own

  // Bootstrap screen
  // console.log(d.messages.asBinaryBuffer());
  d.messages.asBinaryBuffer().forEach((elt) => {
    btSerial.write(elt, function (err, bytesWritten) {
      if (err) console.log(err);
    });
  });

  // for (i = 0; i < 512; i++) {
  d.getNextAnimationFrame()
    .asBinaryBuffer()
    .forEach((elt) => {
      btSerial.write(elt, function (err, bytesWritten) {
        if (err) {
          console.log(err);
        } else {
          console.log(bytesWritten);
        }
      });
    });
  // }

  setTimeout(() => {
    callback();
  }, 5000);
}

function disconnect() {
  btSerial.close();
  console.log("disconnected");
  process.exit(0);
}

// d.read('animation.gif').then(result => {
//   result.asBinaryBuffer().forEach(elt => {
//     btSerial.write(elt,
//       function(err, bytesWritten) {
//         if (err) console.log(err);
//       }
//     );
//   })
// }).catch(err => {
//   throw err;
// });

var i2c = require('i2c-bus');
var i2c1 = i2c.openSync(1);
var logger = require('./logger.js');

var log_VL6180 = 'VL6180.txt';
var time;
var entry;
   	var status;
	var range_status;
	var range;

var IDENTIFICATION__MODEL_ID = 0x000,
  IDENTIFICATION__MODEL_REV_MAJOR = 0x001,
  IDENTIFICATION__MODEL_REV_MINOR = 0x002,
  IDENTIFICATION__MODULE_REV_MAJOR = 0x003,
  IDENTIFICATION__MODULE_REV_MINOR = 0x004,
  IDENTIFICATION__DATE_HI = 0x006,
  IDENTIFICATION__DATE_LO = 0x007,
  IDENTIFICATION__TIME_1 = 0x008,
  IDENTIFICATION__TIME_2 = 0x009,
  SYSTEM__MODE_GPIO0 = 0x010,
  SYSTEM__MODE_GPIO1 = 0x011,
  SYSTEM__HISTORY_CTRL = 0x012,
  SYSTEM__INTERRUPT_CONFIG_GPIO = 0x014,
  SYSTEM__INTERRUPT_CLEAR = 0x015,
  SYSTEM__FRESH_OUT_OF_RESET = 0x016,
  SYSTEM__GROUPED_PARAMETER_HOLD = 0x017,
  SYSRANGE__START = 0x018,
  SYSRANGE__THRESH_HIGH = 0x019,
  SYSRANGE__THRESH_LOW = 0x01A
  SYSRANGE__INTERMEASUREMENT_PERIOD = 0x01B,
  SYSRANGE__MAX_CONVERGENCE_TIME = 0x01C,
  SYSRANGE__CROSSTALK_COMPENSATION_RATE = 0x01E,
  SYSRANGE__CROSSTALK_VALID_HEIGHT = 0x021,
  SYSRANGE__EARLY_CONVERGENCE_ESTIMATE = 0x022,
  SYSRANGE__PART_TO_PART_RANGE_OFFSET = 0x024,
  SYSRANGE__RANGE_IGNORE_VALID_HEIGHT = 0x025,
  SYSRANGE__RANGE_IGNORE_THRESHOLD = 0x026,
  SYSRANGE__MAX_AMBIENT_LEVEL_MULT = 0x02C,
  SYSRANGE__RANGE_CHECK_ENABLES = 0x02D,
  SYSRANGE__VHV_RECALIBRATE = 0x02E,
  SYSRANGE__VHV_REPEAT_RATE = 0x031,
  SYSALS__START = 0x038,
  SYSALS__THRESH_HIGH = 0x03A,
  SYSALS__THRESH_LOW = 0x03C,
  SYSALS__INTERMEASUREMENT_PERIOD = 0x03E,
  SYSALS__ANALOGUE_GAIN = 0x03F,
  RESULT__RANGE_STATUS = 0x04D,
  RESULT__ALS_STATUS = 0x04E,
  RESULT__INTERRUPT_STATUS_GPIO = 0x04F,
  RESULT__ALS_VAL = 0x050,
  RESULT__HISTORY_BUFFER_1 = 0x052,
  RESULT__HISTORY_BUFFER_2 = 0x053,
  RESULT__HISTORY_BUFFER_3 = 0x054,
  RESULT__HISTORY_BUFFER_4 = 0x055,
  RESULT__HISTORY_BUFFER_5 = 0x056,
  RESULT__HISTORY_BUFFER_6 = 0x057,
  RESULT__HISTORY_BUFFER_7 = 0x058,
  RESULT__HISTORY_BUFFER_8 = 0x059,
  RESULT__HISTORY_BUFFER_9 = 0x060,
  RESULT__RANGE_VAL = 0x062,
  RESULT__RANGE_RAW = 0x064,
  RESULT__RANGE_RETURN_RATE = 0x066,
  RESULT__RANGE_REFERENCE_RATE = 0x068,
  RESULT__RANGE_RETURN_SIGNAL_COUNT = 0x06C,
  RESULT__RANGE_REFERENCE_SIGNAL_COUNT = 0x070,
  RESULT__RANGE_RETURN_AMB_COUNT = 0x074,
  RESULT__RANGE_REFERENCE_AMB_COUNT = 0x078,
  RESULT__RANGE_RETURN_CONV_TIME = 0x07C,
  RESULT__RANGE_REFERNCE_CONV_TIME = 0x080,
  READ__AVERAGING_SAMPLE_PERIOD = 0x10A,
  FIRMWARE__BOOTUP = 02119,
  FIRMWARE__RESULT_SCALER = 0x120,
  I2C_SLAVE__DEVICE_ADDRESS = 0x212,
  INTERLEAVED_MODE__ENABLE = 0x2A3;

function writeReg(reg, data) {
return new Promise(function(resolve, reject) {
  var BUFFER_SIZE = 3;
  var time = Date.now();
  const buffer = new Buffer(BUFFER_SIZE);
  buffer[0] = (reg >> 8) & 0xFF;
  buffer[1] = reg & 0xFF;
  buffer[2] = data & 0xFF;
  logger.writeLog(time, "FN: WRITEREG" + " " + buffer[0] + "/" + buffer[1] + "/" + buffer[2])
    .then(i2c1.i2cWrite(sensor, 3, buffer, function(err, bytesWritten, buffer) {
        if (err) {
            reject(err);
            console.log(err);
        } else {
            time = Date.now();
            logger.writeLog(time, "FN: WRITEREG" + buffer[0])
                .then(resolve(buffer[0]))
                .catch(function(e) {console.log("error in vl6180 writeReg:i2cWrite"); reject(e)});
        }
    }))
    .catch(function(e) {console.log("error in writeReg"); reject(e)});
  });
}

function readReg(reg) {
return new Promise(function(resolve, reject) {
 var BUFFER_SIZE = 2;
  const buffer = new Buffer(BUFFER_SIZE);
  const dataRead = new Buffer(1);
  buffer[0] = (reg >> 8) & 0xFF;
  buffer[1] = reg & 0xFF;
  time = Date.now();
  logger.writeLog(time, "FN: READREG" + " " + buffer[0] + "/" + buffer[1]).catch(function(e) {console.log("error in vl6180 readReg:i2cRead"); reject(e)});;
  i2c1.i2cWrite(sensor, 2, buffer, function(err, bytesWritten, buffer) {
    if (err) {  // wHY ERROR?
      reject(err);
      console.log(err);
    } else {
        console.log(buffer[0]);
            time = Date.now();
            logger.writeLog(time, "FN: READREG" + buffer[0]).catch(function(e) {console.log("error in vl6180 readReg:i2cRead"); reject(e)});
            i2c1.i2cRead(sensor, 1, dataRead, function(err, bytesRead, buffer) {
                  if (err) {
                    reject(err);
//                    console.log(err);
                  } else {
                    return dataRead[0];
                    resolve(dataRead[0]);
                  }
                })

        }
    })
  })
}

function read(vl6180){
return new Promise(function(resolve, reject) {
var reading = 0;
sensor = vl6180;
//setLog(sensor, Date.now())
//checkPower();
//if (init != 0) {
//initial(sensor)
logger.writeLog(Date.now(), "FN: READ")
    .then(init())
    .then(setup())
    .then(startReading())
    .then(takeReading())
//    .then(function(data){ return data } )
    .then(resolve())
    .catch(function(e) { console.log("error in vl6180 read"); reject(e)});
    //setStatus();

//this.reading = takeReading();
//checkStatus();
//console.log(reading);
//clearInterrupts(sensor);
//  rpio.i2cEnd();

//return null;
})
}

function init(){
return new Promise(function(resolve, reject) {
logger.writeLog(Date.now(), "FN: INIT")
    .then(writeReg(0x0207, 0x01))
    .then(writeReg(0x0208, 0x01))
    .then(writeReg(0x0096, 0x00))
    .then(writeReg(0x0097, 0xfd))
    .then(writeReg(0x00e3, 0x00))
    .then(writeReg(0x00e4, 0x04))
    .then(writeReg(0x00e5, 0x02))
    .then(writeReg(0x00e6, 0x01))
    .then(writeReg(0x00e7, 0x03))
    .then(writeReg(0x00f5, 0x02))
    .then(writeReg(0x00d9, 0x05))
    .then(writeReg(0x00db, 0xce))
    .then(writeReg(0x00dc, 0x03))
    .then(writeReg(0x00dd, 0xf8))
    .then(writeReg(0x009f, 0x00))
    .then(writeReg(0x00a3, 0x3c))
    .then(writeReg(0x00b7, 0x00))
    .then(writeReg(0x00bb, 0x3c))
    .then(writeReg(0x00b2, 0x09))
    .then(writeReg(0x00ca, 0x09))
    .then(writeReg(0x0198, 0x01))
    .then(writeReg(0x01b0, 0x17))
    .then(writeReg(0x01ad, 0x00))
    .then(writeReg(0x00ff, 0x05))
    .then(writeReg(0x0100, 0x05))
    .then(writeReg(0x0199, 0x05))
    .then(writeReg(0x01a6, 0x1b))
    .then(writeReg(0x01ac, 0x3e))
    .then(writeReg(0x01a7, 0x1f))
    .then(writeReg(0x0030, 0x00))
    .then(resolve())
    .catch(function(e) { console.log("error in vl6180 init"); reject(e); });
    });
}

function setup(sensor){
return new Promise(function(resolve, reject) {
logger.writeLog(Date.now(), "FN: SETUP")
//  setRegister(sensor, 0x014, (4 << 3)|(4) ); // Set GPIO1 high when sample complete
//  setRegister(sensor, 0x011, 0x10); // Set GPIO1 high when sample complete
    .then(writeReg(0x10A, 0x30)) // Set Avg sample period
    .then(writeReg(0x03F, 0x46)) // Set the ALS gain
    .then(writeReg(0x031, 0xFF)) // Set auto calibration period (Max = 255)/(OFF = 0)
    .then(writeReg(0x040, 0x63)) // Set ALS integration time to 100ms
    .then(writeReg(0x02E, 0x01)) // perform a single temperature calibration
    .then(writeReg(0x01B, 0x09)) // Set default ranging inter-measurement period to 100ms
    .then(writeReg(0x03E, 0x0A)) // Set default ALS inter-measurement period to 100ms
    .then(writeReg(0x014, 0x24)) // Configures interrupt on ‘New Sample Ready threshold event’
    .then(writeReg(0x01C, 0x32))
    .then(writeReg(0x02D, 0x10 | 0x01))
    .then(writeReg(0x120,0x01))
    .then(resolve())
    .catch(function(e) { console.log("error in vl6180 setup"); reject(e) });
//  setRegister16bit(0x022, 0x7B);
//  setRegister16bit(0x040, 0x64);
});
}

var sensor;


function powerUp(sensor){
i2c1.sendByte(sensor, 0x16, function(err){ console.log(err); });
//setRegister(sensor, 0x16, 0x01);
}

function checkPower(){
i2c1.readByte(sensor, 0x16, function(err, byte){ if (err) { console.log(err) } else { console.log(byte) }; });
//return getRegister(sensor, 0x16);
}

// START READING SEQUENCE
function startReading() {
return new Promise(function(resolve, reject) {
    logger.writeLog(Date.now(), "FN: STARTREADING")
    .then(readReg(SYSRANGE__START, 0x01))
//    .then(function(data) { return data })
    .then(resolve())
    .catch(function(e) { console.log("error in vl6180 startReading") });
})
}

function checkRangeStatus() {
	while (range_status != 0x04) {
		status = readReg(0x04f);
		range_status = status & 0x07;
	}
}

function takeReading(){
return new Promise(function(resolve, reject) {
    logger.writeLog(Date.now(), "FN: TAKEREADING")
    .then(readReg(0x04f))
    .then(function(data) { range_status = data & 0x07; })
//    .then(checkRangeStatus())
//    .then(readReg(RESULT__RANGE_VAL))
//    .then(function(data) { console.log("reading: " + data); return data })
    .then(resolve())
	.catch(function(e) { console.log("error in vl6180 takeReading"); reject(e) });
	})
}

function setStatus() {
writeReg(SYSTEM__FRESH_OUT_OF_RESET, 0x0);
}

function checkStatus() {
console.log("checkStatus");
	var status = readReg(SYSTEM__FRESH_OUT_OF_RESET);
//	console.log(status);
//
//	// wait for new measurement ready status
//	while (rangeStatus != 0x04) {
//		status = getRegister(sensor, 0x04f);
//		range_status = status & 0x07;
//	}
}

function clearInterrupts(sensor) {
console.log("clearInterrupts");
	setRegister(sensor, 0x015, 0x07);
}

// CHANGE MEASUREMENT MODE
exports.changeMode = function(sensor, mode) {
console.log("changeMode");
if (mode == 1) {
setRegister(sensor, 0x018, 0x02);
} else {
setRegister(sensor, 0x018, 0x00);
}
}



exports.changeAddress = function(oldAddress, newAddress){
console.log("changeAddress");
  //NOTICE:  IT APPEARS THAT CHANGING THE ADDRESS IS NOT STORED IN NON-VOLATILE MEMORY
  // POWER CYCLING THE DEVICE REVERTS ADDRESS BACK TO 0X29

//  if( old_address == new_address) return old_address;
//  if( new_address > 127) return old_address;
//
//   VL6180x_setRegister(VL6180X_I2C_SLAVE_DEVICE_ADDRESS, new_address);
//
//   return VL6180x_getRegister(VL6180X_I2C_SLAVE_DEVICE_ADDRESS);
}

// WRITES DATA TO THE REGISTERS
function setRegister(reg, data) {
rpio.i2cBegin();
  rpio.i2cWrite(Buffer([(reg >> 8) & 0xff]));
  rpio.i2cWrite(Buffer([reg & 0xff]));
  rpio.i2cWrite(Buffer([reg & data]));
    rpio.i2cEnd();
}

function set16BitRegister(address, data) {
console.log("setRegister16");
var addressBuffer = new Buffer(address);
var addressBufferLow; //add 0xFF to array
var addressBufferHigh;  //add 0xFF to array
var dataBuffer = new Buffer(data);
rpio.i2cWrite(addressBufferLow);
rpio.i2cWrite(addressBufferHigh);
  var temp = (dataBuffer >> 8) & 0xff; // Shift in dataBuffer and add 0xff;
  rpio.i2cWrite(dataBuffer);
}

// READS DATA FROM SELECTED REGISTER
function getRegister(reg) {
console.log("getRegister");
rpio.i2cBegin();
  var addressBuffer = new Buffer(reg);
  var dataBuffer = new Buffer(8);
  rpio.i2cWrite(Buffer([(reg >> 8) & 0xff]));
  rpio.i2cWrite(Buffer([reg & 0xff]));
  var dataBuffer = new Buffer(8);
  rpio.i2cRead(dataBuffer, 8);

    rpio.i2cEnd();
  return dataBuffer;
}

// READS DATA FROM SELECTED REGISTER (16BIT)
function getRegister16(sensor, address) {
console.log("getRegister16");
  var data_low;
  var data_high;
  var data;

  var addressBuffer = new Buffer(address);
//  Wire.write((registerAddr >> 8) & 0xFF); //MSB of register address
//  Wire.write(registerAddr & 0xFF); //LSB of register address
//  Wire.endTransmission(false); //Send address and register address bytes
//
//  Wire.requestFrom( _i2caddress, 2);
//  data_high = Wire.read(); //Read Data from selected register
//  data_low = Wire.read(); //Read Data from selected register
//  data = (data_high << 8)|data_low;

  return data;
}

module.exports.read = read;

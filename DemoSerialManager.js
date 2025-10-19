class SerialManager {
  constructor(port) {
    this.serial = new p5.SerialPort();
    this.serial.on('list', this.printList);
    this.serial.on('connected', this.serverConnected);
    this.serial.on('open',this.portOpen);
    this.serial.on('data', this.gotData);
    this.serial.on('error', this.gotError);
    this.serial.on('close', this.portClose);
    this.serial.openPort(port);

    // this.serial.list();

    this.irValue = 40000;
    this.bpmValue = Math.round(random(65, 85));
    this.tempValue = Math.round(random(25, 39));
    this.isBeatChecked = false;
    this.isActive = false;
    this.isTouched = false;
    this.dataCount = 0;
  }

  reset = () => {
    this.isBeatChecked = false;
    this.isActive = false;
    this.isTouched = false;
    this.dataCount = 0;
  }

  printList = (portList) => {
    for (let i = 0; i < portList.length; i++) {
      print(i + " " + portList[i]);
    }
  }


  startLoading = () => {
    this.serial.write("START\n");
  }

  stopLoading = () => {
    this.serial.write("FINISH\n");
  }


  serverConnected = () => {
    print("Connected to Server");
  }

  portOpen = () => {
    print("Port is open");
  }

  gotData = () => {
    // console.log("data: ");
    let currentString = this.serial.readLine().trim();
    if (currentString.length > 0) {
      let parts = currentString.split(",");
      if (parts.length === 4) {
        this.irValue = 130000;
        this.bpmValue += Math.round(noise(frameCount, this.bpmValue)*1.5);
        // console.log(this.bpmValue);
        this.tempValue += Math.round((0.5 - noise(frameCount, this.tempValue))*2);
        const isChecked = true;
        if(isChecked) this.isBeatChecked = true;
      }
    }

    if(this.dataCount > 200 && this.isTouched) {
      const fakeBpm = map(this.irValue, 110000, 150000, 59, 91);
      // this.bpmValue = fakeBpm;
    }

    if(this.isTouched) this.dataCount++;
  }

  gotError = (theerror) => {
    print('error:');
    print(theerror);
  }

  portClose = () => {
    print("The port was closed");
  }
}
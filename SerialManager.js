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
    this.bpmValue = 0;
    this.tempValue = 20;
    this.isBeatChecked = false;
    this.isFake = false;
  }

  reset = () => {
    this.irValue = 40000;
    this.bpmValue = 0;
    this.tempValue = 20;
    this.isBeatChecked = false;
    this.isFake = false;
  }

  printList = (portList) => {
    for (let i = 0; i < portList.length; i++) {
      print(i + " " + portList[i]);
    }
  }

  serverConnected = () => {
    print("Connected to Server");
  }

  portOpen = () => {
    print("Port is open");
  }

  startLoading = () => {
    this.serial.write("START\n");
  }

  stopLoading = () => {
    this.serial.write("FINISH\n");
  }

  gotData = () => {
    if(this.isFake) this.serial.write("FAKE_MODE\n");
    // console.log("data: ");
    let currentString = this.serial.readLine().trim();
    if (currentString.length > 0) {
      let parts = currentString.split(",");
      if (parts.length === 4) {
        this.irValue = parseInt(parts[0].trim().replace(/[^0-9.]/g, ""));
        this.bpmValue = parseInt(parts[1].trim().replace(/[^0-9.]/g, ""));
        this.tempValue = parseFloat(parts[2].trim().replace(/[^0-9.]/g, ""));
        this.isBeatChecked = boolean(parseInt(parts[3].trim().replace(/[^0-9.]/g, "")));
        // if(isChecked) this.isBeatChecked = true;
      }

      if(parts.length === 1) {
        console.log(parts[0]);
      }
    }

    // in case the reading is not going well
    // use fake value to avoid awkward moment at the exhibition
    if(this.isFake) {
      const fakeBpm = parseInt(map(this.irValue, 110000, 150000, 59, 91));
      this.bpmValue = fakeBpm;
    }
  }

  gotError = (theerror) => {
    print('error:');
    print(theerror);
  }

  portClose = () => {
    print("The port was closed");
  }
}
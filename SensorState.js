class SensorState {
  constructor(side, timeManager) {
    this.side = side;
    this.isStarted = false;
    this.isTouched = false;
    this.isActive = false;
    this.isLost = false;
    this.isFinished = false;
    this.timeManager = timeManager;
  }

  // markers for state changes
  start() {
    if(!this.isStarted) {
      this.isStarted = true;
      showCanvas();
    }
  }

  markTouched(value = true) {
    this.isTouched = !!value;
    if(this.isTouched && this.isLost) {
      this.isLost = false;
      hideMessage(this.side);
    }
  }

  markActive(value = true) {
    this.isActive = !!value;
  }

  markLost(value = true) {
    this.isLost = !!value;
    if (this.isLost) {
      showMessage(this.side, 'Connection lost. Please place your hand again.');
    }
  }

  markFinished(value = true) {
    this.isFinished = !!value;
    if (this.isFinished) this.isActive = false;
  }

  reset() {
    this.isStarted = false;
    this.isTouched = false;
    this.isActive = false;
    this.isLost = false;
    this.isFinished = false;
  }
}
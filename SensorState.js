class SensorState {
  constructor(side, timeManager) {
    this.side = side;
    this.isStarted = false;
    this.isTouched = false;
    this.isActive = false;
    this.isLost = false;
    this.isLoadStart = false;
    this.isFinished = false;
    this.timeManager = timeManager;
  }

  // markers for state changes
  start() {
    if(!this.isStarted) {
      this.isStarted = true;
      showCanvas();
      setTimeout(() => {
        this.isLoadStart = true;
      }, 5000);
    }
  }

  markTouched(value = true) {
    this.isTouched = !!value;
    if(this.isTouched) {
      if(this.isLost) {
        this.isLost = false;
        this.timeManager.mark(`${this.side}-inactive`);
        hideMessage(this.side);
      }

      if(this.side == 'left') {
        toggleToastLoading('right');
      } else {
        toggleToastLoading('left');
      }
    }
  }

  markActive(value = true) {
    this.isActive = !!value;
    this.timeManager.mark(`${this.side}-inactive`);
  }

  markLost(value = true) {
    this.isLost = !!value;
    if (this.isLost) {
      this.timeManager.clear(`${this.side}-inactive`);
      if(this.side === 'left' && rightState.isFinished || this.side === 'right' && leftState.isFinished) {
        showMessage(this.side, 'Connection lost. Please place your hand again.', 'awaiting_extra', 'red');
      } else {
        showMessage(this.side, 'Connection lost. Please place your hand again.', 'awaiting', 'red');
      }
    }
  }

  markFinished(value = true) {
    this.isFinished = !!value;
    if (this.isFinished) this.isActive = false;
  }

  reset() {
    this.isStarted = false;
    this.isLoadStart = false;
    this.isTouched = false;
    this.isActive = false;
    this.isLost = false;
    this.isFinished = false;
  }
}
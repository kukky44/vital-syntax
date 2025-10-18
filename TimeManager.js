class TimeManager {
  constructor() {
    this.events = {};
  }

  mark(name) {
    this.events[name] = millis();
  }

  elapsed(name) {
    if (!this.events[name]) return 0;
    return millis() - this.events[name];
  }

  hasElapsed(name, duration) {
    return this.elapsed(name) > duration;
  }

  clear(name) {
    delete this.events[name];
  }

  reset() {
    this.events = {};
  }
}
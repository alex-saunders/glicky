class EventEmitter {
  constructor() {
    this.eventMap = new Map();
  }

  addEventListener(event, handler) {
    if (this.eventMap.has(event)) {
      this.eventMap.set(event, this.eventMap.get(event).concat([handler]));
    } else {
      this.eventMap.set(event, [handler]);
    }
  }

  dispatchEvent(event, data) {
    if (this.eventMap.has(event)) {
      const handlers = this.eventMap.get(event);
      for (const i in handlers) {
        handlers[i](data);
      }
    }
  }
}

export default EventEmitter;

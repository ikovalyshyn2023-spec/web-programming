export class NoiseMeasurement {
  constructor(value, measuredAt = new Date()) {
    if (!NoiseMeasurement.isValidValue(value)) {
      throw new Error(`Invalid measurement value: ${value}`);
    }
    this.value = value;
    this.measuredAt = measuredAt instanceof Date ? measuredAt : new Date(measuredAt);
  }

  static isValidValue(value) {
    return Number.isFinite(value) && value >= 0 && value <= 200;
  }

  isValid() {
    return NoiseMeasurement.isValidValue(this.value);
  }

  toString() {
    const time = this.measuredAt.toLocaleTimeString("uk-UA", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${this.value} dB @ ${time}`;
  }
}

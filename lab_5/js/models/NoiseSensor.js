import { NoiseMeasurement } from "./NoiseMeasurement.js";

/** Centralized business rule — do not duplicate 55/70 elsewhere */
export const NOISE_LIMITS = Object.freeze({
  normalMax: 55,
  warningMax: 70,
});

export class NoiseSensor {
  constructor(id, district, location, noiseLevel) {
    if (!id || !district || !location) {
      throw new Error("id, district and location are required");
    }
    if (!NoiseSensor.isValidNoiseLevel(noiseLevel)) {
      throw new Error(`Invalid noise level: ${noiseLevel}`);
    }

    this.id = String(id);
    this.district = String(district);
    this.location = String(location);
    this.noiseLevel = noiseLevel;
    this.measurements = [];
  }

  /** @returns {"normal"|"warning"|"critical"} */
  getStatus() {
    if (this.noiseLevel <= NOISE_LIMITS.normalMax) return "normal";
    if (this.noiseLevel <= NOISE_LIMITS.warningMax) return "warning";
    return "critical";
  }

  updateNoiseLevel(value) {
    if (!NoiseSensor.isValidNoiseLevel(value)) {
      throw new Error(`Invalid noise level: ${value}`);
    }
    this.noiseLevel = value;
    return this;
  }

  addMeasurement(measurement) {
    if (!(measurement instanceof NoiseMeasurement)) {
      throw new Error("Expected NoiseMeasurement instance");
    }
    this.measurements.push(measurement);
    this.noiseLevel = measurement.value;
    return this;
  }

  static isValidNoiseLevel(value) {
    return Number.isFinite(value) && value >= 0 && value <= 200;
  }

  static fromObject(data) {
    if (!data || typeof data !== "object") {
      throw new Error("fromObject expects a plain object");
    }
    const { id, district, location, noiseLevel } = data;
    return new NoiseSensor(id, district, location, noiseLevel);
  }
}

/** Optional inheritance demo: mobile sensor with battery */
export class MobileNoiseSensor extends NoiseSensor {
  constructor(id, district, location, noiseLevel, batteryLevel = 100) {
    super(id, district, location, noiseLevel);
    this.batteryLevel = batteryLevel;
  }

  needsCharging() {
    return this.batteryLevel < 20;
  }
}

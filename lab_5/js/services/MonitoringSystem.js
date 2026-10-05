import { NoiseSensor } from "../models/NoiseSensor.js";

export class MonitoringSystem {
  constructor() {
    this.sensors = [];
  }

  addSensor(sensor) {
    if (!(sensor instanceof NoiseSensor)) {
      throw new Error("Only NoiseSensor instances can be added");
    }
    if (this.sensors.some((s) => s.id === sensor.id)) {
      throw new Error(`Sensor ${sensor.id} already exists`);
    }
    this.sensors.push(sensor);
    return this;
  }

  findSensorById(id) {
    return this.sensors.find((s) => s.id === id) ?? null;
  }

  getSensorsByDistrict(district) {
    return this.sensors.filter((s) => s.district === district);
  }

  getCriticalSensors() {
    return this.sensors.filter((s) => s.getStatus() === "critical");
  }

  getAverageNoiseLevel() {
    if (this.sensors.length === 0) return null;
    const sum = this.sensors.reduce((acc, s) => acc + s.noiseLevel, 0);
    return Math.round((sum / this.sensors.length) * 100) / 100;
  }

  getAllSensors() {
    return [...this.sensors];
  }
}

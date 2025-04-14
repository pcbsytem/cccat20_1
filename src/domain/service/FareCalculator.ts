export default interface FareCalculator {
  calculate(distance: number): number;
}

export class NormalFareCalculator implements FareCalculator {
  calculate(distance: number): number {
    return distance * 2.1;
  }
}

export class OvernightFareCalculator implements FareCalculator {
  calculate(distance: number): number {
    return distance * 3.9;
  }
}

export class FareCalculatorFactory {
  static create(date: Date): FareCalculator {
    if (date.getHours() > 22 || date.getHours() < 6) {
      return new OvernightFareCalculator();
    }
    return new NormalFareCalculator();
  }
}


const PORTION_SIZE_GRAMS = 100.0;

class ProductData {
  constructor(name, amount, kcal, protein, fat, carb) {
    this.name = name;
    this.amount = amount ?? 0;
    this.kcal = kcal ?? 0;
    this.protein = protein ?? 0;
    this.fat = fat ?? 0;
    this.carb = carb ?? 0;
  }

  calcKcal() {
    return this.kcal * (this.amount / PORTION_SIZE_GRAMS);
  }

  calcProtein() {
    return this.protein * (this.amount / PORTION_SIZE_GRAMS);
  }

  calcFat() {
    return this.fat * (this.amount / PORTION_SIZE_GRAMS);
  }

  calcCarb() {
    return this.carb * (this.amount / PORTION_SIZE_GRAMS);
  }
}

class SummaryData {
  constructor(kcal, protein, fat, carb) {
    this.kcal = kcal ?? 0;
    this.protein = protein ?? 0;
    this.fat = fat ?? 0;
    this.carb = carb ?? 0;
  }
}


export { ProductData, SummaryData };
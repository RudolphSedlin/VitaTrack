import { MealData } from "./api_types";

export function reduceMealData(item: MealData): number[] {
    let totalFats: number = 0;
    let totalCarbs: number = 0;
    let totalProteins: number = 0;
    let totalVitamins: number = 0;
    let totalMinerals: number = 0;
    let totalOther: number = 0;
    
    for (let subcategory in item.nutrientsPerServing!.fats) {
        totalFats += item.nutrientsPerServing!.fats[subcategory] * item.servings!;
    }

    for (let subcategory in item.nutrientsPerServing!.carbohydrates) {
        totalCarbs += item.nutrientsPerServing!.carbohydrates[subcategory] * item.servings!;
    }

    for (let subcategory in item.nutrientsPerServing!.protein) {
        totalProteins += item.nutrientsPerServing!.protein[subcategory] * item.servings!;
    }

    for (let subcategory in item.nutrientsPerServing!.vitamins) {
        totalVitamins += item.nutrientsPerServing!.vitamins[subcategory] * item.servings!;
    }

    for (let subcategory in item.nutrientsPerServing!.minerals) {
        totalMinerals += item.nutrientsPerServing!.minerals[subcategory] * item.servings!;
    }

    for (let subcategory in item.nutrientsPerServing!.other) {
        totalOther += item.nutrientsPerServing!.other[subcategory] * item.servings!;
    }

    return [totalFats, totalCarbs, totalProteins, totalVitamins, totalMinerals, totalOther];
}

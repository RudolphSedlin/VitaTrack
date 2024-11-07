import { MealData } from "./api_types";

export function reduceMealData(item: MealData): number[] {
    let totalFats: number = 0;
    let totalCarbs: number = 0;
    let totalProteins: number = 0;
    let totalSugars: number = 0;
    let totalOther: number = 0;
    
    for (let subcategory in item.nutrientsPerServing!.fats) {
        totalFats += item.nutrientsPerServing!.fats[subcategory];
    }

    for (let subcategory in item.nutrientsPerServing!.carbohydrates) {
        if (subcategory == "sugars") {
            totalSugars += item.nutrientsPerServing!.carbohydrates[subcategory];
        }
        totalCarbs += item.nutrientsPerServing!.carbohydrates[subcategory];
    }

    for (let subcategory in item.nutrientsPerServing!.protein) {
        totalProteins += item.nutrientsPerServing!.protein[subcategory];
    }

    for (let subcategory in item.nutrientsPerServing!.vitamins) {
        totalOther += item.nutrientsPerServing!.vitamins[subcategory];
    }
    for (let subcategory in item.nutrientsPerServing!.minerals) {
        totalOther += item.nutrientsPerServing!.minerals[subcategory];
    }
    for (let subcategory in item.nutrientsPerServing!.other) {
        totalOther += item.nutrientsPerServing!.other[subcategory];
    }

    return [totalFats, totalCarbs, totalProteins, totalSugars, totalOther];
}
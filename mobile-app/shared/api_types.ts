export type UserData = {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    state: string;

    address?: string;
    gender?: string;
    dateOfBirth?: Date;
    doctorName?: string;
    conditions?: string;
    consentLetter?: string;

    email?: string;
    height?: number;
    weight?: number;

    _id: string;
    meals: string[];
};

export type NutrientData = {
    carbohydrates: {
        sugars: number;
        fiber: number;
        [key: string]: number;
    };
    protein: number;
    fats: number;
    vitamins: {
        [key: string]: number;
    };
    minerals: {
        sodium: number;
        potassium: number;
        calcium: number;
        iron: number;
        [key: string]: number;
    };
    other: {
        [key: string]: number;
    }
};

export type MealData = {
    name: string;

    description?: string;
    servings?: number;
    caloriesPerServing?: number;
    nutrientsPerServing?: NutrientData;
    
    _id: string;
    dateCreated: Date;
};

export type MealsResponse = {
    mealList: MealData[];
}

export type RegisterRequestBody = {
    phoneNumber: string;
    password: string;
    confirmPassword: string;
}

export type LoginRequestBody = {
    phoneNumber: string;
    password: string;
}

export type UserUpdateBody = {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    state?: string;

    address?: string;
    gender?: string;
    dateOfBirth?: Date;
    doctorName?: string;
    conditions?: string;
    consentLetter?: string;

    email?: string;
    height?: number;
    weight?: number;

    meals?: string[];
};

export type NoBody = {};

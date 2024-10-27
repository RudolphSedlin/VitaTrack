export type UserData = {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    sate: string;

    address?: string;
    gendder?: string;
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
    };
    protein: {
        total: number;
    };
    fats: {
        saturated: number;
        monounsaturated: number;
        polyunsaturated: number;
        trans: number;
    };
    vitamins: {
        [key: string]: number;
    };
    minerals: {
        sodium: number;
        potassium: number;
        calcium: number;
        iron: number;
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
    sate?: string;

    address?: string;
    gendder?: string;
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
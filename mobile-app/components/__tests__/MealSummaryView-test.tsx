import { render } from '@testing-library/react-native';
import MealSummaryView from '../MealSummaryView';
import { MealData } from "@/shared/api_types";

const mockMealData: MealData = {
  name: 'Chicken Salad',
  _id: "TEST_DATA",
  dateCreated: new Date('2024-11-06T12:00:00Z'),
  nutrientsPerServing: {
    fats: { saturated: 5, unsaturated: 10 },
    carbohydrates: { sugars: 3, fiber: 2, other: 5 },
    protein: { total: 20 },
    vitamins: { vitaminA: 2 },
    minerals: { calcium: 4 },
    other: { fiber: 8 },
  },
  caloriesPerServing: 350,
  servings: 2,
};

it('renders MealSummaryView correctly', () => {
    const { getByText } = render(<MealSummaryView item={mockMealData} />);

    expect(getByText('Chicken Salad')).toBeTruthy();
    expect(getByText('11/6/2024, 07:00 AM')).toBeTruthy();
});

it('displays the correct nutrient values', () => {
const { getByText } = render(<MealSummaryView item={mockMealData} />);

    expect(getByText('15g')).toBeTruthy();
    expect(getByText('10g')).toBeTruthy();
    expect(getByText('20g')).toBeTruthy();
    expect(getByText('3g')).toBeTruthy();
    expect(getByText('14g')).toBeTruthy();
});
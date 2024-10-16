import os

from tensorflow.keras.models import load_model
import numpy as np
from tensorflow.keras.preprocessing import image


img_height, img_width = 224, 224
# Load the saved model
model = load_model('model_3.keras')

def predict_food(img_path):
    #Load and resize image to the proper dimensions used by the model
    img = image.load_img(img_path, target_size=(img_height, img_width))

    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0) / 255.0  # Normalize

    prediction = model.predict(img_array)
    if prediction[0] < 0.5:
        return "Food"
    else:
        return "Not Food"

if __name__ == "__main__":
    path = 'FoodData/validation/Not Food/'
    Food = 0
    Not_Food = 0
    print(predict_food('building.jfif'))
    # for file in os.listdir(path):
    #     if predict_food(path + file) == "Food":
    #         Food+=1
    #     else: Not_Food+=1
    # print(f'Food: {Food}\nNot Food: {Not_Food}')

import numpy as np
import os
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.preprocessing import image
os.environ["TF_USE_LEGACY_KERAS"] = "1"
import os

# Define parameters
img_height, img_width = 224, 224
batch_size = 32

'''
Set to True if you are using a binary analysis (is thing or is not thing)
Set to False if you are using more than 2
'''
BINARY = False



"""
If you only want to use a single folder, you can specify the variable: validation_split = 0.2
inside of the ImageDataGenerator, then use the exact same directory for validation and training.
0.2 stands for 20% of the data is made into validation data
"""
# Use ImageDataGenerator to read images from directories
train_datagen = ImageDataGenerator(rescale=1./255, validation_split=0.2) # validation_split=0.2
validation_datagen = ImageDataGenerator(rescale=1./255)



TRAINING_DATA_DIRECTORY = 'training'
VALIDATION_DATA_DIRECTORY = 'validation'  #ONLY USE IF validation_split IS NOT DEFINED ABOVE


def train_gen(directory, classMode='binary', subset=True):
    if subset:
        train_generator = train_datagen.flow_from_directory(
            directory,
            target_size=(img_height, img_width),
            batch_size=batch_size,
            class_mode=classMode,
            subset='training'  # Only use this when you specify validation_split in the ImageDataGenerator above
        )
    else:
        train_generator = train_datagen.flow_from_directory(
            directory,
            target_size=(img_height, img_width),
            batch_size=batch_size,
            class_mode=classMode,
        )
    return train_generator

def validation_gen(directory, classMode='binary', subset=True)
    if subset:
        validation_generator = validation_datagen.flow_from_directory(
            directory,
            target_size=(img_height, img_width),
            batch_size=batch_size,
            class_mode=classMode,
            subset='validation'#Only use this when you specify validation_split in the ImageDataGenerator above
        )
    else:
        validation_generator = validation_datagen.flow_from_directory(
            directory,
            target_size=(img_height, img_width),
            batch_size=batch_size,
            class_mode=classMode,
        )
    return validation_generator

def make_model(density, activationType, base_model):
    # Add custom layers on top
    model = Sequential([
        base_model,
        tf.keras.layers.GlobalAveragePooling2D(),
        Dense(128, activation='relu'),
        Dense(density, activation=activationType)  # Binary classification (food or non-food)
    ])
    return model


"""
Actual model creation
"""
# Load MobileNetV2 model without the top layer for custom training
base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=(img_height, img_width, 3))
base_model.trainable = False  # Freeze base model layers

if BINARY:
    train_generator = train_gen(TRAINING_DATA_DIRECTORY, 'binary', True)
    validation_generator = validation_gen(TRAINING_DATA_DIRECTORY, 'binary', False)
    model = make_model(1, 'sigmoid', base_model)
    model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
else:
    train_generator = train_gen(TRAINING_DATA_DIRECTORY, 'categorical', True)
    validation_generator = validation_gen(TRAINING_DATA_DIRECTORY, 'categorical', False)
    model = make_model(3, 'softmax', base_model)
    model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

epochs = 5

#Train the model over __ epochs
history = model.fit(
    train_generator,
    steps_per_epoch=train_generator.samples // batch_size,
    validation_data=validation_generator,
    validation_steps=validation_generator.samples // batch_size,
    epochs=epochs
)

#Calculate accuracy
loss, accuracy = model.evaluate(validation_generator)
print(f"Validation Accuracy: {accuracy * 100:.2f}%")

#Save model for use elsewhere
model.save('model_WithDrinks.h5')



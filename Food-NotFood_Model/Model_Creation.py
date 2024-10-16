import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.preprocessing import image

import os

# Define parameters
img_height, img_width = 224, 224
batch_size = 32


"""
If you only want to use a single folder, you can specify the variable: validation_split = 0.2
inside of the ImageDataGenerator, then use the exact same directory for validation and training.
0.2 stands for 20% of the data is made into validation data
"""
# Use ImageDataGenerator to read images from directories
train_datagen = ImageDataGenerator(rescale=1./255)
validation_datagen = ImageDataGenerator(rescale=1./255)



TRAINING_DATA_DIRECTORY = 'training'
VALIDATION_DATA_DIRECTORY = 'validation'

train_generator = train_datagen.flow_from_directory(
    TRAINING_DATA_DIRECTORY,
    target_size=(img_height, img_width),
    batch_size=batch_size,
    class_mode='binary',
    #subset='training' #Only use this when you specify validation_split in the ImageDataGenerator above
)

validation_generator = validation_datagen.flow_from_directory(
    VALIDATION_DATA_DIRECTORY,
    target_size=(img_height, img_width),
    batch_size=batch_size,
    class_mode='binary',
    #subset='validation'#Only use this when you specify validation_split in the ImageDataGenerator above
)

# Load MobileNetV2 model without the top layer for custom training
base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=(img_height, img_width, 3))
base_model.trainable = False  # Freeze base model layers

# Add custom layers on top
model = Sequential([
    base_model,
    tf.keras.layers.GlobalAveragePooling2D(),
    Dense(128, activation='relu'),
    Dense(1, activation='sigmoid')  # Binary classification (food or non-food)
])

model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

epochs = 10

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
model.save('model_3.keras')


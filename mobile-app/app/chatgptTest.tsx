import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import resizeImage from '../components/TensorCamera';
import {prompt} from './prompt';


const ChatGptTest: React.FC = () => {
    const route = useRoute();
    const { imageData } = route.params || {}; // Get the passed image data
    const [response, setResponse] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    

    //Send image in base 64 to analysis function
    useEffect(() => {
        if (imageData) {
            getNutritionAnalysis(imageData)
        }
    }, [imageData]);
    
    
    const getNutritionAnalysis = async (foodImage: string) => {
        const openaiApiKey = "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";
        setLoading(true);
        try {

            //Send request with prompt to api
            const requestBody = {
                model: "gpt-4o",
                messages: [
                    { role: "system", content: "You are a nutritionist." },
                    { role: "user", content: [
                        {type: "text", text:prompt},
                        {type: "image_url","image_url": {"url": `data:image/jpeg;base64,${foodImage}`
                        }}
                    ]}
                ],
                max_tokens: 100,
                temperature: 0.7
            };
            
            //Retrieve response from gpt
            const res = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${openaiApiKey}`
                },
                body: JSON.stringify(requestBody)
            });
    
            //If api call fails
            if (!res.ok) {
                const errorMessage = await res.text();
                throw new Error(`HTTP error! status: ${res.status}, message: ${errorMessage}`);
            }
    
            const json = await res.json();
            const gptResponse = json.choices?.[0]?.message?.content?.trim() || 'No response.';
            console.log(gptResponse);
            setResponse(gptResponse);
        } catch (error) {
            console.error("Error:", error);
            setResponse(`Failed to get response from ChatGPT: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <View style={{ padding: 20, display: 'flex', alignItems: 'center' }}>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <Text style={{ marginTop: 20, fontSize: 16 }}>Nutrition Info: {response}</Text>
            )}
        </View>
    );
};

export default ChatGptTest;

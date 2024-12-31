// App.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView} 
    from 'react-native';
import { Audio } from 'expo-av';
import { AntDesign } 
    from 'react-native-vector-icons';
import styles from './styles';

export default function App() {
    const [newWord, setNewWord] = useState("");
    const [checkedWord, setCheckedWord] = useState("");
    const [definition, setDefinition] = useState("");
    const [example, setExample] = useState("");
    const [sound, setSound] = useState();
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    const searchWord = (enteredWord) => {
        setNewWord(enteredWord)};

    const getInfo = async () => {
        let url = 
"https://api.dictionaryapi.dev/api/v2/entries/en/" + newWord;

        try {
            const response = await fetch(url);
            const fetchedData = await response.json();

            if (response.status === 200) {
                
                // Successful response
                setData(fetchedData);

                let word = fetchedData[0].word;
                setCheckedWord(word);

                let def = fetchedData[0]
                    .meanings[0].definitions[0].definition;
                setDefinition(def);

                let eg = fetchedData[0]
                    .meanings[0].definitions[0].example;
                setExample(eg);

                setError(null);} 
            else {
                
                setError("Word not found in the database");
                setTimeout(() => {
                    setError(null);}, 3000);}} 
        catch (error) {
            console.error('Error fetching data:', error);
            setError("An error occurred while fetching data");

            setTimeout(() => {setError(null);}, 3000);}};

    const playAudio = async () => {
        if (data && data[0].phonetics && data[0].phonetics[0] 
                && data[0].phonetics[0].audio) {
            if (sound) {
                await sound.unloadAsync()}

            const audioUri = data[0].phonetics[0].audio;

            const { sound, status } = 
                await Audio.Sound.createAsync({ uri: audioUri });

            if (status.isLoaded) {
                setSound(sound);
                await sound.playAsync()}}};

    const clear = async () => {
        setCheckedWord("");
        setDefinition("");
        setExample("");
        setNewWord("");

        if (sound) {
            await sound.unloadAsync()}};

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Dictionary App</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Search..."
                    onChangeText={(text) => searchWord(text)}/>
                <TouchableOpacity style={styles.button} 
                                onPress={() => getInfo()}>
                    <Text style={styles.buttonText}>Search</Text>
                </TouchableOpacity>
            </View>
            {error && (
                <Text style={styles.errorText}>{error}</Text>)}
            {checkedWord && !error && (
                <ScrollView style={styles.resultsContainer}>
                    <Text style={styles.word}>{checkedWord}</Text>
                    <TouchableOpacity style={styles.playButton} 
                                    onPress={() => playAudio()}>
                        <AntDesign name="sound" size={20} color="#ffffff" />
                    </TouchableOpacity>
                    <View style={styles.resultTextContainer}>
                        <Text style={styles.resultText}>
                            Definition: {definition}
                        </Text>
                        <Text style={styles.resultText}>
                            Example: {example}
                        </Text>
                    </View>
                </ScrollView>)}
            <TouchableOpacity style={styles.clearButton} 
                            onPress={() => clear()}>
                <Text style={styles.buttonText}>Clear</Text>
            </TouchableOpacity>
        </View>)}

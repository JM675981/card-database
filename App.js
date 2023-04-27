import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Pressable, Alert, Image, ScrollView } from 'react-native';
import React, { useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

SplashScreen.preventAutoHideAsync();
setTimeout(SplashScreen.hideAsync, 2000);

const titleKey = '@title:key'
const minKey = '@min:key'
const maxKey = '@max:key'
const scaleKey = '@scale:key'
const deckKey = '@deck:key'
const handKey = '@hand:key'
const jokerKey = '@joker:key'
const ruleKey = '@rule:key'
const webKey = '@web:key'
const imageKey = '@image:key'

function CardData({ }) {
  const [title, setTitle] = useState('');
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');
  const [scale, setScale] = useState(false);
  const [deck, setDeck] = useState('');
  const [hand, setHand] = useState('');
  const [joker, setJoker] = useState('');
  const [rule, setRule] = useState('');
  const [web, setWeb] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  onLoad = async () => {
    try {
      const title = await AsyncStorage.getItem(titleKey);
      setTitle(title);
      const min = await AsyncStorage.getItem(minKey);
      setMin(min);
      const max = await AsyncStorage.getItem(maxKey);
      setMax(max);
      const scale = await AsyncStorage.getItem(scaleKey);
      setScale(scale);
      const deck = await AsyncStorage.getItem(deckKey);
      setDeck(deck);
      const hand = await AsyncStorage.getItem(handKey);
      setHand(hand);
      const joker = await AsyncStorage.getItem(jokerKey);
      setJoker(joker);
      const rule = await AsyncStorage.getItem(ruleKey);
      setRule(rule);
      const web = await AsyncStorage.getItem(webKey);
      setWeb(web);
      const selectedImage = await AsyncStorage.getItem(imageKey);
      setSelectedImage(selectedImage);
    } catch (error) {
      Alert.alert('Error', 'One or more items failed to load');
    }
  }

  return (
    <View style={styles.container}>
      <Text>{title}</Text>
      <Text>Players: {min} to {max}{scale == 'false' ? '' : '+'}</Text>
      <Text>Deck Size: {deck} Cards</Text>
      <Text>Hand Size: {hand} Cards </Text>
      <Text>Jokers: {joker > 0 ? joker : 'None'}</Text>
      <Text>Rules: </Text>
      <TextInput value={rule} multiline></TextInput>
      <Text style={styles.link}>{web}</Text>
      <Image source={{ uri: selectedImage }} style={styles.image} />

      <Pressable style={styles.button} onPress={this.onLoad}>
        <Text style={styles.buttonLabel}>Load</Text></Pressable>
    </View>
  )
}

function AddCard({ }) {
  const [title, setTitle] = useState('');
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');
  const [scale, setScale] = useState(false);
  const [deck, setDeck] = useState('');
  const [hand, setHand] = useState('');
  const [joker, setJoker] = useState('');
  const [rule, setRule] = useState('');
  const [web, setWeb] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  onSave = async () => {
    try {
      await AsyncStorage.setItem(titleKey, title);
      await AsyncStorage.setItem(minKey, min);
      await AsyncStorage.setItem(maxKey, max);
      await AsyncStorage.setItem(scaleKey, String(scale));
      await AsyncStorage.setItem(deckKey, deck);
      await AsyncStorage.setItem(handKey, hand);
      await AsyncStorage.setItem(jokerKey, joker);
      await AsyncStorage.setItem(ruleKey, rule);
      await AsyncStorage.setItem(webKey, web);
      await AsyncStorage.setItem(imageKey, selectedImage);
      Alert.alert('Success', 'Items were successfully saved');
    } catch (error) {
      Alert.alert('Error', 'One or more items failed to save');
    }
  }

  selected = () => {
    if (!scale) {
      setScale(true);
    } else {
      setScale(false);
    }
  }

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    } else {
      alert('No image selected.');
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.label}>Title:</Text>
        <TextInput style={styles.input} onChangeText={(val) => setTitle(val)}></TextInput>
      </View>

      <View style={styles.box}>
        <Text style={styles.label}>Min Players:</Text>
        <TextInput style={styles.inputNum} onChangeText={(val) => setMin(val)}></TextInput>
        <Text style={styles.label}>Max Players:</Text>
        <TextInput style={styles.inputNum} onChangeText={(val) => setMax(val)}></TextInput>
      </View>

      <View style={styles.box}>
        <Pressable style={styles.swap} onPress={this.selected}>
          <Text style={styles.label}>{scale ? '' : 'Not'} Scaleable</Text>
        </Pressable>
      </View>

      <View style={styles.box}>
        <Text style={styles.label}>Deck Size:</Text>
        <TextInput style={styles.inputNum} onChangeText={(val) => setDeck(val)}></TextInput>
        <Text style={styles.label}>Hand Size:</Text>
        <TextInput style={styles.inputNum} onChangeText={(val) => setHand(val)}></TextInput>
      </View>

      <View style={styles.box}>
        <Text style={styles.label}>Number of Jokers:</Text>
        <TextInput style={styles.inputNum} onChangeText={(val) => setJoker(val)}></TextInput>
      </View>

      <View style={styles.box}>
        <Text style={styles.label}>Rules:</Text>
        <TextInput style={styles.inputBox} onChangeText={(val) => setRule(val)} multiline></TextInput>
      </View>

      <View style={styles.box}>
        <Text style={styles.label}>Web:</Text>
        <TextInput style={styles.input} onChangeText={(val) => setWeb(val)}></TextInput>
      </View>

      <View style={styles.box}>
        <Pressable style={styles.swap} onPress={pickImageAsync}>
          <Text style={styles.label}>Insert Image</Text>
        </Pressable>
      </View>
      <Image source={{ uri: selectedImage }} style={styles.image} />

      <View style={styles.box}>
        <Pressable style={styles.button} onPress={this.onSave}>
          <Text style={styles.buttonLabel}>Save</Text>
        </Pressable>
      </View>
    </ScrollView >
  )
}

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator useLegacyImplementation>
        <Drawer.Screen name="Card Game Database" component={CardData} options={styles.header} />
        <Drawer.Screen name="Add Card Game" component={AddCard} options={styles.header} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
    paddingLeft: 15,
  },
  header: {
    headerStyle: {
      backgroundColor: '#e7101f',
    },
    headerTintColor: '#fff',
  },
  box: {
    flexDirection: 'row',
    margin: 5,
    pattingTop: 10,
    paddingBottom: 10,
  },
  link: {
    color: '#0000FF',
    textDecorationLine: 'underline',
  },
  swap: {
    backgroundColor: '#b4b4c0',
    marginLeft: 5,
  },
  label: {
    fontSize: 18,
    padding: 8,
  },
  input: {
    backgroundColor: '#ecf0f1',
    width: 300,
    fontSize: 18,
    padding: 5,
  },
  inputNum: {
    backgroundColor: '#ecf0f1',
    width: 40,
    textAlign: 'center',
    fontSize: 18,
  },
  inputBox: {
    backgroundColor: '#ecf0f1',
    width: 300,
    height: 125,
    padding: 5,
    fontSize: 18,
  },
  buttonLabel: {
    fontSize: 18,
    padding: 8,
    color: '#fff',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#131116',
    width: 90,
    borderRadius: 50,
    marginTop: 10,
    marginBottom: 10,
  },
  image: {
    width: 300,
    height: 300,
  },
});

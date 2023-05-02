import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Pressable, Alert, Image, ScrollView, Linking } from 'react-native';
import React, { useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as SQLite from "expo-sqlite";

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

      if (selectedImage == 'default') {
        setSelectedImage(require('./assets/cardIcon.jpg'));
      } else {
        setSelectedImage({ uri: selectedImage });
      }
    } catch (error) {
      Alert.alert('Error', 'One or more items failed to load');
    }
  }

  sendLink = () => {
    try {
      Linking.openURL(web);
    } catch (error) {
      Alert.alert('Error', 'Invalid link used');
    }
  }

  //Source found for Linking: https://stackoverflow.com/questions/30540252/how-does-one-display-a-hyperlink-in-react-native-app
  return (
    <ScrollView style={styles.container}>

      <Text style={styles.cardTitle}>{title}</Text>
      <View style={styles.cardBox}>
        <Image source={selectedImage} style={styles.imageSmall} />
        <View>
          <Text style={styles.cardText}>Players: {min}{max != null && min != max ? ' to ' + max : ''}{scale == 'true' ? '+' : ''}</Text>
          <Text style={styles.cardText}>Deck Size: {deck} Cards</Text>
          <Text style={styles.cardText}>Hand Size: {hand} Cards</Text>
          <Text style={styles.cardText}>Jokers: {joker > 0 ? joker : 'None'}</Text>
        </View>
      </View>
      <Text style={styles.cardText}>Rules: </Text>
      <TextInput value={rule} style={styles.cardText} multiline></TextInput>
      <Text style={styles.link} onPress={this.sendLink}>{web}</Text>

      <Pressable style={styles.button} onPress={this.onLoad}>
        <Text style={styles.buttonLabel}>Load</Text>
      </Pressable>
    </ScrollView>
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
      alert('No image selected. Reverting to default.');
      setSelectedImage('default');
    }
  }

  const validation = () => {
    let dataValid = true;
    let errorMessage = '';

    if (title == '') {
      if (errorMessage != '') {
        errorMessage += '\n'
      }
      errorMessage += 'Title cannot be empty.';
      dataValid = false;
    }

    if (isNaN(parseInt(min))) {
      if (errorMessage != '') {
        errorMessage += '\n'
      }
      errorMessage += 'Min Players must contain a valid integer.';
      dataValid = false;
    }

    if (max != '' && isNaN(parseInt(max))) {
      if (errorMessage != '') {
        errorMessage += '\n'
      }
      errorMessage += 'Max Players must contain a valid integer.';
      dataValid = false;
    }

    if (isNaN(parseInt(deck))) {
      if (errorMessage != '') {
        errorMessage += '\n'
      }
      errorMessage += 'Deck Size must contain a valid integer.';
      dataValid = false;
    }

    if (isNaN(parseInt(hand))) {
      if (errorMessage != '') {
        errorMessage += '\n'
      }
      errorMessage += 'Hand Size must contain a valid integer.';
      dataValid = false;
    }

    if (joker != '' && isNaN(parseInt(joker))) {
      if (errorMessage != '') {
        errorMessage += '\n'
      }
      errorMessage += 'Number of Jokers must contain a valid integer.';
      dataValid = false;
    }

    if (rule == '') {
      if (errorMessage != '') {
        errorMessage += '\n'
      }
      errorMessage += 'Rules cannot be empty.';
      dataValid = false;
    }

    if (selectedImage == null) {
      setSelectedImage('default');
    }

    if (dataValid) {
      this.onSave()
    } else {
      Alert.alert('Input Error', errorMessage)
    }

  }

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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.label}>*Title:</Text>
        <TextInput style={styles.input} onChangeText={(val) => setTitle(val)}></TextInput>
      </View>

      <View style={styles.box}>
        <Text style={styles.label}>*Min Players:</Text>
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
        <Text style={styles.label}>*Deck Size:</Text>
        <TextInput style={styles.inputNum} onChangeText={(val) => setDeck(val)}></TextInput>
        <Text style={styles.label}>*Hand Size:</Text>
        <TextInput style={styles.inputNum} onChangeText={(val) => setHand(val)}></TextInput>
      </View>

      <View style={styles.box}>
        <Text style={styles.label}>Number of Jokers:</Text>
        <TextInput style={styles.inputNum} onChangeText={(val) => setJoker(val)}></TextInput>
      </View>

      <View style={styles.box}>
        <Text style={styles.label}>*Rules:</Text>
        <TextInput style={styles.inputBox} onChangeText={(val) => setRule(val)} multiline></TextInput>
      </View>

      <View style={styles.box}>
        <Text style={styles.label}>*Web:</Text>
        <TextInput style={styles.input} onChangeText={(val) => setWeb(val)} placeholder='https://link.com'></TextInput>
      </View>

      <View style={styles.box}>
        <View>
          <Pressable style={styles.swap} onPress={pickImageAsync}>
            <Text style={styles.label}>Insert Image</Text>
          </Pressable>
        </View>
        <View>
          <Pressable style={styles.submit} onPress={validation}>
            <Text style={styles.buttonLabel}>Save</Text>
          </Pressable>
        </View>
      </View>
      <Image source={{ uri: selectedImage }} style={styles.image} />
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
    marginTop: 50,
    marginBottom: 10,
  },
  submit: {
    backgroundColor: '#131116',
    width: 90,
    borderRadius: 50,
    marginBottom: 10,
    marginLeft: 150,
  },
  image: {
    width: 200,
    height: 200,
    marginLeft: 10,
    marginBottom: 40,
  },
  cardBox: {
    flexDirection: 'row',
    margin: 2,
  },
  imageSmall: {
    width: 150,
    height: 150,
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    paddingLeft: 15,
  },
  cardText: {
    fontSize: 18,
  },
  link: {
    color: '#0000FF',
    textDecorationLine: 'underline',
    fontSize: 18,
  },
});

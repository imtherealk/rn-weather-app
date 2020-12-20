import React from "react";
import axios from "axios";
import { Alert } from "react-native";
import Loading from "./Loading";
import Weather from "./Weather";
import * as Location from "expo-location";

const API_KEY = "2c11bec0d9afd4a7a7847d9e368ed942";

export default class App extends React.Component {
  state = {
    isLoading: true,
  };
  getWeather = async (latitude, longitude) => {
    const {
      data: {
        main: { temp },
        weather,
        name
      },
    } = await axios.get(
      `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&APPID=${API_KEY}&units=metric`
      );
    this.setState({
      isLoading: false,
      city: name,
      temp: temp,
      condition: weather[0].main,
      description: weather[0].description,
    });
  };
  getLocation = async () => {
    try {
      await Location.requestPermissionsAsync();
      const {
        coords: { latitude, longitude },
      } = await Location.getCurrentPositionAsync();

      this.getWeather(latitude, longitude);
    } catch (error) {
      Alert.alert("Can't find you.", "so sad");
    }
  };
  componentDidMount() {
    this.getLocation();
  }
  render() {
    const { isLoading, city, temp, condition, description } = this.state;
    return isLoading ? (
      <Loading />
    ) : (
        <Weather city={city} temp={Math.round(temp)} condition={condition} description={description}/>
    );
  }
}

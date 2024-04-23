import {
  View,
  Text,
  StyleSheet,
  TextInput,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useCallback, useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { FontAwesome5 } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
import { debounce } from "lodash";
import { fetchLocations, fetchWeatherData } from "../hook/useFetch";
import { ActivityIndicator } from "react-native";

const Home = () => {
  const [city, setCity] = useState("");
  const [locations, setLocations] = useState([]);
  const [weather, setWeather] = useState({});
  const [isloading, setIsloading] = useState(false);

  const handleLocation = (loc) => {
    setIsloading(true);
    //console.log(loc);c
    setLocations([]);
    fetchWeatherData({ cityName: loc?.name, days: "7" }).then((data) => {
      setWeather(data);
    });
    setIsloading(false);
  };

  const handleSearch = (value) => {
    fetchLocations({ cityName: value }).then((data) => {
      setLocations(data);
    });
  };

  useEffect(() => {
    fetchMyData();
  }, []);

  const fetchMyData = async () => {
    fetchWeatherData({
      cityName: "Abidjan",
      days: "7",
    }).then((data) => {
      setWeather(data);
      setIsloading(false);
    });
  };

  const handleTextBounce = useCallback(debounce(handleSearch, 1200), []);

  const { current, location } = weather;

  const WeatherIcon = {
    Sunny: "day-sunny",
    Overcast: "cloudy",
    " Moderate rain": "rain",
    "Partly Cloudy": "cloudy",
    "Partly cloudy": "cloudy",
    "Patchy rain possible": "rain",
    "Clear ": "day-sunny",
    "Patchy light rain in area with thunder": "rain",
    "Partly Cloudy ": "cloudy",
    Clear: "night-clear",
    Cloudy: "cloudy",
    "Light rain": "rain",
    "Moderate rain at times": "rain",
    "Heavy rain": "rains",
    "Heavy rain at times": "rains",
    "Moderate or heavy freezing rain": "rain",
    "Moderate or heavy rain shower": "rain",
    "Moderate or heavy rain with thunder": "rains",
    "Thundery outbreaks in nearby": "rains",
    "Patchy rain nearby": "rains",
    other: "rain",
  };

  let roundedTemp = Math.round(current?.temp_c);
  const timeString = location?.localtime.split(" ")[1];
  const onlyTime = timeString?.substr(0, 5);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.main}>
        <View style={styles.searchArea}>
          <TextInput
            onChangeText={handleTextBounce}
            style={styles.input}
            placeholder="Search City"
            placeholderTextColor="gray"
            // onChangeText={onChangeText}
            //value={city}
          />
          <TouchableOpacity style={{ position: "relative", right: 35 }}>
            <Ionicons name="search-outline" size={25} color="white" />
          </TouchableOpacity>
        </View>
        {locations?.length > 0 ? (
          <View style={styles.searchResults}>
            {locations?.map((loc, index) => {
              const isLastItem = index === locations?.length - 1;
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleLocation(loc)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 10,
                    paddingHorizontal: 4,
                    marginBottom: isLastItem ? 0 : 1,
                    borderBottomWidth: isLastItem ? 0 : 0.5,
                    borderBottomColor: "white",
                    gap: 8,
                  }}
                >
                  <Ionicons name="location-sharp" size={20} color="white" />
                  <Text style={{ color: "white", fontSize: 20 }}>
                    {loc?.name}, {loc?.country}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : null}
        {isloading ? (
          <ActivityIndicator />
        ) : (
          <ScrollView>
            <View
              style={{
                flexDirection: "row",
                gap: 5,
                alignItems: "center",
                marginTop: 35,
              }}
            >
              <Ionicons name="location-sharp" size={25} color="white" />
              <Text style={{ color: "white", fontSize: 23, fontWeight: "700" }}>
                {location?.name},{" "}
                <Text style={{ fontWeight: "400", fontSize: 18 }}>
                  {location?.country}
                </Text>
              </Text>
            </View>

            <View
              style={{
                marginTop: 35,
                flexDirection: "row",
                alignItems: "center",
                gap: 70,
                paddingHorizontal: 10,
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 90,
                  fontWeight: "700",
                }}
              >
                {roundedTemp ? roundedTemp : null}°
                <Text style={{ fontWeight: "400", fontSize: 50 }}>C</Text>
              </Text>
              <View
                style={{
                  position: "absolute",
                  right: 10,
                }}
              >
                <Fontisto
                  name={WeatherIcon[current?.condition?.text]}
                  size={80}
                  color="white"
                />
              </View>
            </View>
            <View style={{ marginTop: 5 }}>
              <Text
                style={{
                  color: "white",
                  fontWeight: "400",
                  fontSize: 18,
                  paddingHorizontal: 15,
                }}
              >
                {current?.condition?.text}
              </Text>
              <Text
                style={{
                  marginTop: 40,
                  color: "white",
                  fontSize: 15,
                  maxWidth: "80%",
                  paddingHorizontal: 15,
                }}
              >
                Local time:{" "}
                <Text style={{ fontWeight: "700" }}>{timeString}</Text>
              </Text>
              <Text
                style={{
                  color: "white",
                  fontSize: 15,
                  maxWidth: "80%",
                  marginTop: 7,
                  paddingHorizontal: 15,
                }}
              >
                Feels ike:{" "}
                <Text style={{ fontWeight: "700" }}>
                  {current?.feelslike_c} °C
                </Text>
              </Text>
            </View>
            <View
              style={{
                marginTop: 70,
                flexDirection: "column",
                justifyContent: "flex-start",
                gap: 30,
                paddingHorizontal: 15,
              }}
            >
              <View style={{ flexDirection: "row", gap: 40 }}>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 7 }}
                >
                  <Ionicons name="sunny" size={24} color="white" />
                  <Text style={{ color: "gray", fontWeight: "700" }}>
                    Sunrise{" "}
                    <Text style={{ color: "white", fontWeight: "700" }}>
                      6:00 am
                    </Text>
                  </Text>
                </View>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 7 }}
                >
                  <Ionicons name="moon" size={24} color="white" />
                  <Text style={{ color: "gray", fontWeight: "700" }}>
                    Sunset{" "}
                    <Text style={{ color: "white", fontWeight: "700" }}>
                      6:00 am
                    </Text>
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: "row", gap: 40 }}>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 7 }}
                >
                  <FontAwesome5 name="wind" size={22} color="white" />
                  <Text style={{ color: "gray", fontWeight: "700" }}>
                    Wind{" "}
                    <Text style={{ color: "white", fontWeight: "700" }}>
                      {current?.wind_kph} km/h
                    </Text>
                  </Text>
                </View>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 7 }}
                >
                  <FontAwesome6 name="droplet" size={19} color="white" />
                  <Text style={{ color: "gray", fontWeight: "700" }}>
                    Humidity{" "}
                    <Text style={{ color: "white", fontWeight: "700" }}>
                      {current?.humidity} %
                    </Text>
                  </Text>
                </View>
              </View>
            </View>

            <View>
              <Text
                style={{
                  color: "white",
                  paddingLeft: 15,
                  marginTop: 50,
                  textDecorationLine: "underline",
                  fontWeight: "700",
                  fontSize: 18,
                  marginBottom: 13,
                }}
              >
                Next 7 days
              </Text>
            </View>
            <ScrollView
              horizontal
              contentContainerStyle={{ paddingHorizontal: 15 }}
              showsHorizontalScrollIndicator={false}
              style={{ marginTop: 15 }}
            >
              {weather?.forecast?.forecastday.map((item, index) => {
                let date = new Date(item.date);
                let options = { weekday: "long" };
                let dayName = date.toLocaleDateString("en-US", options);
                dayName = dayName.split(",")[0];

                let displayName = index === 0 ? "Today" : dayName;
                return (
                  <View
                    key={index}
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      // paddingVertical: 30,
                      // paddingHorizontal: 30,
                      borderWidth: 1,
                      borderColor: "#1D1D1D",
                      width: 125,
                      height: 155,
                      borderRadius: 7,
                      backgroundColor: "#131313",
                      marginRight: 13,
                      gap: 11,
                    }}
                  >
                    <View>
                      <Fontisto
                        name={WeatherIcon[item?.day?.condition?.text]}
                        size={20}
                        color="white"
                        style={{ marginRight: 10 }}
                      />
                    </View>
                    <Text style={{ color: "white", fontWeight: "700" }}>
                      {displayName}
                    </Text>
                    <Text style={{ color: "gray" }}>
                      {item?.day?.condition?.text}
                    </Text>
                    <Text style={{ color: "white" }}>
                      {item?.day.avgtemp_c}°C
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
            <View>
              <Text
                style={{
                  color: "white",
                  paddingLeft: 15,
                  marginTop: 50,
                  fontWeight: "700",
                  fontSize: 18,
                  textDecorationLine: "underline",
                }}
              >
                Today
              </Text>
            </View>
            <ScrollView
              contentContainerStyle={{ paddingHorizontal: 15 }}
              showsHorizontalScrollIndicator={false}
              style={{ marginTop: 15 }}
            >
              {weather?.forecast?.forecastday[0].hour.map((item, index) => (
                <View
                  style={{
                    borderBottomWidth: 1,
                    borderColor: "#1D1D1D",
                    flexDirection: "row",

                    paddingHorizontal: 10,
                    alignItems: "center",
                    paddingVertical: 25,
                  }}
                  key={index}
                >
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "700",
                      marginRight: 30,
                    }}
                  >
                    {new Date(item?.time)
                      .toLocaleString("en-US", {
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                      })
                      .replace(/:00\s+/, " ")}
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "flex-start",
                    }}
                  >
                    <View>
                      <Fontisto
                        name={WeatherIcon[item?.condition?.text]}
                        size={20}
                        color="white"
                        style={{ marginRight: 10 }}
                      />
                    </View>

                    <Text style={{ color: "white", maxWidth: 130 }}>
                      {item?.condition.text}
                    </Text>
                  </View>

                  <Text
                    style={{
                      color: "white",
                      fontWeight: "500",
                      fontSize: 33,
                      position: "absolute",
                      right: 0,
                    }}
                  >
                    {Math.trunc(item?.temp_c)}°C
                  </Text>
                </View>
              ))}
            </ScrollView>
          </ScrollView>
        )}

        {/* <Text style={styles.title}>Home</Text> */}
      </View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",

    backgroundColor: "#111010",
  },
  main: {
    width: "95%",
    height: "100%",
  },
  title: {
    fontSize: 44,
    fontWeight: "bold",
    color: "white",
  },
  subtitle: {
    fontSize: 36,
    color: "#38434D",
  },
  input: {
    height: 60,
    borderBottomWidth: 2,
    borderBottomColor: "white",
    padding: 10,
    width: "100%",
    color: "white",
  },
  searchArea: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchResults: {
    paddingVertical: 7,
    position: "absolute",
    width: "100%",
    backgroundColor: "#333333",
    top: 70,
    borderRadius: 5,
    zIndex: 10,
  },
});

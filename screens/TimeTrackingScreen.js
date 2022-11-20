import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  FlatList,
  TextInput,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import React, { useLayoutEffect, useEffect, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import { NavigationContainer, DrawerActions } from "@react-navigation/native";
import { getAllTimeTracking, getRecentClockInAndOut } from "../firebase";
import { selectCompanyID } from "../slices/globalSlice";
import { useSelector } from "react-redux";
import { color } from "react-native-reanimated";

export default function TimeTrackingScreen() {
  const navigation = useNavigation();
  const [recentClockInAndOut, setRecentClockInAndOut] = useState([]);
  const [allTimeTracking, setAllTimeTracking] = useState(null);
  const [clockIn, setClockIn] = useState([]);
  const [clockOut, setClockOut] = useState([]);
  const [minutesConverted, setMinutesConverted] = useState(null);
  const companyID = useSelector(selectCompanyID);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Time Tracking",

      headerLeft: () => (
        <View style={{ marginLeft: 20 }}>
          <TouchableOpacity
            onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
          >
            {/* <Avatar rounded source = {{uri: auth?.currentUser.photoURL}}/> */}
            <FontAwesome name="bars" size={30} color="black" />
          </TouchableOpacity>
        </View>
      ),
      headerRight: () => (
        <View style={{ marginRight: 20 }}>
          <TouchableOpacity
            onPress={() => navigation.navigate("User Options Screen")}
          >
            {/* <Avatar rounded source = {{uri: auth?.currentUser.photoURL}}/> */}
            <Octicons name="person" size={30} color="black" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, []);

  // useEffect(() => {
  //   const findtheDifferenceBetweenTimeStamps = async () => {
  //     var allDifference = [];

  //     clockIn.forEach((item, index) => {
  //       //find the difference between the two timestamps
  //       var clockInSeconds = item.seconds;

  //       console.log(clockOut[index].seconds);

  //       var difference = clockOut[index].seconds - clockInSeconds;
  //       console.log("difference", difference);

  //       allDifference.push(difference);
  //     });

  //     var sum = 0;
  //     allDifference.forEach((item) => {
  //       sum += item;
  //     });

  //     //round the hours to 3 decimal places
  //     // convert sec to hours

  //     const hours = sum / 3600;
  //     console.log("hours", hours);
  //     const hoursRounded = Math.round(1000 * hours) / 1000;
  //     setMinutesConverted(hoursRounded);
  //     console.log(hoursRounded);
  //     allDifference = [];
  //   };

  //   return () => {
  //     try {
  //       findtheDifferenceBetweenTimeStamps();
  //     } catch (error) {
  //       alert(error);
  //     }
  //   };
  // }, [clockIn, clockOut]);

  useEffect(() => {
    getRecentClockInAndOut({
      companyID: companyID,
      setRecentClockInAndOut: setRecentClockInAndOut,
    });

    return () => {
      undefined;
    };
  }, [companyID]);

  useEffect(() => {
    getAllTimeTracking({
      companyID: companyID,
      setClockIn: setClockIn,
      setClockOut: setClockOut,
      setAllTimeTracking: setAllTimeTracking,
    });
    console.log("clockIn", clockIn);

    return () => {
      undefined;
    };
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={[true]}
        style={{ width: "100%", flex: 1 }}
        renderItem={({ item }) => (
          <View style={{ width: "100%", alignItems: "center" }}>
            <Text
              style={{
                marginTop: 10,

                fontSize: 20,
                color: "#7B3AF5",
              }}
            >
              Recent:
            </Text>
            <View
              style={{
                backgroundColor: "#D7D7D7C6",
                borderRadius: "30",
                width: Dimensions.get("screen").width / 1.3,
                margin: 30,
                height: 300,
                alignItems: "center",
              }}
            >
              <FlatList
                data={recentClockInAndOut}
                style={{ width: "100%", overflow: "scroll" }}
                renderItem={({ item }) => {
                  //change timeStamp to time and date
                  var date = new Date();

                  if (item.recentClockIn) {
                    if (item.recentClockIn > item.recentClockOut) {
                      date = item.recentClockIn;
                    } else {
                      date = item.recentClockOut;
                    }

                    const time = date.toDate().toTimeString().slice(0, 5);
                    //convert to 12 hour time
                    const time12 =
                      time.slice(0, 2) > 12
                        ? time.slice(0, 2) - 12
                        : time.slice(0, 2);
                    const time12String = time12.toString();
                    const time12StringWithZero =
                      time12String.length === 1
                        ? "0" + time12String
                        : time12String;
                    const time12WithZeroAndAMorPM =
                      time12StringWithZero + time.slice(2, 5);
                    const time12WithZeroAndAMorPMWithAMorPM =
                      time12WithZeroAndAMorPM +
                      (time.slice(0, 2) > 12 ? " PM" : " AM");

                    const date2 = date.toDate().toDateString();

                    return (
                      <View
                        style={{
                          alignItems: "center",
                          backgroundColor: "#FFFFFF86",
                          marginTop: 10,
                          borderRadius: 15,
                          marginHorizontal: 20,
                          padding: 5,
                        }}
                      >
                        <Text style={{ fontSize: 20, color: "#514F4FB6" }}>
                          {item.email}
                        </Text>
                        <View style={{ flexDirection: "row" }}>
                          <Text style={{ fontSize: 15 }}>{date2} at </Text>
                          <Text
                            style={{
                              fontSize: 15,
                              color:
                                item.recentClockIn > item.recentClockOut
                                  ? "#2769FADC"
                                  : "#F4463DDC",
                            }}
                          >
                            {time12WithZeroAndAMorPM}
                          </Text>
                        </View>
                      </View>
                    );
                  }
                }}
                listKey={(item, index) => 1}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
            <Text style={{ marginTop: 10, fontSize: 20, color: "#7B3AF5" }}>
              Total Hours This Week:
            </Text>
            <View
              style={{
                backgroundColor: "#D7D7D7C6",
                borderRadius: "30",
                margin: 30,
                height: 300,
                alignItems: "center",
                width: Dimensions.get("screen").width / 1.3,
                flex: 1,
              }}
            >
              <FlatList
                data={allTimeTracking}
                style={{ width: "100%", overflow: "scroll" }}
                renderItem={({ item }) => {
                  return (
                    <View
                      style={{
                        alignItems: "center",
                        backgroundColor: "#FFFFFF86",
                        marginTop: 10,
                        borderRadius: 15,
                        marginHorizontal: 20,
                        padding: 5,
                      }}
                    >
                      <Text>{item.user}</Text>
                      <Text>{item.totalHours}</Text>
                    </View>
                  );
                }}
                listKey={(item, index) => 1}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
            <Text style={{ marginTop: 10, fontSize: 20, color: "#7B3AF5" }}>
              Pay Employees:
            </Text>
            <View
              style={{
                margin: 30,
                height: 500,
                alignItems: "center",
                width: Dimensions.get("screen").width / 1.3,
              }}
            >
              <FlatList
                data={[true]}
                style={{ width: "100%", flex: 1 }}
                renderItem={({ item }) => {
                  return (
                    <View style={{ width: "100%", alignItems: "center" }}>
                      <Text>{item.fullName}</Text>
                    </View>
                  );
                }}
                listKey={(item, index) => 1}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          </View>
        )}
      />
    </View>
  );
}

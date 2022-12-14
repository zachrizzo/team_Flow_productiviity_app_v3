import { StatusBar } from "expo-status-bar";
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
import React from "react";
import { useLayoutEffect, useState, useEffect, useRef } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { EvilIcons } from "@expo/vector-icons";
import {
  collectionGroup,
  deleteDoc,
  documentId,
  DocumentSnapshot,
  getDoc,
  getDocs,
  increment,
  limit,
  onSnapshot,
  orderBy,
  query,
  QuerySnapshot,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { collection, addDoc, setDoc, doc } from "firebase/firestore";
import {
  db,
  auth,
  addNewTask,
  getCompany,
  getTasks,
  getActive,
  checkadminUsers,
  getCompanyID,
} from "../firebase";

import { NavigationContainer, DrawerActions } from "@react-navigation/native";
import LineBorder from "../components/LineBorder";
import MainButton from "../components/MainButton";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCompany,
  setCompany,
  setTime1,
  selectTime1,
  setDate,
  selectDate,
  setLat,
  setLong,
  setWorkLat,
  setWorkLong,
  setLocation,
  setDistance,
  selectCompanyAddress,
  selectLat,
  selectLong,
  selectWorkLat,
  selectWorkLong,
  setCompanyAddress,
  setTaskID,
  setAdminUsers,
  setClockinButtonState,
  selectClockinButtonState,
  selectUserSubscriptionStatus,
  setUserSubscriptionStatus,
  setCompanySubscriptionStatus,
  selectCompanySubscriptionStatus,
  selectCompanyID,
  setTrial,
} from "../slices/globalSlice";

import IconButton from "../components/IconButton";
import InputBox from "../components/InputBox";
import TeamSearch from "../components/TeamSearch";
import OutlineButtonWithIcon from "../components/OutlineButtonWithIcon";
import AddATeam from "../components/AddATeam";

const HomeScreen = () => {
  const [todoHight, setTodoHeight] = useState();
  const navigation = useNavigation();
  const [tasks, setTasks] = useState(null);
  const [loading, setLoading] = useState(true);
  const windowWidth = Dimensions.get("window").width;
  const [companyBD, setCompanyDB] = useState(null);
  const [addButton, setAddButton] = useState(false);
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [importance, setImportance] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const [deleteToDo, setDeleteToDo] = useState(false);
  var currentDate = new Date();
  const companyID = useSelector(selectCompanyID);

  const [todaysHours, setTodaysHours] = useState(null);

  const month = currentDate.getMonth() + 1;
  const day = currentDate.getDate();
  const hours = currentDate.getHours();
  const min = currentDate.getMinutes();
  const year = currentDate.getFullYear();
  const monthsDays = day.toString();
  const hoursToString = hours.toString();
  const dispatch = useDispatch();
  const company = useSelector(selectCompany);
  const time = useSelector(selectTime1);
  const fulldate = useSelector(selectDate);
  const companyAddress = useSelector(selectCompanyAddress);
  const lat = useSelector(selectLat);
  const long = useSelector(selectLong);
  const workLocationLat = useSelector(selectWorkLat);
  const workLocationLong = useSelector(selectWorkLong);
  const [todaysMin, setTodaysMin] = useState(null);
  const clockinButtonState = useSelector(selectClockinButtonState);
  const [isActive, setIsActive] = useState(null);
  const [trialActive, setTrialActive] = useState(null);
  const userSubscriptionStatus = useSelector(selectUserSubscriptionStatus);
  const dateInMM = Date.now();
  const isMounted = useRef(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamSearch, setTeamSearch] = useState(null);
  const [showTeamSearch, setShowTeamSearch] = useState(false);
  const [showAddATeam, setShowAddATeam] = useState(null);
  const [teamID, setTeamID] = useState(null);
  const companySubscriptionStatus = useSelector(
    selectCompanySubscriptionStatus
  );
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Home",

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

  //create a function to select the team
  const selectTeam = (team) => {
    setTeam(team);
  };
  useEffect(() => {
    if (company) {
      getCompanyID({
        companyId: companyID,
        dispatch: dispatch,
      });
      return () => {
        undefined;
      };
    }
  }, [company, companyID]);

  useEffect(() => {
    getActive({ setIsActive: setIsActive });
    return () => {
      undefined;
    };
  }, [company, companyID]);

  useEffect(() => {
    return () => {
      getCompany({ setCompanyDB: setCompanyDB, dispatchCompany: dispatch });
    };
  });
  // const getstatus = () => {};
  // if (company != null) {
  //   onSnapshot(doc(db, "companys", company), (doc) => {
  //     const time = doc.get("dateOfSignUpInMM");
  //     const trialMath = Math.floor(dateInMM - time) / 1000 / 60 / 60;

  //     if (trialMath < 336) {
  //       setTrialActive(true);
  //       dispatch(setTrial(trialMath));
  //       dispatch(setCompanySubscriptionStatus(true));
  //     } else {
  //       setTrialActive(false);
  //       if (isActive == "active") {
  //         dispatch(setCompanySubscriptionStatus(true));
  //       } else {
  //         dispatch(setCompanySubscriptionStatus(false));
  //         //change Later=>
  //         navigation.navigate("User Options Screen");
  //       }
  //     }
  //   });
  // }
  // useEffect(() => {
  //   // console.log("test2");
  //   isMounted.current = false;
  //   getstatus();

  //   return () => {
  //     isMounted.current = false;
  //   };
  // }, [isActive, company]);

  useEffect(() => {
    if (companyID !== null) {
      getTasks({
        setTasks: setTasks,
        companyID: companyID,
        teamID: teamID,
        team: selectedTeam,
      });
    } else {
      setTasks("null");
    }
    return () => {
      undefined;
    };
  }, [company, refresh, companyID]);

  if (importance > 10) {
    Alert.alert(
      "Invalid Importance",
      "Task importance can only be a number 1-10",
      [{ text: "Sounds Good", onPress: () => setImportance(10) }]
    );
  }

  useEffect(() => {
    // const theTime = () => {
    if (hours > 12) {
      const todayHoursOverTwelve = hours - 12;
      const todayHoursOverTwelveString = todayHoursOverTwelve.toString();
      // console.log("OVER 12 " + todayHoursOverTwelveString);
      setTodaysHours(todayHoursOverTwelveString);
      setTodaysHours(todayHoursOverTwelveString);
    } else {
      if (hoursToString == 0) {
        setTodaysHours("12");
      } else {
        setTodaysHours(hoursToString), console.log("hhhhhh", todaysHours);
      }
    }
    if (min < 10) {
      setTodaysMin(0 + "" + min);
    } else {
      setTodaysMin(min);
    }
    return () => {
      undefined;
    };
  }, []);

  const randomNumberTaskId = Math.random() * 1000000 + 1;
  const randomnumberString = randomNumberTaskId.toString();

  useEffect(() => {
    if (company !== null) {
      try {
        checkadminUsers({
          company: company,
          companyID: companyID,
          dispatchAdminUsers: dispatch,
          setAdminUsers: setAdminUsers,
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      return undefined;
    }
  }, [company, companyID, refresh]);
  const addtodo = () => {
    if (addButton == true) {
      return (
        <View
          style={{
            backgroundColor: "#DBDADADF",
            paddingVertical: 10,
            width: Dimensions.get("screen").width / 1.3,
            borderRadius: 20,
            // marginVertical: 30,
            shadowColor: "#000000EF",
            shadowOffset: {
              width: 0,
              height: 8,
            },
            shadowOpacity: 0.44,
            shadowRadius: 10.32,
            alignItems: "center",
            marginTop: 20,
            // flex: 1,
          }}
        >
          <View
            style={{
              flex: 0.1,
              width: "100%",
              paddingHorizontal: 60,
              marginTop: 10,

              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <View
              style={{
                flex: 0.35,
                flexDirection: "row",
              }}
            >
              <OutlineButtonWithIcon
                buttonValue={showAddATeam}
                onPress={() => {
                  setShowAddATeam(!showAddATeam);
                }}
                text={"Add Team"}
                Icon={<AntDesign name="addusergroup" size={24} color="black" />}
              />
            </View>
            <View
              style={{
                flex: 0.35,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginVertical: 10,
              }}
            >
              <Text style={{ fontSize: 15 }}>Current Team: {selectedTeam}</Text>
            </View>
            <View
              style={{
                flex: 0.35,
                justifyContent: "flex-end",
                flexDirection: "row",
              }}
            >
              <OutlineButtonWithIcon
                buttonValue={showTeamSearch}
                onPress={() => {
                  setShowTeamSearch(!showTeamSearch);
                }}
                text={"Select Team"}
                Icon={<Feather name="users" size={24} color="black" />}
              />
            </View>
          </View>
          {showTeamSearch &&
            // hide add a team
            (setShowAddATeam(false),
            (
              <TeamSearch
                teamSearch={teamSearch}
                companyID={companyID}
                setTeamSearch={setTeamSearch}
                setSelectedTeam={setSelectedTeam}
                setSelectedTeamID={setTeamID}
              />
            ))}
          {showAddATeam &&
            // hide team search
            (setShowTeamSearch(false),
            (
              <AddATeam
                companyID={companyID}
                company={company}
                setTeamID={setTeamID}
                setTeamName={setSelectedTeam}
                teamName={selectedTeam}
              />
            ))}

          <InputBox
            placeholder={"Title"}
            value={title}
            onChangeText={(text) => {
              setTitle(text);
            }}
            width={Dimensions.get("screen").width / 1.5}
            color="#7B3AF5"
          />

          <InputBox
            placeholder="Task Description"
            value={description}
            onChangeText={(text) => {
              setDescription(text);
            }}
            color="#7B3AF5"
            width={Dimensions.get("screen").width / 1.5}
          />

          <InputBox
            placeholder={"Importance (Ex:1-10)"}
            onChangeText={(text) => {
              setImportance(text);
            }}
            width={Dimensions.get("screen").width / 1.5}
            value={importance}
            color="#7B3AF5"
          />

          <MainButton
            text={"Add Task"}
            onPress={() => {
              if (
                teamID == null ||
                teamID == undefined ||
                teamID == "" ||
                selectedTeam == null ||
                selectedTeam == undefined ||
                selectedTeam == ""
              ) {
                alert("Please select a team");
              } else {
                if (
                  title == "" ||
                  title == null ||
                  description == "" ||
                  description == null ||
                  importance == "" ||
                  importance == null
                ) {
                  alert("Please fill out all fields");
                } else {
                  addNewTask({
                    description: description,
                    title: title,
                    importance: importance,
                    todaysHours: todaysHours,
                    todaysMin: todaysMin,
                    company: company,
                    companyID: companyID,
                    fulldate: fulldate,
                    randomnumberString: randomnumberString,
                    teamID: teamID,
                    team: selectedTeam,
                  });
                  setDeleteToDo(false);
                  setImportance(null);
                  setTitle(null);
                  setDescription(null);
                }
              }
            }}
            buttonWidth={300}
          />
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, width: "100%" }}
      >
        <FlatList
          data={[true]}
          style={{ flex: 1, width: "100%" }}
          renderItem={({ item }) => {
            return (
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  alignContent: "center",
                }}
              >
                <View style={{ flex: 0.1, flexDirection: "row" }}>
                  <View
                    style={{
                      flex: 0.1,
                      alignContent: "center",
                      justifyContent: "center",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        if (refresh == 0) {
                          setRefresh(1);
                        }
                        if (refresh == 1) {
                          setRefresh(0);
                        }
                      }}
                    >
                      <EvilIcons name="refresh" size={35} color="black" />
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      flex: 0.5,

                      justifyContent: "center",
                    }}
                  >
                    <View>
                      <Text style={styles.toDo}>To-Do</Text>
                    </View>
                    <View
                      style={{ justifyContent: "center", alignItems: "center" }}
                    >
                      <LineBorder
                        width={Dimensions.get("window").width / 2.5}
                        color={"#7B3AF5"}
                      />
                    </View>
                  </View>
                  <View
                    style={{
                      flex: 0.1,

                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        setDeleteToDo(false);
                        if (addButton == false) {
                          setAddButton(true);
                        } else {
                          setAddButton(false);
                        }
                      }}
                    >
                      <AntDesign name="plus" size={24} color="black" />
                    </TouchableOpacity>
                  </View>
                </View>

                <View
                  style={{
                    flex: 1,
                    flexDirection: "column",
                    alignContent: "center",
                  }}
                >
                  <View style={{ flexDirection: "column", flex: 1 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      {addtodo()}
                    </View>

                    <FlatList
                      style={{ flex: 1 }}
                      data={tasks}
                      renderItem={({ item, circleColor }) => {
                        const importanceconst = item.importance;
                        if (importanceconst == 10) {
                          circleColor = "#FF0000";
                        }
                        if (importanceconst == 9) {
                          circleColor = "#FF5E00";
                        }
                        if (importanceconst == 8) {
                          circleColor = "#FF8800";
                        }
                        if (importanceconst == 7) {
                          circleColor = "#FFA600";
                        }
                        if (importanceconst == 6) {
                          circleColor = "#FFC400";
                        }
                        if (importanceconst == 5) {
                          circleColor = "#FFFB00";
                        }
                        if (importanceconst == 4) {
                          circleColor = "#E5FF00";
                        }
                        if (importanceconst == 3) {
                          circleColor = "#C3FF00";
                        }
                        if (importanceconst == 2) {
                          circleColor = "#A6FF00";
                        }
                        if (importanceconst == 1) {
                          circleColor = "#48FF00";
                        }

                        const deletetask = () => {
                          if (deleteToDo == true) {
                            return (
                              <View style={{ marginVertical: 20 }}>
                                <TouchableOpacity
                                  onLongPress={() => {
                                    if (deleteToDo == false) {
                                      setDeleteToDo(true);
                                    } else {
                                      setDeleteToDo(false);
                                    }
                                  }}
                                  onPress={() => {
                                    navigation.navigate("ToDo Screen");
                                    dispatch(setTaskID(item.taskID));
                                  }}
                                >
                                  <View style={styles.taskList}>
                                    <View style={{ flex: 1 }}>
                                      <View
                                        style={{
                                          flex: 1,
                                          alignItems: "center",
                                          // alignContent: "center",
                                          justifyContent: "center",
                                          flexDirection: "row",
                                        }}
                                      >
                                        <View
                                          style={{
                                            flex: 0.3,
                                            justifyContent: "center",
                                            alignContent: "center",
                                          }}
                                        >
                                          <Text
                                            style={{
                                              justifyContent: "center",
                                              marginTop: 5,
                                            }}
                                          >
                                            {item.lastUpdateDate}
                                            {"\n"}
                                            {item.lastUpdateTime}
                                          </Text>
                                        </View>
                                        <View
                                          style={{
                                            flex: 0.3,
                                            // backgroundColor: "blue",
                                            alignItems: "center",
                                          }}
                                        >
                                          <Text
                                            style={[
                                              styles.taskTitle,
                                              windowWidth < 325 &&
                                                styles.taskTitleSmall,
                                            ]}
                                          >
                                            {item.name}
                                          </Text>
                                        </View>

                                        <View
                                          style={{
                                            flex: 0.3,
                                            justifyContent: "center",
                                            marginTop: 12,
                                            alignItems: "flex-end",
                                          }}
                                        >
                                          <IconButton
                                            buttonWidth={50}
                                            color={"#FF0000"}
                                            icon={
                                              <FontAwesome
                                                name="trash-o"
                                                size={24}
                                                color="black"
                                              />
                                            }
                                            onPress={() => {
                                              deletetask({ task: item.taskID });
                                            }}
                                          ></IconButton>
                                          {/* <View
                                    style={{
                                      borderRadius: 80,
                                      backgroundColor: circleColor,
                                      width: 20,
                                      height: 20,
                                    }}
                                  ></View> */}
                                        </View>
                                      </View>
                                    </View>

                                    <Text style={styles.taskDescription}>
                                      {item.description}
                                    </Text>
                                  </View>
                                </TouchableOpacity>
                              </View>
                            );
                          } else {
                            return (
                              <View style={{ marginVertical: 20 }}>
                                <TouchableOpacity
                                  onLongPress={() => {
                                    if (deleteToDo == false) {
                                      setDeleteToDo(true);
                                    } else {
                                      setDeleteToDo(false);
                                    }
                                  }}
                                  onPress={() => {
                                    navigation.navigate("ToDo Screen");
                                    dispatch(setTaskID(item.taskID));
                                  }}
                                >
                                  <View style={styles.taskList}>
                                    <View style={{ flex: 1 }}>
                                      <View
                                        style={{
                                          flex: 1,
                                          alignItems: "center",
                                          // alignContent: "center",
                                          justifyContent: "center",
                                          flexDirection: "row",
                                        }}
                                      >
                                        <View
                                          style={{
                                            flex: 0.3,
                                            justifyContent: "center",
                                            alignContent: "center",
                                          }}
                                        >
                                          <Text
                                            style={{
                                              justifyContent: "center",
                                              marginTop: 5,
                                            }}
                                          >
                                            {item.lastUpdateDate}
                                            {"\n"}
                                            {item.lastUpdateTime}
                                          </Text>
                                        </View>
                                        <View
                                          style={{
                                            flex: 0.3,
                                            // backgroundColor: "blue",
                                            alignItems: "center",
                                          }}
                                        >
                                          <Text
                                            style={[
                                              styles.taskTitle,
                                              windowWidth < 325 &&
                                                styles.taskTitleSmall,
                                            ]}
                                          >
                                            {item.name}
                                          </Text>
                                        </View>

                                        <View
                                          style={{
                                            flex: 0.3,

                                            alignItems: "flex-end",
                                          }}
                                        >
                                          <View
                                            style={{
                                              borderRadius: 80,
                                              backgroundColor: circleColor,
                                              width: 20,
                                              height: 20,
                                              overflow: "hidden",
                                            }}
                                          ></View>
                                        </View>
                                      </View>
                                    </View>

                                    <Text style={styles.taskDescription}>
                                      {item.description}
                                    </Text>
                                  </View>
                                </TouchableOpacity>
                              </View>
                            );
                          }
                        };

                        return <View style={{ flex: 1 }}>{deletetask()}</View>;

                        //export default importanceconst
                      }}
                      key={(item, index) => index}
                      keyExtractor={(item, index) => index}
                      listKey={1}
                      // keyExtractor={(item) => item.id}
                      showsVerticalScrollIndicator={false}
                    ></FlatList>
                  </View>
                </View>
              </View>
            );
          }}
          key={(item, index) => index}
          keyExtractor={(item, index) => index}
          listKey={1}
          showsVerticalScrollIndicator={false}
        ></FlatList>
      </KeyboardAvoidingView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    // flexDirection: "column",
  },

  taskList: {
    // height: 100,
    width: Dimensions.get("screen").width / 1.4,

    backgroundColor: "#F0EFEF",
    borderRadius: 30,
    flex: 1,
    alignSelf: "center",
    marginHorizontal: 15,
    paddingHorizontal: 15,
    shadowColor: "#000000EF",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,

    // elevation: 16,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: "bold",
    margin: 3,
    flexWrap: "wrap",
    textAlign: "center",
  },
  taskTitleSmall: {
    fontSize: 15,
    fontWeight: "bold",
    margin: 3,
    flexWrap: "wrap",
    textAlign: "center",
  },
  taskDescription: {
    fontSize: 15,
    margin: 2,
    marginBottom: 5,
    flexWrap: "wrap",
    textAlign: "center",
  },
  postedTime: {
    marginVertical: 3,
    textAlign: "center",
    paddingTop: 10,
  },
  toDo: {
    textAlign: "center",
    fontSize: 20,
  },
  inputTitle: {
    borderRadius: 50,
    height: 60,
    width: Dimensions.get("window").width / 1.5,
    borderColor: "#7DCEF38A",
    borderWidth: 2,
    marginBottom: 15,
    marginTop: 10,
    padding: 20,
    backgroundColor: "#D8D8D84D",
    marginHorizontal: 300,
  },
});

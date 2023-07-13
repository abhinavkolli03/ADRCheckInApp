//essential React hooks and components
import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';

//bar code scanner import
import { BarCodeScanner } from 'expo-barcode-scanner';

//navigation elements of screen
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

//icons for styling and UI display
import Ionicons from "@expo/vector-icons/Ionicons";

//component for dropdown in selecting purpose of visit
import DropdownComponent from "./components/DropdownComponent";

//checkbox import for checklist
import { CheckBox } from "react-native-elements"


export default function App() {
  //checks whether user granted camera permission or not
  const [hasPermission, setHasPermission] = useState(null);
  //checks whether app is in scanning mode
  //if it is, then a camera module will be opened up and reveal a QR code scanning component
  const [scanned, setScanned] = useState(true);
  //contains all the data retrived from the UUID of the QR code scan
  const [scannedTrack, setScannedTrack] = useState([]);
  //processes the state of event type that user selects for that time
  const [eventType, setEventType] = useState("1: HQ-Volunteer");

  //setting checklist granted roles 
  //true if the user has opted out roles he/she can opt into
  const [btPosGranted, setBtPosGranted] = useState(false)
  const [ccPosGranted, setCcPosGranted] = useState(false)
  const [certPosGranted, setCertPosGranted] = useState(false)
  const [cismPosGranted, setCismPosGranted] = useState(false)
  const [datPosGranted, setDatPosGranted] = useState(false)
  const [drsPosGranted, setDrsPosGranted] = useState(false)
  const [hamPosGranted, setHamPosGranted] = useState(false)

  //setting currently opted in roles and possibly opted in roles
  //only checked false whenever user manually checks off in the checklist
  //otherwise tries to automatically let people opt in for roles opted out of
  const [btPos, setBtPos] = useState(true)
  const [ccPos, setCcPos] = useState(true)
  const [certPos, setCertPos] = useState(true)
  const [cismPos, setCismPos] = useState(true)
  const [datPos, setDatPos] = useState(true)
  const [drsPos, setDrsPos] = useState(true)
  const [hamPos, setHamPos] = useState(true)

  //all currently opted out roles that user can opt into
  const [possibleRoles, setPossibleRoles] = useState("");

  //Tab navigator component created for scan and history navigation
  const Tab = createBottomTabNavigator();

  //useEffect hook for waiting on status of barcode scanning before continuing processing
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  //useEffect hook for updating the entire checklist based on new set of opted out roles
  useEffect(() => {
    updateTotalCheckList();
  }, [possibleRoles])

  //screen for managing QR code scanning
  const ScanScreen = () => {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={styles.container}>
          {/*Envelops screen with QR code scanner camera and a button at the bottom to cancel scan if necessary*/}
          {!scanned && 
            <View style={styles.qrcodecam}>
              <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
              />
              <TouchableOpacity
                style={styles.loginScreenButton}
                onPress={() => setScanned(true)}
                underlayColor='#fff'>
                <Text style={styles.loginText}>Cancel Scan</Text>
              </TouchableOpacity>
            </View>}

          {/*If no scanned badges yet, reports empty screen with text saying that*/}
          {/*Otherwise, user will be prompted a small container box that reports either invalid badge or name, email, and roles if valid badge*/}
          {/*If possibleRoles exists for a valid user, a prompt appears showing a checklist of roles and an option to confirm these options*/}
          {scanned && 
            <View style={{...styles.container}}>
              <Text style={{fontSize: 25, fontWeight: "800", paddingTop: 20}}>Set Up Event</Text>
              <DropdownComponent updateEvent={setEventType} event={eventType}/>
              <Text style={{fontSize: 25, fontWeight: "800", paddingTop: 20}}>Recently Scanned</Text>
              {scannedTrack.length == 0 ? 
                <View style={{width: "100%", display: "flex", alignItems: "center", justifyContent: "center", height: "60%"}}>
                  <Text>No Scanned Badged Yet.</Text>
                </View>:
                <View style={{width: "100%", display: "flex", alignItems: "center", justifyContent: "top", height: "60%", padding: 20}}>
                  <View style={{
                    backgroundColor: "#efefef", borderColor: "black", width: "100%", display: "flex", justifyContent: "center", alignItems: "left",
                    borderRadius: 10, padding: 15
                    }}>   
                    {scannedTrack[0].status && <Text style={{fontSize: 17, paddingBottom: 5}}><Text style={{fontSize: 17, fontWeight: "800"}}>Name: </Text>{scannedTrack[0].name}</Text>}      
                    {scannedTrack[0].status && <Text style={{fontSize: 17, paddingBottom: 5}}><Text style={{fontSize: 17, fontWeight: "800"}}>Email: </Text>{scannedTrack[0].email}</Text>}      
                    {scannedTrack[0].status && <Text style={{fontSize: 17}}><Text style={{fontSize: 17, fontWeight: "800"}}>Roles: </Text>{scannedTrack[0].roles}</Text>}       
                    {!scannedTrack[0].status && <Text style={{fontSize: 17, fontWeight: "800"}}>Invalid Badge</Text>}      
                  </View>
                  {scannedTrack[0].status && possibleRoles && 
                  <View style={{alignItems: 'center'}}>
                    <Text style={{fontSize: 16, marginTop: 25, marginBottom: 10, fontWeight: "800", color: "green"}}>We noticed that you are still eligible for the following roles. Would you like to opt-in?</Text>
                    <RolesList />
                    <TouchableOpacity
                      style={styles.updateRolesButton}
                      underlayColor='#fff' onPress={updateRoles}>
                      <Text style={styles.loginText}>Confirm New Roles</Text>
                    </TouchableOpacity>
                  </View>}
                </View>}
          {/*For rescanning purposes, scan badge button is there immediately*/}
          <TouchableOpacity
            style={styles.loginScreenButton}
            onPress={() => setScanned(false)}
            underlayColor='#fff'>
            <Text style={styles.loginText}>Scan Badge</Text>
          </TouchableOpacity>
        </View>
      }</View>
      </View>
    );
  }

  //checklist displaying the appropriate roles, depending on whether it was opted out
  //checks the posGranted states first on whether the checkbox should even be shown
  const RolesList = () => {
    return (
      <View >
         {btPosGranted && <CheckBox 
          onPress={() => setBtPos(!btPos)}
          title="BT: Basic Training"
          checked={btPos}
        />}
        {ccPosGranted && <CheckBox 
          onPress={() => setCcPos(!ccPos)}
          title="CC: Call Center"
          checked={ccPos}
        />}
        {certPosGranted && <CheckBox 
          onPress={() => setCertPos(!certPos)}
          title="CERT: Community Emergency Response Team"
          checked={certPos}
        />}
        {cismPosGranted && <CheckBox 
          onPress={() => setCismPos(!cismPos)}
          title="CISM: Critical Incident Stress Management"
          checked={cismPos}
        />}
        {datPosGranted && <CheckBox 
          onPress={() => setDatPos(!datPos)}
          title="DAT: Disaster Assessment Team"
          checked={datPos}
        />}
        {drsPosGranted && <CheckBox 
          onPress={() => setDrsPos(!drsPos)}
          title="DRS: Disaster Relief Shepherd"
          checked={drsPos}
        />}
        {hamPosGranted && <CheckBox 
          onPress={() => setHamPos(!hamPos)}
          title="HAM: HAM Radio"
          checked={hamPos}
        />}
      </View>
    );
  }

  //the history screen from the bottom navbar that shows a list of past scanned badges
  //if no scanned badges, it will report saying 'No Scanned Badges Yet.'
  const HistoryScreen = () => {
    return (
      <View style={{ flex: 1, justifyContent: 'top', alignItems: 'center', backgroundColor: "#fff" }}>
        {scannedTrack.length == 0 ? <View style={{width: "100%", display: "flex", alignItems: "center", justifyContent: "center", height: "85%"}}>
        <Text>No Scanned Badges Yet.</Text>
        </View>:
        <View style={{width: "100%", display: "flex", alignItems: "center"}}>
          <Text style={{fontSize: 25, fontWeight: "800", paddingTop: 20}}>Scan History</Text>
        {scannedTrack.map((st, ind) => (
          <View key={ind} style={{...styles.checkInListItem, backgroundColor: st.status ? "#34C759" : "#FF3B30", borderColor: st.status ? "#34C759" : "#FF3B30"}}>
            {st.status ? <Text style={{fontWeight: "600", color: "white"}}>{st.checkedIn ? "Checked In" : "Checked Out"} - {st.name} - {st.eventType}</Text> :
            <Text style={{fontWeight: "800", color: "white"}}>Invalid Badge</Text>}
          </View>
        ))}
        </View>}
      </View>
    );
  }

  //component that helps identify which positions to grant to user when showing checklist
  const updateTotalCheckList = () => {
    //right now, all the role states are hardcoded in, so to add a new role, you must create a 
    //new state and continue the same process as coded below
    setBtPosGranted(false)
    setCcPosGranted(false)
    setCertPosGranted(false)
    setCismPosGranted(false)
    setDatPosGranted(false)
    setDrsPosGranted(false)
    setHamPosGranted(false)
    //checks whether possibleRoles was null or has at least some value
    if(possibleRoles && possibleRoles.length > 0) {
      //the possibleRoles are retrieved in a string of positions separated by commas
      //the retrievedRoles is an array consisted of each position from splitting
      const retrievedRoles = possibleRoles.split(",")
      console.log(retrievedRoles)
      //loops through each role found in retrievedRoles and processes whether the role
      //should be granted or displayed on the checklist
      for(let elem of retrievedRoles) {
          switch(elem) {
            case "BT":
              setBtPosGranted(true)
              break;
            case "CC":
              setCcPosGranted(true)
              break;
            case "CERT":
              setCertPosGranted(true)
              break;
            case "CISM":
              setCismPosGranted(true)
              break;
            case "DAT":
              setDatPosGranted(true)
              break;
            case "DRS":
              setDrsPosGranted(true)
              break;
            case "HAM":
              setHamPosGranted(true)
              break;
          }
      }
    }
  }

  //component to handle bar code scanning and fetching data from the UUID collected
  const handleBarCodeScanned = ({ type, data }) => {
    console.log(data);
    setScanned(true);
    //process a GET request from the portal using the UUID of the QR code scanned
    fetch("https://portal.adrn.org/api/badge-status/uuid/" + data)
    .then(response => response.json())
    .then(jsonData => {      
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          'X-API-Key': 'YWE2ZTBiYjAtZDRiMi0xMWVkLWIyZjEtY2ZkMTBmMzBkZjcwOjgzM2Y4ZjhjZTQ2OTgxYjlkZmY2MjcwYmQyNTMwNWUwOTIxNzllMDNlZTUyNDI4MWE3YjVmYzM0YWJkYTUzNjM0MTQ3MWM4NmQ5YzRhY2RhOTlhYzY2YTlhYjRhOWIwYjhlNjgwMGZhZWI5YTAwYmViYzBlYmIwNWZiN2YyOGU4'
        }
      };
      //uses envoy API connection to push options collected and receive information about a volunteer
      fetch('https://api.envoy.com/v1/entries?page=1&perPage=30', options)
      .then(response_2 => response_2.json())
      .then(jsonData_2 => {
        let count = false;
        console.log(jsonData_2);
        //maps our retrieved json and stores individual elements into the newScanTrack, which is modifying our old scannedTrack state
        jsonData_2.data.map(el => {
          if(count == false && el["email"] == jsonData["email"]) {
            let newScanTrack = [...scannedTrack];
            newScanTrack.splice(0,0,{
              uuid: data,
              type: type,
              status: jsonData["status"] == "valid",
              data: data,
              checkedIn: el["signedOutAt"] == null,
              name: el["fullName"],
              eventType: eventType,
              email: jsonData["status"] == "valid" ? jsonData["email"] : "",
              roles: jsonData["status"] == "valid" ? jsonData["rroptin"] : [],
              possibleRoles: jsonData["status"] == "valid" ? jsonData["rroptout"] : []
            });
            //retrieves all possible roles that user has not opted in for yet
            setPossibleRoles(jsonData["rroptout"])
            //sets new scannedTrack
            setScannedTrack(newScanTrack);
            //since we only want UUID associated with a QR, we immediately set count to true to 
            //stop mapping and prevent multiple ID scans from a QR
            count = true;
            //attempt at POST requets for checkin and checkout process
            if (el["signedOutAt"] == null) {
              const options = {
                method: 'POST',
                headers: {
                  accept: 'application/json',
                  'content-type': 'application/json',
                  'X-API-Key': 'YWE2ZTBiYjAtZDRiMi0xMWVkLWIyZjEtY2ZkMTBmMzBkZjcwOjgzM2Y4ZjhjZTQ2OTgxYjlkZmY2MjcwYmQyNTMwNWUwOTIxNzllMDNlZTUyNDI4MWE3YjVmYzM0YWJkYTUzNjM0MTQ3MWM4NmQ5YzRhY2RhOTlhYzY2YTlhYjRhOWIwYjhlNjgwMGZhZWI5YTAwYmViYzBlYmIwNWZiN2YyOGU4'
                },
                body: JSON.stringify({entry: {signedOutAt: d.toJSON()}})
              };
              //simply fetches envoy API and sends a POST request that user signed out now
              fetch('https://api.envoy.com/v1/entries/' + el.id, options)
                .then(response => response.json())
                .then(response => console.log(response))
                .catch(err => console.error(err));
            } else {
              //handles sign in process by retrieving current date
              var d = new Date();
              const options = {
                method: 'POST',
                headers: {
                  accept: 'application/json',
                  'content-type': 'application/json',
                  'X-API-Key': 'YWE2ZTBiYjAtZDRiMi0xMWVkLWIyZjEtY2ZkMTBmMzBkZjcwOjgzM2Y4ZjhjZTQ2OTgxYjlkZmY2MjcwYmQyNTMwNWUwOTIxNzllMDNlZTUyNDI4MWE3YjVmYzM0YWJkYTUzNjM0MTQ3MWM4NmQ5YzRhY2RhOTlhYzY2YTlhYjRhOWIwYjhlNjgwMGZhZWI5YTAwYmViYzBlYmIwNWZiN2YyOGU4'
                },
                body: JSON.stringify({
                  //also provides a body in the options about user details like name, purpose of visit, and email
                  entry: {
                    locationId: el.locationId,
                    flowId: el.flowId,
                    fullName: el.fullName,
                    email: el.email,
                    signedInAt: d.toJSON(),
                    customFields: [
                      {
                        "field": "Your Full Name",
                        "value": el.fullName
                      },
                      {
                        "field": "Purpose of visit",
                        "value": eventType
                      },
                      {
                        "field": "Your Email Address",
                        "value": el.email
                      }
                    ],
                  }
                })
              };
              //sends these options as post request
              fetch('https://api.envoy.com/v1/entries', options)
                .then(response => response.json())
                .then(response => console.log(response))
                .catch(err => console.error(err));
            }  
          }
        })
      }
      ).catch(err => console.error(err));
      //attempt at directly fetching from the envoy connection for critical user data from UUID
      //similar process as above with the ADRN portal
      fetch("https://app.envoy.com/api/entries.json?api_key=795e5dacb8788629133ff5044d9b2235&page=1&per_page=2000")
      .then(response_2 => response_2.json())
      .then(jsonData_2 => {
        let count = false;
        jsonData_2.map(el => {
          if(count == false && el["your_email_address"] == jsonData["email"]) {
            let newScanTrack = [...scannedTrack];
            newScanTrack.splice(0,0,{
              type: type,
              status: jsonData["status"] == "valid",
              data: data,
              checkedIn: el["signed_out_time_utc"].length == 0,
              name: el["your_full_name"],
              eventType: eventType,
              email: jsonData["status"] == "valid" ? jsonData["email"] : "",
              roles: jsonData["status"] == "valid" ? jsonData["rroptin"] : "",
              possibleRoles: jsonData["status"] == "valid" ? jsonData["rroptout"] : ""
            });
            setPossibleRoles(jsonData["rroptout"])
            setScannedTrack(newScanTrack);
            count = true;
          }
        })
      }
      );
    }
    );
  };

  //if the button 'Confirm New Roles' is selected, this function will handle which roles were selected
  //and process them into an array to be written back in a POST request to database
  const updateRoles = () => {
    var updateRolesArr = []
    if ((btPosGranted && btPos) || !btPosGranted) {
      updateRolesArr.push("BT");
    }
    if (ccPosGranted && ccPos || !ccPosGranted) {
      updateRolesArr.push("CC");
    }
    if (certPosGranted && certPos || !certPosGranted) {
      updateRolesArr.push("CERT");
    }
    if (cismPosGranted && cismPos || !cismPosGranted) {
      updateRolesArr.push("CISM");
    }
    if (datPosGranted && datPos || !datPosGranted) {
      updateRolesArr.push("DAT");
    }
    if (drsPosGranted && drsPos || !drsPosGranted) {
      updateRolesArr.push("DRS");
    }
    if (hamPosGranted && hamPo || !hamPosGranted) {
      updateRolesArr.push("HAM");
    }

    //array being written back through a POST request
    console.log(updateRolesArr);
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        response_roles: updateRolesArr
      })
    };
    fetch("https://portal.adrn.org/api/response-role/opt-in/uuid/" + scannedTrack[0].uuid, options)
    .then(response => response.json())
  }

  //checks persmission and reports appropriate error cases
  if (hasPermission === null) {
      return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
      return <Text>No access to camera</Text>;
  }

  //final return for main app screen
  return (
    //navigation components
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            //sets appropriate icons for each tab
            if (route.name === 'Scan') {
              iconName = focused
                ? 'ios-qr-code'
                : 'ios-qr-code-outline';
            } else if (route.name === 'History') {
              iconName = focused ? 'ios-list' : 'ios-list-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          //marking colors on active or inactive
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        {/* the two main screens */}
        <Tab.Screen name="Scan" component={ScanScreen} />
        <Tab.Screen name="History" component={HistoryScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

//stylesheet used to CSS design components we created
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'top',
    width: "100%",
  },
  container_checklist: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'start',
    justifyContent: 'left',
    width: "100%",
  },
  qrcodecam: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    width: "100%"
  },
  status: {
    width: "10%"
  },
  updateRolesButton:{
    marginTop: 20,
    paddingTop:10,
    paddingBottom:10,
    paddingLeft: 20,
    paddingRight: 20,
    backgroundColor:'#82bab0',
    borderRadius:10,
    borderWidth: 1,
    borderColor: '#82bab0',
    alignSelf: 'center',
    bottom: 20
  },
  loginScreenButton:{
    marginRight:40,
    marginLeft:40,
    marginTop:10,
    paddingTop:10,
    paddingBottom:10,
    backgroundColor:'#007AFF',
    borderRadius:10,
    borderWidth: 1,
    borderColor: '#007AFF',
    width: "90%",
    position: "absolute",
    bottom: 20
  },
  checkInListItem:{
    marginTop: 10,
    paddingTop:10,
    paddingBottom:10,
    borderRadius:10,
    borderWidth: 1,
    width: "90%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText:{
      color:'#fff',
      textAlign:'center',
      paddingLeft : 10,
      paddingRight : 10,
      fontSize: 18
  },
  container_checklist: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  checkbox: {
    alignSelf: 'center',
  },
  label: {
    margin: 8,
  },
});
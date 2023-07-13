import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';

//contains a list of objects that attribute the purpose of visit
//add any other possible purposes below if necessary
const data = [
  { label: '1: HQ - Volunteer', value: '1: HQ - Volunteer' },
  { label: '2: Survivor Services', value: '2: Survivor Services' },
  { label: '3: Guest/Visitor', value: '3: Guest/Visitor' },
  { label: '4: HOPE Prayer Center', value: '4: HOPE Prayer Center' },
  { label: '5: Staff/Employee Role', value: '5: Staff/Employee Role' },
  { label: '6: Thrift Store', value: '6: Thrift Store' },
];

const DropdownComponent = (props) => {
  //state to organize which value was selected out of data
  const [value, setValue] = useState(props.event);
  //state to check whether dropdown is currently activated or focused on one element
  const [isFocus, setIsFocus] = useState(false);

  //rendering default label
  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: 'blue' }]}>
          Purpose of Visit
        </Text>
      );
    }
    return null;
  };

  //returning dropdown functionality
  return (
    <View style={styles.container}>
      {renderLabel()}
      {/* react native element component for dropdown completely styled and customized */}
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? 'Select item' : '...'}
        searchPlaceholder="Search..."
        value={value}
        //if user is selecting from dropdown, then isFocus is modified accordingly
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        //updates value based on new choice
        onChange={item => {
          props.updateEvent(item.value);
          setIsFocus(false);
        }}
        //renders icon
        renderLeftIcon={() => (
          <AntDesign
            style={styles.icon}
            color={isFocus ? 'blue' : 'black'}
            name="Safety"
            size={20}
          />
        )}
      />
    </View>
  );
};

export default DropdownComponent;

//stylesheet used to CSS design components we created
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16,
    width: "100%"
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
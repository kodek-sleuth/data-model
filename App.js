import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {sha256} from 'react-native-sha256';

const data = [
  {
    label: 'Data Model 1',
    value: 'Data Model 1',
    id: 'dataModel1',
    numberOfFields: 2,
  },
  {
    label: 'Data Model 2',
    value: 'Data Model 2',
    id: 'dataModel2',
    numberOfFields: 10,
  },
];

const App = () => {
  const [value, setValue] = useState(null);
  const [fullValue, setFullValue] = useState(null);
  const [inputValues, setInputValues] = useState({});
  const [outPutAnswers, setOutPutAnswers] = useState([]);
  const [isFocus, setIsFocus] = useState(false);

  useEffect(() => {
    const keys = Object.keys(inputValues);
    const values = Object.values(inputValues);

    if (fullValue && fullValue.id === 'dataModel2') {
      const sumOfValues = Object.values(inputValues).reduce(
        (a, b) => Number(a) + Number(b),
        0,
      );
      const mean = sumOfValues / keys.length;
      const middleIndex = Math.floor(keys.length / 2);
      console.log('middleIndex', middleIndex);
      const median =
        keys.length % 2 === 1
          ? values[middleIndex]
          : (Number(values[middleIndex - 1]) +
              Number(values[middleIndex + 1])) /
            2;
      const sd = Math.sqrt(
        values.map(x => Math.pow(Number(x) - mean, 2)).reduce((a, b) => a + b) /
          keys.length,
      );
      setOutPutAnswers([mean, median, sd]);
    }

    if (fullValue && fullValue.id === 'dataModel1') {
      sha256(values[0]).then(hash1 => {
        sha256(values[1]).then(hash2 => {
          console.log(hash1, hash2);
          setOutPutAnswers([`${hash1}${hash2}`]);
        });
      });
    }
  }, [inputValues]);

  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text style={[styles.label, isFocus && {color: 'blue'}]}>
          Dropdown label
        </Text>
      );
    }
    return null;
  };

  const onChangeNumber = (text, index) => {
    setInputValues({...inputValues, ...{[index]: text}});
  };
  console.log('inputValues ===>', inputValues);
  return (
    <ScrollView>
      <View style={styles.container}>
        {renderLabel()}
        <Dropdown
          style={[styles.dropdown, isFocus && {borderColor: 'blue'}]}
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
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={(item) => {
            setValue(item.value);
            setFullValue(item);
            setIsFocus(false);
          }}
        />

        <View style={{marginTop: 50}}>
          <Text>Current Model: {value}</Text>
          <View style={{marginTop: 20}}>
            <Text>Input</Text>
            <View style={{flexDirection: 'column'}}>
              {Array.from(
                Array(fullValue ? fullValue.numberOfFields : 0).keys(),
              ).map(index => {
                return (
                  <TextInput
                    style={styles.input}
                    onChangeText={text => onChangeNumber(text, index)}
                    value={inputValues[index]}
                  />
                );
              })}
            </View>
          </View>

          <View style={{marginTop: 20}}>
            <Text>Output</Text>
            {outPutAnswers.map((answer, index) => {
              return (
                <Text>
                  Output Answer {index + 1}: {answer}
                </Text>
              );
            })}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16,
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
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: 150,
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

export default App;

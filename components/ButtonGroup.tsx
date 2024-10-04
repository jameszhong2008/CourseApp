import React, {useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

export const ButtonGroup = (props: {
  buttons: string[];
  selectButton: string;
}) => {
  let buttons = props.buttons;
  let selectButton = props.selectButton;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const buttonItem = buttons?.map((v: any, i: number) => {
    const changeButton = (v: string, i: number) => {
      setSelectedIndex(i);
      // 回传给父组件选中的按钮名称，父组件可根据按钮名称渲染内容，切换按钮时触发
      selectButton(v);
    };
    return (
      <TouchableOpacity onPress={() => changeButton(v, i)} key={v}>
        <Text
          style={[
            styles.secondText,
            i === selectedIndex
              ? {backgroundColor: '#0D7CF2', color: '#ffffff'}
              : {backgroundColor: '#F7F5F8'},
          ]}>
          {v}
        </Text>
      </TouchableOpacity>
    );
  });

  return (
    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
      <View style={styles.buttonItemView}>{buttonItem}</View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  buttonItemView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'nowrap',
    paddingVertical: 4,
  },
  secondText: {
    fontSize: 16,
    color: '#333333',
    padding: 4,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 2,
  },
});

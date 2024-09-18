import {
  StyleSheet,
  Button,
  useColorScheme,
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import {uiState} from '../state/ui-state';
import {useHookstate} from '@hookstate/core';
import AudioManager, {loadArticle} from '../common/article_oper';
import {getPlayBtnTitle} from './control';
import Slider from '@react-native-community/slider';
import {useEffect, useState} from 'react';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import ArticleView from './ArticleView';
import Dropdown from './Dropdown';

const secToTime = (value: number) => {
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);
  return `${minutes < 10 ? '0' + minutes : minutes}:${
    seconds < 10 ? '0' + seconds : seconds
  }`;
};

const rateList = [
  {label: '0.5', value: '0.5'},
  {label: '0.75', value: '0.75'},
  {label: '1', value: '1'},
  {label: '1.25', value: '1.25'},
  {label: '1.5', value: '1.5'},
  {label: '1.75', value: '1.75'},
  {label: '2', value: '2'},
  {label: '3', value: '3'},
];

export default () => {
  const isDarkMode = useColorScheme() === 'dark';
  const state = useHookstate(uiState);
  const prevArticle = () => {
    AudioManager.getInstance().onRemotePrev();
  };
  const nextArticle = () => {
    AudioManager.getInstance().onRemoteNext();
  };

  const toggleAudio = () => {
    AudioManager.getInstance().toggleAudio();
  };

  const onValueChange = (value: number) => {
    AudioManager.getInstance().seekAudio(value);
  };
  const onSlidingComplete = (value: number) => {
    AudioManager.getInstance().seekAudio(value);
  };

  const duration = state.audio.duration.value;
  const position = state.audio.position.value;

  const minimumControl = () => {
    // 记录进度
    AudioManager.getInstance().recordProgress();
    state.control.module.set('base');
  };

  const [content, setContent] = useState<{
    content?: string;
    progressInfo?: {
      course: string;
      article: string;
      progress: number;
    };
  }>({});
  const onOpenArticle = () => {
    if (content.content) {
      // 设置为空
      setContent({});
      return;
    }
    let index = state.audio.index.value;
    if (index > -1 && index < state.course.articles.value.length) {
      loadArticle(state.course.articles.value[index], index)
        .then(result => {
          setContent({
            content: (result as any).source,
            progressInfo: {
              course: state.course.name.value,
              article: state.audio.title.value,
              progress:
                state.audio.position.value / (state.audio.duration.value || 1),
            },
          });
        })
        .catch(err => {
          setContent({});
        });
    }
  };

  const onSelectPlayRate = (item: {label: string; value: string}) => {
    AudioManager.getInstance().setRate(parseFloat(item.value));
  };

  return (
    <View style={styles.sectionContainer}>
      <View>
        <View style={{paddingVertical: 8}}>
          <Slider
            value={position}
            maximumValue={duration || 1}
            onValueChange={onValueChange}
            onSlidingComplete={onSlidingComplete}
          />
          <View style={styles.horizonFlex}>
            <Text style={styles.textDark}>{secToTime(position)}</Text>
            <Text style={styles.textDark}>{secToTime(duration)}</Text>
          </View>
        </View>
        <View style={[{paddingVertical: 8}, styles.horizonFlex]}>
          <Button title={'上一个'} onPress={prevArticle}></Button>
          <Button
            title={getPlayBtnTitle(state.audio.state.value)}
            onPress={toggleAudio}></Button>
          <Button title={'下一个'} onPress={nextArticle}></Button>
          <Dropdown
            label={'倍速:' + state.audio.rate.value}
            data={rateList}
            onSelect={onSelectPlayRate}
          />
        </View>
        <Button title="文章" onPress={onOpenArticle}></Button>
      </View>
      <Text style={styles.textDark}>{state.audio.title.value}</Text>
      {content.content && (
        <ArticleView
          html={content.content}
          progressInfo={content.progressInfo}
        />
      )}
      {!content.content && (
        <Image
          // https://github.com/idrisssakhi/photoGallery
          source={AudioManager.getInstance().artwork as any}
          style={{width: 400, height: 640}}></Image>
      )}
      <TouchableOpacity
        onPress={() => {
          minimumControl();
        }}
        style={styles.closeBtn}>
        <Text style={[{fontSize: 18}, styles.textDark]}>关闭</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    paddingHorizontal: 4,
    paddingTop: 40,
    height: '100%',
  },
  horizonFlex: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textDark: {
    color: '#000000',
  },
  closeBtn: {
    paddingHorizontal: 4,
    position: 'absolute',
    bottom: 20,
    right: 0,
  },
});

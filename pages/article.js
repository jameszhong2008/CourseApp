import {
  StyleSheet,
  useColorScheme,
  View,
  Text,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

import { WebView } from 'react-native-webview';
import { useCallback, useEffect, useState } from 'react';
import { readFile } from '../common/file_oper';

/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */
export default ({title}): Node => {
  const isDarkMode = useColorScheme() === 'dark';

  const [content, setContent] = useState('');
  useEffect(() => {
    readFile("01 _ 基础篇：学习此课程你需要了解哪些基础知识？.html")
    .then(result => {
      console.log(result)
      const data = '<audio title="01 _ 基础篇：学习此课程你需要了解哪些基础知识？" src="https://static001.geekbang.org/resource/audio/fe/97/fe4625e50322eeff76a8dea40898d397.mp3" controls="controls"></audio> \r\n\
      <p>在我们正式进入到 WebAssembly 的学习之前，为了帮助你更好地理解课程内容，我为你准备了一节基础课。</p><p>在这一节基础课中，我将与编程语言及计算机基础相关的一些概念，按照其各自所属的领域进行了分类，供你进行本课程的预习与巩固。</p><p>这些概念大多都相互独立，因此你可以根据自己的实际情况选择性学习。在后面的课程中，我将会直接使用这些概念或术语，不再过多介绍。当然，如果你对这些知识足够熟悉，可以直接跳过这节课。</p><h2>JavaScript</h2><p>接下来，我将介绍有关 JavaScript 的一些概念。其中包括 ECMAScript 语言规范中提及的一些特性，以及一些经常在 Web 应用开发中使用到的 JavaScript Web API。</p><h3>window.requestAnimationFrame</h3><p>window.requestAnimationFrame 这个 Web API ，主要用来替代曾经的 window.setInterval 和 window.setTimeout 函数，以专门用于处理需要进行“动画绘制”的场景。</p><p>该方法接受一个回调函数作为参数，该回调函数将会在下一次浏览器尝试重新绘制当前帧动画时被调用。因此，我们便需要在回调函数里再次调用 window.requestAnimationFrame 函数，以确保浏览器能够正确地绘制下一帧动画。</p><!-- [[[read_end]]] --><p>这个 API 一个简单的用法如下所示。</p><pre><code>&lt;html&gt;\r\n\
  &lt;head&gt;\r\n\
    &lt;style&gt;\r\n\
      div {\r\n\
        width: 100px;\r\n\
        height: 100px;\r\n\
        background-color: red;\r\n\
        position: absolute;\r\n\
      }\r\n\
    &lt;/style&gt;\r\n\
  &lt;/head&gt;\r\n\
  &lt;body&gt;\r\n\
    &lt;div&gt;&lt;/div&gt;\r\n\
  &lt;/body&gt;\r\n\
  &lt;script&gt;\r\n\
    let start = null;\r\n\
    let element = document.querySelector("div");\r\n\
\r\n\
    const step = (timestamp) =&gt; {\r\n\
      if (!start) start = timestamp;\r\n\
      let progress = timestamp - start;\r\n\
      element.style.left = Math.min(progress / 10, 200) + "px";\r\n\
      if (progress &lt; 2000) {\r\n\
        window.requestAnimationFrame(step);\r\n\
      }\r\n\
    }\r\n\
    \r\n\
    window.requestAnimationFrame(step);\r\n\
  &lt;/script&gt;\r\n\
&lt;/html&gt;\r\n\
</code></pre><p>在这段代码中为了便于展示，我们直接连同 CSS 样式、HTML 标签以及 JavaScript 代码全部以“内嵌”的方式，整合到同一个 HTML 文件中。</p><p>页面元素部分，我们使用 </p><div> 标签绘制了一个背景色为红色，长宽分别为 100 像素的矩形。并且该矩形元素的 position 属性被设置为了 “absolute”，这样我们便可以通过为其添加 “left” 属性的方式，来改变当前矩形在页面中的位置。<p></p>\r\n\
<p><img src="https://static001.geekbang.org/resource/image/69/b5/69672c8f0944ebb2ed89bbyy7eef66b5.gif?wh=800*393" alt=""></p>\r\n\
<style>\r\n\
    ul {\r\n\
      list-style: none;\r\n\
      display: block;\r\n\
      list-style-type: disc;\r\n\
      margin-block-start: 1em;\r\n\
      margin-block-end: 1em;\r\n\
      margin-inline-start: 0px;\r\n\
      margin-inline-end: 0px;\r\n\
      padding-inline-start: 40px;\r\n\
    }\r\n\
</style><ul><li></li>\r\n\
    <div class="_2sjJGcOH_0"><img src="https://static001.geekbang.org/account/avatar/00/13/be/af/a578a3cf.jpg"\r\n\
  class="_3FLYR4bF_0">\r\n\
  <div class="_36ChpWj4_0">\r\n\
  <div class="_2zFoi7sd_0"><span>言言周</span>\r\n\
  </div>\r\n\
  <div class="_2_QraFYR_0">转换成补码计算。以8bit为例，最后溢出1位。<br>10 - 3 = 10 + (-3)= 00001010 + 11111101 = 1,0000,0111 = 7<br> </div>\r\n\
  <div class="_10o3OAxT_0">\r\n\
  \r\n\
  </div>\r\n\
  <div class="_3klNVc4Z_0">\r\n\
    <div class="_3Hkula0k_0">2020-09-07 23:48:46</div>\r\n\
  </div>\r\n\
</div>\r\n\
</div>\r\n\
</li>\r\n\
<li>\r\n\
<div class="_2sjJGcOH_0"><img src="https://static001.geekbang.org/account/avatar/00/0f/e9/1d/102caf26.jpg"\r\n\
  class="_3FLYR4bF_0">\r\n\
<div class="_36ChpWj4_0">\r\n\
  <div class="_2zFoi7sd_0"><span>IV0id</span>\r\n\
  </div>\r\n\
  <div class="_2_QraFYR_0">计算机内部使用补码，是为了方便加法器将符号域和数值域做统一处理，不需要每次加减独立处理符号位</div>\r\n\
  <div class="_10o3OAxT_0">\r\n\
  \r\n\
  </div>\r\n\
  <div class="_3klNVc4Z_0">\r\n\
    <div class="_3Hkula0k_0">2020-09-09 15:32:54</div>\r\n\
  </div>\r\n\
</div>\r\n\
</div>\r\n\
</li>';
console.log('raw\n')
console.log(data)
setContent(data);
    })
    .catch(err => {
      setContent("<p>打开文件失败<p/>");
    })
    
  }, [title])

  const INJECTED_JAVASCRIPT = `(function(){
    alert('Test')
   })();`;
   
  
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text>
      Test articles
      </Text>
      <WebView
        javaScriptEnabled={true}
        startInLoadingState={true}
        injectedJavaScript={INJECTED_JAVASCRIPT}
        originWhitelist={['*']}
        source={{html: content}}
        style={{marginTop: 20}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
    /** 必须将WebView 的父节点设置flex为1， 否则该页面闪退*/
    flex: 1
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },  
});
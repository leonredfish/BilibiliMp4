import React, {PureComponent} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  InteractionManager,
  TouchableHighlight,
  Alert,
  Platform,
} from 'react-native';
import Nav from '../components/Nav';
import config from '../configs';
import {FFmpegKit, ReturnCode} from 'ffmpeg-kit-react-native';
import sanitize from 'sanitize-filename';
if (Platform.OS !== 'web') {
  var DocumentPicker = require('react-native-document-picker').default;
  var ReactNativeBlobUtil = require('react-native-blob-util').default;
}
class About extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      uri: '',
      successFiles: [],
    };
    this.tapCount = 0;
  }

  tap = () => {
    const {actions} = this.props;
    this.tapCount++;
    if (this.tapCount === 7) {
      actions.saveServerAddressChangeable(true);
      actions.toast('首页已可更改服务器登录地址');
    }
  };

  pickContentDirectory = async () => {
    try {
      const result = await DocumentPicker.pickDirectory();
      if (Platform.OS === 'android') {
        let url = decodeURIComponent(result.uri).replace(
          /^content:\/\/com.android.externalstorage.documents\/tree\//,
          '',
        );
        if (url.startsWith('primary')) {
          url = url.replace(/^primary:/, '/storage/emulated/0/');
        } else {
          const volumeName = url.replace(/:.*/, '');
          url = url.replace(/^.*:/, '');
          url = '/storage/' + volumeName + '/' + url;
        }
        this.setState({uri: url});
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        Alert.alert('取消', '目录选择已取消');
      } else {
        Alert.alert('错误', '目录选择出错');
      }
    }
  };

  doMerge = async () => {
    if (!this.state.uri) {
      Alert.alert('错误', '请选择目录');
      return;
    }
    const uri = this.state.uri;

    const processDirectory = async directory => {
      const entryJson = await ReactNativeBlobUtil.fs.readFile(
        `${directory}/entry.json`,
        'utf8',
      );
      const entryData = JSON.parse(entryJson);
      console.warn(entryData);

      const avTitle = entryData.title.replace(/\//g, ' ');
      const avTypeTag = entryData.type_tag;
      const avPage = entryData.page_data.page;
      let avPart;
      if (entryData.page_data.part === undefined) {
        entryData.page_data.part = undefined;
      } else {
        avPart = entryData.page_data.part.replace(/\//g, ' ');
      }

      const inPath = `${directory}/${avTypeTag}`;
      const outPath = `/storage/emulated/0/Movies/` + sanitize(avTitle);
      let outFile;
      if (avPart === undefined) {
        outFile = sanitize(`${avPage}_${avTitle}`);
      } else {
        outFile = sanitize(`${avPage}_${avPart}`);
      }
      if (await ReactNativeBlobUtil.fs.exists(outPath)) {
        const statTemp = await ReactNativeBlobUtil.fs.stat(outPath);
      } else {
        await ReactNativeBlobUtil.fs.mkdir(outPath);
      }

      await FFmpegKit.execute(
        `-i ${inPath}/video.m4s -i ${inPath}/audio.m4s -c copy -y -- "${outPath}/${outFile}.mp4"`,
      ).then(async session => {
        const returnCode = await session.getReturnCode();
        if (ReturnCode.isSuccess(returnCode)) {
          const successFiles = this.state.successFiles.concat(
            outPath + '/' + outFile,
          );
          this.setState({
            successFiles,
          });
        } else if (ReturnCode.isCancel(returnCode)) {
          Alert.alert('Canceled: ' + outPath + '/' + outFile);
        } else {
          Alert.alert('Error! ' + outPath + '/' + outFile);
        }
      });
    };

    const files = await ReactNativeBlobUtil.fs.ls(uri);
    const subDirs = await Promise.all(
      files.map(async file => {
        const stat = await ReactNativeBlobUtil.fs.stat(`${uri}/${file}`);
        return stat.type === 'directory' ? `${uri}/${file}` : null;
      }),
    );

    const hasEntryJson = await ReactNativeBlobUtil.fs.exists(
      `${uri}/entry.json`,
    );

    if (hasEntryJson) {
      await processDirectory(uri);
    } else {
      try {
        for (const subDir of subDirs.filter(Boolean)) {
          const subDirHasEntryJson = await ReactNativeBlobUtil.fs.exists(
            `${subDir}/entry.json`,
          );
          if (subDirHasEntryJson) {
            await processDirectory(subDir);
          }
        }
        Alert.alert('Success');
      } catch (err) {
        console.error(err);
        Alert.alert('Error! ' + err.message);
      }
    }
  };

  renderSuccessFile = ({item}) => {
    return (
      <Text key={item} style={styles.subTitle}>
        {item}
      </Text>
    );
  };

  render() {
    const navs = {
      Center: {
        text: 'Bilibili MP4',
      },
    };
    return (
      <View style={styles.container}>
        <View>
          <Nav navs={navs} />
          <View style={styles.content}>
            <Text style={styles.title}>
              Bilibili Mp4
              <Text onPress={this.tap} style={styles.versionText}>
                {' v' + config.package.version}
              </Text>
            </Text>
            <TouchableHighlight
              style={styles.title}
              onPress={this.pickContentDirectory}
            >
              <Text style={styles.gitShaText}>open content folder</Text>
            </TouchableHighlight>
            <Text style={styles.subTitle}>{this.state.uri}</Text>
            <TouchableHighlight onPress={this.doMerge}>
              <Text style={styles.gitShaText}>convert</Text>
            </TouchableHighlight>
          </View>
        </View>
        <View style={{flex: 1}}>
          <FlatList
            style={styles.subTitle}
            data={this.state.successFiles}
            renderItem={this.renderSuccessFile}
          />
        </View>
        <View style={styles.footer}>
          <Text style={styles.reactNative}>Power By React-Native</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2D343B',
    flex: 1,
    justifyContent: 'space-between',
  },
  content: {
    alignItems: 'center',
  },
  logo: {
    height: 80,
    width: 80,
  },
  title: {
    marginTop: 20,
    fontSize: 30,
    color: 'rgba(255,255,255,0.7)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  subTitle: {
    marginTop: 10,
    fontSize: 16,
    color: 'rgba(255,255,255,0.5)',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  reactNative: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.3)',
  },
  versionText: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.6)',
  },
  gitShaText: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.6)',
  },
});

export const LayoutComponent = About;
export function mapStateToProps(state) {
  return {};
}

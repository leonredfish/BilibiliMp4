import React, {PureComponent} from 'react';
import {
  View,
  Text,
  StyleSheet,
  InteractionManager,
  TouchableHighlight,
  Alert,
  Platform,
} from 'react-native';
import Nav from '../components/Nav';
import config from '../configs';
import {FFmpegKit, ReturnCode} from 'ffmpeg-kit-react-native';
if (Platform.OS !== 'web') {
  var DocumentPicker = require('react-native-document-picker').default;
  var ReactNativeBlobUtil = require('react-native-blob-util').default;
}
class About extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      uri: '',
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
              onPress={async () => {
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
              }}
            >
              <Text style={styles.gitShaText}>open folder</Text>
            </TouchableHighlight>
            <Text style={styles.subTitle}>{this.state.uri}</Text>
            <TouchableHighlight
              onPress={() => {
                const ROOT_PATH = 'merged';
                Alert.alert('Notice', 'Choose what to do', [
                  {
                    text: 'merge one collection',
                    onPress: async () => {
                      const uri = this.state.uri;
                      const entryJson = await ReactNativeBlobUtil.fs.readFile(
                        `${uri}/entry.json`,
                        'utf8',
                      );
                      const entryData = JSON.parse(entryJson);

                      const avTitle = entryData.title.replace(/\//g, ' ');
                      const avTypeTag = entryData.type_tag;
                      const avPage = entryData.page_data.page;
                      const avPart = entryData.page_data.part.replace(
                        /\//g,
                        ' ',
                      );

                      const inPath = `${uri}/${avTypeTag}`;
                      const outPath = '/storage/emulated/0/Movies';
                      const outFile = `${outPath}/${avPage}_${avPart}`;
                      FFmpegKit.execute(
                        `-i ${inPath}/video.m4s -i ${inPath}/audio.m4s -c copy -y -- "${outFile}.mp4"`,
                      ).then(async session => {
                        const returnCode = await session.getReturnCode();
                        console.warn('return code', JSON.stringify(returnCode));
                        if (ReturnCode.isSuccess(returnCode)) {
                          Alert.alert('Success');
                        } else if (ReturnCode.isCancel(returnCode)) {
                          Alert.alert('Canceled');
                        } else {
                          Alert.alert('Error!');
                        }
                      });
                    },
                  },
                  {text: 'merge all collections', onPress: () => {}},
                ]);
              }}
            >
              <Text style={styles.subTitle}>convert</Text>
            </TouchableHighlight>
            <Text style={styles.subTitle}>{config.domain}</Text>
          </View>
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

/**
 * Created by guoshuyu on 2017/2/20.
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    View,
    Text,
    TouchableHighlight,
    Platform,
    ToastAndroid,
    Animated,
    Easing
} from 'react-native';

import styles from './jscode/style/styles'

import Animation from 'lottie-react-native';

import {NativeModules} from 'react-native';
const {DetailModule} = NativeModules;

export default class detail extends Component {
    constructor(props) {
        super(props);
        //设置state
        this.state = {
            text1: 'detail, default  text 1',
            text2: 'detail, default  text 2',
            text3: 'detail, default  text 3',
            text4: 'detail, default  text 4',
            progress: new Animated.Value(0),
        }
        this.thisUnmount = false;
    }

    /**
     * 获取上一个Activity传递过来的数据
     * */
    componentDidMount() {   //这是React的生命周期函数，会在界面加载完成后执行一次
        DetailModule.getDataFromIntent(
            (successMsg1, successMsg2, successMsg3, successMsg4) => {
                this.setState({
                    text1: successMsg1,
                    text2: successMsg2,
                    text3: successMsg3,
                    text4: successMsg4,
                }); //状态改变的话重新绘制界面
            },
            (errorMsg) => {
                alert(errorMsg)
            }
        );

        this.startAnimation();
    }

    componentWillUnMount() {
        console.log("componentWillUnMount!!!");
        this.thisUnmount = true;
        this.refs.AnimateCom.reset();
    }

    startAnimation() {
        if (this.thisUnmount) {
            return;
        }
        Animated.timing(this.state.progress, {
            toValue: 1,
            duration: 5000,
            easing: Easing.linear
        }).start(({ finished }) => {
            console.log("had finished " + finished);
            if (!finished) {
                return;
            }
            console.log("restart");
            //重复播放
            this.setState({
                progress: new Animated.Value(0),
            })
            this.startAnimation()
        });
    }

    /**
     * 打开一个新的Activity，传递参数，页面销毁返回数据。
     * */
    _clickItem() {
        DetailModule.startActivitySingle(
            (text) => {
                if (text)
                    ToastAndroid.show('receive data from detail activity ' + text, 2000);
            },
            (error) => {
                if (error)
                    ToastAndroid.show('error data from detail activity ' + error, 2000);
            }
        );

    }

    render() {
        return (
            <View style={[styles.container, {backgroundColor: '#000000'}]}>
                <View style={{flex: 1, justifyContent:'center', alignItems: 'center'}}>
                    <TouchableHighlight onPress={this._clickItem.bind(this)}>
                        <Text style={{color:'#ffffff'}}>{this.state.text1}</Text>
                    </TouchableHighlight>
                </View>
                <View style={{flex: 1, justifyContent:'center', alignItems: 'center'}}>
                    <Text style={{color:'#ffffff'}}>{this.state.text2}</Text>
                </View>
                <View style={{flex: 1, justifyContent:'center', alignItems: 'center'}}>
                    <Text style={{color:'#ffffff'}}>{this.state.text2}</Text>
                </View>
                <View style={{flex: 1, justifyContent:'center', alignItems: 'center'}}>
                    <Text style={{color:'#ffffff'}}>{this.state.text4}</Text>
                </View>
                <View style={{justifyContent:'center', alignItems: 'center'}}>
                    <Animation
                        ref="AnimateCom"
                        style={{
                      width: 200,
                      height: 200,
                    }}
                        source={require('./jscode/img/path/LottieLogo1.json')}
                        progress={this.state.progress}
                    />
                </View>
            </View>);

    }
}
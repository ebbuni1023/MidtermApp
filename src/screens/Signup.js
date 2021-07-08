import React, { useState, useRef, useEffect, useContext } from 'react';
import { ProgressContext, UserContext } from '../contexts';
import styled from 'styled-components/native';
import { Image, Input, Button } from '../components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { validateEmail, removeWhitespace } from '../utils/common';
import { images } from '../utils/images';
import { View, TouchableOpacity, Text, Modal, StyleSheet, Alert } from 'react-native';
import { Card, List, Title, Paragraph, Headline, } from "react-native-paper";
import { signup } from '../utils/firebase';

// AdMob
import { AdMobBanner, AdMobRewarded, setTestDeviceIDAsync } from "expo-ads-admob";

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.background};
  padding: 40px 20px;
`;
const ErrorText = styled.Text`
  align-items: flex-start;
  width: 100%;
  height: 20px;
  margin-bottom: 10px;
  line-height: 20px;
  color: ${({ theme }) => theme.errorText};
`;

const Signup = () => {
  const { dispatch } = useContext(UserContext);
  const { spinner } = useContext(ProgressContext);

  const [photoUrl, setPhotoUrl] = useState(images.photo);
  const [name, setName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [adVisible, setAdVisible] = useState(true);

  const didMountRef = useRef();

  // AdMob
  useEffect(() => {setTestDeviceIDAsync("EMULATOR");}, []);

  useEffect(() => {
    if (didMountRef.current) {
      let _errorMessage = '';
      if (!name) {
        _errorMessage = 'Please enter your name.';
      } else {
        _errorMessage = '';
      }
      setErrorMessage(_errorMessage);
    } else {
      didMountRef.current = true;
    }
  }, [name]);

  useEffect(() => {
    setDisabled(
      !(name && !errorMessage)
    );
  }, [name]);

  const _handleSignupButtonPress = async () => {
    try {
      spinner.start();
      // const user = { email: name, uid: name, name: name, photoUrl: photoUrl };
      const user = await signup({ email: name, uid: name, name, photoUrl });
      dispatch(user);
    } catch (e) {
      Alert.alert('Login Error', e.message);
    } finally {
      spinner.stop();
    }
  };

  const initRewardAds = async () => {
    // Display a rewarded ad
    await AdMobRewarded.setAdUnitID("ca-app-pub-6398170583638687/7217622539");
    await AdMobRewarded.requestAdAsync();
    await AdMobRewarded.showAdAsync();

    AdMobRewarded.addEventListener("rewardedVideoDidRewardUser", () => {
      // trigger function for hide ads
      setAdVisible(false)
    });
    AdMobRewarded.addEventListener("rewardedVideoDidClose", () => {
      // if we close ads modal will close too
      setModalVisible(false);
    });
    await AdMobRewarded.showAdAsync();
  };

  return (
    <KeyboardAwareScrollView extraScrollHeight={20}>
      <Container>
        {adVisible ? <Card
          style={{
            shadowOffset: { width: 5, height: 5 },
            width: "90%",
            borderRadius: 5,
            alignSelf: "center",
            alignContent: "center",
            alignItems: "center",
            marginTop: 10,
            marginBottom: 10,
          }}
        >
          <AdMobBanner
            bannerSize="smartBanner"
            adUnitID="ca-app-pub-6398170583638687/7664345095"
            servePersonalizedAds // true or false
            onDidFailToReceiveAdWithError={(e) => console.log(e)}
          />
        </Card>
          : null
        }

        {/**/}

        <Image
          rounded
          url={photoUrl}
          showButton
          onChangeImage={url => setPhotoUrl(url)}
        />
        <Input
          label="Name"
          value={name}
          onChangeText={text => setName(text)}
          onSubmitEditing={() => {
            setName(name.trim());
            _handleSignupButtonPress();
          }}
          onBlur={() => setName(name.trim())}
          placeholder="Name"
          returnKeyType="done"
        />
        <ErrorText>{errorMessage}</ErrorText>
        <Button
          title="Login"
          onPress={_handleSignupButtonPress}
          disabled={disabled}
        />
      </Container>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 5,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    marginTop:10,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },

  container: {
    flex: 1,
    flexDirection: 'row', // 혹은 'column'
    alignItems: 'center'
  },
  item1: {
    flex: 2,
    alignItems: 'flex-end'
    // backgroundColor: 'red',
  },
  item2: {
    flex: 3,
    textAlignVertical: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    // backgroundColor: 'yellow',
  },
});

export default Signup;

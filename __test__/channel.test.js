import 'react-native';
import React from 'react';
import Channels from '../src/screens/Channel'
import renderer from 'react-test-renderer'
import { AdMobBanner, AdMobRewarded, setTestDeviceIDAsync } from "expo-ads-admob";


test('App snapShot', () => {
    const snap = renderer.create(
        <Channels />
    ).toJSON();
expect(snap).toMatchSnapshot();
});
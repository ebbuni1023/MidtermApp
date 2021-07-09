import 'react-native';
import React from 'react';
import Ads from '../src/screens/Ads'
import renderer from 'react-test-renderer'
import { AdMobBanner, AdMobRewarded, setTestDeviceIDAsync } from "expo-ads-admob";


test('App snapShot', () => {
    const snap = renderer.create(
        <Ads />
    ).toJSON();
expect(snap).toMatchSnapshot();
});
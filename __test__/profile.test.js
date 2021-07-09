import 'react-native';
import React from 'react';
import profile from '../src/screens/Profile'
import renderer from 'react-test-renderer'
import { AdMobBanner, AdMobRewarded, setTestDeviceIDAsync } from "expo-ads-admob";


test('App snapShot', () => {
    const snap = renderer.create(
        <profile />
    ).toJSON();
expect(snap).toMatchSnapshot();
});
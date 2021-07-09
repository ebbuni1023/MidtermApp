import 'react-native';
import React from 'react';
import index from '../src/screens/index'
import renderer from 'react-test-renderer'
import { AdMobBanner, AdMobRewarded, setTestDeviceIDAsync } from "expo-ads-admob";


test('App snapShot', () => {
    const snap = renderer.create(
        <index />
    ).toJSON();
expect(snap).toMatchSnapshot();
});
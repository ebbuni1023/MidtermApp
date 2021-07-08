import React, { useContext, useState } from 'react';
import styled, { ThemeContext } from 'styled-components/native';
import { Button, Image, Input } from '../components';
import { logout, getCurrentUser, updateUserPhoto } from '../utils/firebase';
import { UserContext, ProgressContext } from '../contexts';
import { Alert } from 'react-native';

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.background};
  justify-content: center;
  align-items: center;
  padding: 0 20px;
`;

const Profile = () => {
  const { user, dispatch } = useContext(UserContext);
  const { spinner } = useContext(ProgressContext);
  const theme = useContext(ThemeContext);

  // const user = { uid: 'test', name: 'test', email: 'test', photoUrl: 'test' }
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl);
  const [name, setName] = useState(user.name);

  const _handleLogoutButtonPress = async () => {
    try {
      spinner.start();
      await logout();
    } catch (e) {
      console.log('[Profile] logout: ', e.message);
    } finally {
      dispatch({});
      spinner.stop();
    }
  };

  const _handleUpdateButtonPress = () => {
      spinner.start();
      const updatedUser = { name: name, uid: name, email: name, photoUrl: user.photoUrl };
      console.log(updatedUser);
      dispatch(updatedUser);
      spinner.stop();
  };

  const _handlePhotoChange = async url => {
    try {
      spinner.start();
      const updatedUser = await updateUserPhoto(url, user);
      setPhotoUrl(updatedUser.photoUrl);
      dispatch(updatedUser);
    } catch (e) {
      Alert.alert('Photo Error', e.message);
    } finally {
      spinner.stop();
    }
  };

  return (
    <Container>
      {console.log(user)}
      <Image
        url={user.photoUrl}
        onChangeImage={_handlePhotoChange}
        showButton
        rounded
      />
      <Input label="Name" value={name} onChangeText={text => setName(text)}/>
      <Button
        title="Update Name"
        onPress={_handleUpdateButtonPress}
        containerStyle={{ marginTop: 30, backgroundColor: theme.buttonBackground }}
      />
      <Button
        title="logout"
        onPress={_handleLogoutButtonPress}
        containerStyle={{ marginTop: 30, backgroundColor: theme.buttonLogout }}
      />
    </Container>
  );
};

export default Profile;

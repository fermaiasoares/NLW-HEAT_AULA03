import { StyleSheet } from 'react-native';
import { COLORS } from '../../theme';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.BLACK_SECONDARY,
    paddingTop: getStatusBarHeight() + 17
  }
});
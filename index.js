/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import ChallengeRoot from './src/screens/ChallengeScreen';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
// Rendered by ChallengeActivity over blocked apps and after unlocking.
AppRegistry.registerComponent('ChessLockChallenge', () => ChallengeRoot);

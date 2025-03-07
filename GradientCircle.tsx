import React from 'react';
import { View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const GradientCircle = ({ children }: { children: React.ReactNode }) => (
  <LinearGradient
    colors={['#FF69B4', '#FFD700']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={styles.gradient}
  >
    <View style={styles.innerCircle}>
      {children}
    </View>
  </LinearGradient>
);

const styles = StyleSheet.create({
  gradient: {
    borderRadius: 45,
    padding: 3,
    margin: 5
  },
  innerCircle: {
    backgroundColor: 'white',
    borderRadius: 40,
    padding: 3
  }
});

export default GradientCircle;
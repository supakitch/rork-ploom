import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

export default function StoryLoadingScreen() {
  const { 
    hero: heroString, 
    storyTitle, 
    mode, 
    questionnaireAnswers,
    templateId,
    isTemplateBased 
  } = useLocalSearchParams();
  const scaleAnim = new Animated.Value(1);

  useEffect(() => {
    const scaleAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    scaleAnimation.start();

    const timer = setTimeout(() => {
      // Navigate to chat with all the parameters
      router.replace({
        pathname: '/chat',
        params: {
          hero: heroString,
          storyTitle,
          mode,
          questionnaireAnswers,
          templateId,
          isTemplateBased,
        },
      });
    }, 2000);

    return () => {
      scaleAnimation.stop();
      clearTimeout(timer);
    };
  }, [heroString, storyTitle, mode, questionnaireAnswers, templateId, isTemplateBased]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.foxContainer,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.fox}>
            <View style={styles.foxEars}>
              <View style={[styles.ear, styles.leftEar]} />
              <View style={[styles.ear, styles.rightEar]} />
            </View>
            <View style={styles.foxFace}>
              <View style={styles.foxEyes}>
                <View style={styles.eye} />
                <View style={styles.eye} />
              </View>
              <View style={styles.foxNose} />
              <View style={styles.foxMouth} />
            </View>
          </View>
        </Animated.View>
        
        <Text style={styles.title}>Ça ploom...</Text>
        <Text style={styles.subtitle}>Ton histoire arrive</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFC107',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  foxContainer: {
    marginBottom: 60,
  },
  fox: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  foxEars: {
    flexDirection: 'row',
    position: 'absolute',
    top: 0,
    width: 80,
    justifyContent: 'space-between',
  },
  ear: {
    width: 30,
    height: 35,
    backgroundColor: '#FF5722',
    borderRadius: 15,
    position: 'relative',
  },
  leftEar: {
    transform: [{ rotate: '-20deg' }],
  },
  rightEar: {
    transform: [{ rotate: '20deg' }],
  },
  foxFace: {
    width: 80,
    height: 80,
    backgroundColor: '#FF5722',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    position: 'relative',
  },
  foxEyes: {
    flexDirection: 'row',
    gap: 16,
    marginTop: -8,
  },
  eye: {
    width: 8,
    height: 8,
    backgroundColor: '#000000',
    borderRadius: 4,
  },
  foxNose: {
    width: 6,
    height: 6,
    backgroundColor: '#000000',
    borderRadius: 3,
    marginTop: 4,
  },
  foxMouth: {
    width: 16,
    height: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginTop: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: '400',
    color: '#4A2C17',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#4A2C17',
    textAlign: 'center',
    opacity: 0.8,
  },
});
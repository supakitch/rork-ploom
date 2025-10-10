import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Button } from '@/components/Button';
import { Colors, Gradients } from '@/constants/colors';

export default function StoryCreationScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={Gradients.purple} style={styles.gradient}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.emoji}>✨</Text>
            <Text style={styles.title}>Create Your Story</Text>
            <Text style={styles.subtitle}>
              Let's bring your imagination to life in just a few steps
            </Text>
          </View>

          <View style={styles.steps}>
            <View style={styles.step}>
              <Text style={styles.stepNumber}>1</Text>
              <Text style={styles.stepText}>Choose your hero</Text>
            </View>
            <View style={styles.step}>
              <Text style={styles.stepNumber}>2</Text>
              <Text style={styles.stepText}>Pick creation mode</Text>
            </View>
            <View style={styles.step}>
              <Text style={styles.stepNumber}>3</Text>
              <Text style={styles.stepText}>Personalize appearance</Text>
            </View>
          </View>

          <Button
            title="Start Creating"
            onPress={() => router.push('/story-creation/hero')}
            variant="secondary"
            size="large"
            style={styles.button}
          />
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: Colors.white,
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 24,
  },
  steps: {
    alignItems: 'center',
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
    width: '100%',
  },
  stepNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.white,
    marginRight: 16,
    width: 32,
    textAlign: 'center',
  },
  stepText: {
    fontSize: 18,
    color: Colors.white,
    fontWeight: '500',
  },
  button: {
    width: '100%',
  },
});
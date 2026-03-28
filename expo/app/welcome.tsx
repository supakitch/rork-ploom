import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Home, Heart, Plus, Clock, Settings } from 'lucide-react-native';
import { Button } from '@/components/Button';
import { Logo } from '@/components/Logo';
import { Colors, Gradients } from '@/constants/colors';

const storyThumbnails = [
  'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=120&h=120&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=120&h=120&fit=crop',
  'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=120&h=120&fit=crop',
  'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=120&h=120&fit=crop',
  'https://images.unsplash.com/photo-1502780402662-acc01917949e?w=120&h=120&fit=crop',
];

export default function WelcomeScreen() {
  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

  const handleButtonPress = (route: string) => {
    return () => {
      const scaleAnim = new Animated.Value(1);
      
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start(() => {
        router.push(route);
      });
    };
  };

  return (
    <LinearGradient colors={Gradients.darkBrown} style={styles.container}>
      {/* Story Thumbnails Collage */}
      <View style={styles.thumbnailsContainer}>
        {storyThumbnails.map((uri, index) => (
          <View
            key={index}
            style={[
              styles.thumbnailWrapper,
              {
                transform: [
                  { rotate: `${(index % 2 === 0 ? -1 : 1) * (5 + index * 2)}deg` },
                  { translateX: (index % 3 - 1) * 20 },
                  { translateY: (index % 2) * 15 },
                ],
                zIndex: storyThumbnails.length - index,
              },
            ]}
          >
            <Image source={{ uri }} style={styles.thumbnail} />
          </View>
        ))}
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <View style={styles.logoSection}>
          <Logo width={180} height={50} color={Colors.cream} />
          <Text style={styles.title}>
            Explorez un monde d'histoires personnalisées avec l'IA
          </Text>
          <Text style={styles.subtitle}>
            Transformez l'imagination en contes magiques pour vos enfants
          </Text>
        </View>

        <View style={styles.buttonsContainer}>
          <AnimatedPressable
            style={styles.button}
            onPress={handleButtonPress('/auth/login')}
          >
            <Text style={styles.buttonText}>SE CONNECTER</Text>
          </AnimatedPressable>

          <AnimatedPressable
            style={styles.button}
            onPress={handleButtonPress('/auth/signup')}
          >
            <Text style={styles.buttonText}>S'INSCRIRE</Text>
          </AnimatedPressable>

          <AnimatedPressable
            style={[styles.button, { backgroundColor: '#CE94FF' }]}
            onPress={() => {
              console.log('=== TEST: Direct navigation to FAQ ===');
              router.push('/faq');
            }}
          >
            <Text style={styles.buttonText}>TEST FAQ</Text>
          </AnimatedPressable>
        </View>
      </View>

      {/* Disabled Bottom Tab Bar */}
      <View style={styles.bottomTabBar}>
        <View style={styles.tabItem}>
          <Home color={Colors.textLight} size={24} />
        </View>
        <View style={styles.tabItem}>
          <Heart color={Colors.textLight} size={24} />
        </View>
        <View style={styles.tabItem}>
          <Plus color={Colors.textLight} size={24} />
        </View>
        <View style={styles.tabItem}>
          <Clock color={Colors.textLight} size={24} />
        </View>
        <View style={styles.tabItem}>
          <Settings color={Colors.textLight} size={24} />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  thumbnailsContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnailWrapper: {
    position: 'absolute',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: Colors.cream,
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.cream,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 32,
    marginTop: 40,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.cream,
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 22,
  },
  buttonsContainer: {
    width: '100%',
    gap: 16,
  },
  button: {
    backgroundColor: Colors.cream,
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.secondary,
    letterSpacing: 1,
  },
  bottomTabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 248, 220, 0.1)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 248, 220, 0.2)',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.5,
    padding: 8,
  },
});
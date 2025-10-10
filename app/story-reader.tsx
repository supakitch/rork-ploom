import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, Image, Animated } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/colors';

const { width: screenWidth } = Dimensions.get('window');

const STORY_SLIDES = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=800&fit=crop',
    text: "Il était une fois, dans un petit village entouré de vastes forêts, un adolescent nommé Paul qui rêvait d'aventure.",
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=800&fit=crop',
    text: "Un matin, Paul découvrit un sentier mystérieux qui serpentait profondément dans la forêt enchantée.",
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=800&fit=crop',
    text: "Au cœur de la forêt, il rencontra une créature magique qui lui révéla un secret ancien sur le pouvoir des arbres.",
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=800&fit=crop',
    text: "Avec courage et détermination, Paul accepta la mission de protéger la forêt des forces obscures qui la menaçaient.",
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1502780402662-acc01917949e?w=400&h=800&fit=crop',
    text: "Grâce à sa bravoure et à l'aide de ses nouveaux amis magiques, Paul sauva la forêt et devint le gardien de ses mystères.",
  },
];

export default function StoryReaderScreen() {
  const { storyId } = useLocalSearchParams();
  const [currentSlide, setCurrentSlide] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;
  const panRef = useRef<any>(null);

  const totalSlides = STORY_SLIDES.length;
  const estimatedTimePerSlide = 2.4; // minutes
  const remainingTime = Math.ceil((totalSlides - currentSlide) * estimatedTimePerSlide);

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      const { translationX, velocityX } = event.nativeEvent;
      
      let newSlide = currentSlide;
      
      if (translationX < -50 || velocityX < -500) {
        // Swipe left - next slide
        if (currentSlide === totalSlides - 1) {
          // Navigate to story end page when finishing last slide
          router.push('/story-end');
          return;
        }
        newSlide = Math.min(currentSlide + 1, totalSlides - 1);
      } else if (translationX > 50 || velocityX > 500) {
        // Swipe right - previous slide
        newSlide = Math.max(currentSlide - 1, 0);
      }
      
      setCurrentSlide(newSlide);
      
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  };

  const goToSlide = (slideIndex: number) => {
    if (slideIndex >= totalSlides) {
      router.push('/story-end');
      return;
    }
    setCurrentSlide(slideIndex);
  };

  const ProgressBar = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill, 
            { width: `${((currentSlide + 1) / totalSlides) * 100}%` }
          ]} 
        />
      </View>
      <Pressable 
        style={styles.progressTouch}
        onPress={() => {
          // Allow tapping progress bar to jump to slides
          const tapPosition = 0.5; // This would be calculated from touch position
          const targetSlide = Math.floor(tapPosition * totalSlides);
          goToSlide(Math.min(targetSlide, totalSlides - 1));
        }}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Background Image */}
      <Image 
        source={{ uri: STORY_SLIDES[currentSlide].image }} 
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color={Colors.white} size={24} />
        </Pressable>
        
        <ProgressBar />
        
        <Text style={styles.timeRemaining}>{remainingTime} min restantes</Text>
      </View>

      {/* Swipe Handler */}
      <PanGestureHandler
        ref={panRef}
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
      >
        <Animated.View 
          style={[
            styles.slideContainer,
            {
              transform: [{ translateX }],
            },
          ]}
        >
          {/* Text Footer */}
          <View style={styles.textFooter}>
            <Text style={styles.storyText}>
              {STORY_SLIDES[currentSlide].text}
            </Text>
            {currentSlide === totalSlides - 1 && (
              <Pressable 
                style={styles.finishButton}
                onPress={() => router.push('/story-end')}
              >
                <Text style={styles.finishButtonText}>Finish Story</Text>
              </Pressable>
            )}
          </View>
        </Animated.View>
      </PanGestureHandler>

      {/* Slide Indicators */}
      <View style={styles.slideIndicators}>
        {STORY_SLIDES.map((_, index) => (
          <Pressable
            key={index}
            style={[
              styles.indicator,
              currentSlide === index && styles.indicatorActive,
            ]}
            onPress={() => goToSlide(index)}
          />
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.text,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressContainer: {
    flex: 1,
    marginHorizontal: 16,
    position: 'relative',
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.white,
    borderRadius: 2,
  },
  progressTouch: {
    position: 'absolute',
    top: -10,
    left: 0,
    right: 0,
    height: 24,
  },
  timeRemaining: {
    fontSize: 14,
    color: Colors.white,
    fontWeight: '500',
  },
  slideContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  textFooter: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    marginHorizontal: 20,
    marginBottom: 40,
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderRadius: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  storyText: {
    fontSize: 18,
    color: Colors.white,
    lineHeight: 26,
    textAlign: 'center',
    fontWeight: '400',
    marginBottom: 16,
  },
  finishButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    alignSelf: 'center',
  },
  finishButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  slideIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  indicatorActive: {
    backgroundColor: Colors.white,
    width: 24,
  },
});
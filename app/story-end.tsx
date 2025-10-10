import React from 'react';
import { View, Text, StyleSheet, ImageBackground, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Home, Heart, Plus, Clock, Settings } from 'lucide-react-native';
import { router } from 'expo-router';
import { Button } from '@/components/Button';
import { useStories } from '@/hooks/useStories';
import { Colors } from '@/constants/colors';

export default function StoryEndScreen() {
  const { saveStory } = useStories();

  const handleCreateNewStory = async () => {
    // Generate a sample story for demonstration
    const sampleStory = {
      title: `Adventure ${Date.now()}`,
      hero_name: 'New Hero',
      hero_type: 'boy' as const,
      summary: 'A brand new adventure created just now!',
      content: 'This is the beginning of a new story...',
      tags: ['New', 'Adventure', 'Fresh'],
      reading_time: 4,
      illustration: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
    };

    try {
      await saveStory(sampleStory);
      // Navigate to home to see the new story
      router.push('/(tabs)');
    } catch (error) {
      console.error('Error saving story:', error);
      // Still navigate to story creation on error
      router.push('/story-creation');
    }
  };

  const TabBarItem = ({ icon: Icon, isActive = false }: { icon: any; isActive?: boolean }) => (
    <View style={styles.tabItem}>
      <Icon 
        color={isActive ? Colors.primary : Colors.textLight} 
        size={24} 
      />
    </View>
  );

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=800&fit=crop' }}
      style={styles.container}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.overlay}>
            <Text style={styles.title}>The End</Text>
            <Text style={styles.subtitle}>Hope you enjoyed your adventure!</Text>
          </View>

          <Button
            title="Create a New Story"
            onPress={handleCreateNewStory}
            size="large"
            style={styles.createButton}
          />
        </View>

        {/* Bottom Tab Bar */}
        <View style={styles.bottomTabBar}>
          <Pressable onPress={() => router.push('/(tabs)')}>
            <TabBarItem icon={Home} isActive />
          </Pressable>
          <Pressable onPress={() => router.push('/(tabs)/favorites')}>
            <TabBarItem icon={Heart} />
          </Pressable>
          <Pressable onPress={() => router.push('/story-creation')}>
            <TabBarItem icon={Plus} />
          </Pressable>
          <Pressable onPress={() => router.push('/(tabs)/history')}>
            <TabBarItem icon={Clock} />
          </Pressable>
          <Pressable onPress={() => router.push('/(tabs)/settings')}>
            <TabBarItem icon={Settings} />
          </Pressable>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 32,
    paddingVertical: 24,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: Colors.white,
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 24,
  },
  createButton: {
    width: '100%',
    maxWidth: 280,
  },
  bottomTabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
});
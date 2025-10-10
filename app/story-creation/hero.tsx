import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Colors } from '@/constants/colors';

export default function HeroScreen() {
  const [selectedType, setSelectedType] = useState<'boy' | 'girl' | 'animal' | null>(null);
  const [heroName, setHeroName] = useState('');
  const [storyTitle, setStoryTitle] = useState('');

  const heroTypes = [
    { type: 'boy' as const, emoji: '👦', label: 'Boy' },
    { type: 'girl' as const, emoji: '👧', label: 'Girl' },
    { type: 'animal' as const, emoji: '🦊', label: 'Animal' },
  ];

  const handleNext = () => {
    if (selectedType && heroName && storyTitle) {
      router.push({
        pathname: '/story-creation/mode',
        params: { 
          heroType: selectedType, 
          heroName,
          storyTitle 
        },
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <ArrowLeft color={Colors.text} size={24} />
        </Pressable>
        <Text style={styles.headerTitle}>Choose Your Hero</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Who will be the star of your story?</Text>
        
        <View style={styles.heroTypes}>
          {heroTypes.map((hero) => (
            <Pressable
              key={hero.type}
              style={[
                styles.heroType,
                selectedType === hero.type && styles.heroTypeSelected,
              ]}
              onPress={() => setSelectedType(hero.type)}
            >
              <Text style={styles.heroEmoji}>{hero.emoji}</Text>
              <Text style={styles.heroLabel}>{hero.label}</Text>
            </Pressable>
          ))}
        </View>

        <Input
          label="Story Title"
          value={storyTitle}
          onChangeText={setStoryTitle}
          placeholder="Enter your story title"
          style={styles.input}
        />

        <Input
          label="What's their name?"
          value={heroName}
          onChangeText={setHeroName}
          placeholder="Enter hero name"
          style={styles.input}
        />

        <Button
          title="Next Step"
          onPress={handleNext}
          disabled={!selectedType || !heroName || !storyTitle}
          size="large"
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 40,
  },
  heroTypes: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 40,
  },
  heroType: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.border,
    minWidth: 100,
  },
  heroTypeSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.cream,
  },
  heroEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  heroLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  input: {
    marginBottom: 20,
  },
  button: {
    width: '100%',
    marginTop: 'auto',
    marginBottom: 40,
  },
});
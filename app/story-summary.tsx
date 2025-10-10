import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Play, Heart, Share } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/Button';
import { useStories } from '@/hooks/useStories';
import { Colors } from '@/constants/colors';

export default function StorySummaryScreen() {
  const { id } = useLocalSearchParams();
  const { stories, toggleFavorite } = useStories();
  
  // Mock story for demo - in real app, find by ID
  const story = stories[0] || {
    id: '1',
    title: 'The Forest\'s Whisper',
    summary: 'Luna discovers a magical forest where animals can talk and trees hold ancient secrets. Join her on an enchanting adventure filled with friendship, courage, and wonder as she learns that the greatest magic comes from believing in yourself.',
    content: 'Once upon a time, in a forest filled with wonder...',
    tags: ['Adventure', 'Nature', 'Ages 5+'],
    hero: {
      name: 'Luna',
      type: 'girl' as const,
      appearance: {
        hairColor: '#8B4513',
        skinColor: '#FDBCB4',
        clothingColor: '#4CAF50',
      },
    },
    isFavorite: false,
    illustration: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
    createdAt: new Date().toISOString(),
    userId: '1',
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <ArrowLeft color={Colors.text} size={24} />
        </Pressable>
        <View style={styles.headerActions}>
          <Pressable onPress={() => toggleFavorite(story.id)}>
            <Heart
              color={story.isFavorite ? Colors.error : Colors.textLight}
              fill={story.isFavorite ? Colors.error : 'transparent'}
              size={24}
            />
          </Pressable>
          <Pressable style={styles.shareButton}>
            <Share color={Colors.textLight} size={24} />
          </Pressable>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Image source={{ uri: story.illustration }} style={styles.illustration} />
        
        <View style={styles.storyInfo}>
          <Text style={styles.title}>{story.title}</Text>
          
          <View style={styles.tags}>
            {story.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
          
          <Text style={styles.summary}>{story.summary}</Text>
          
          <View style={styles.audioSection}>
            <Pressable style={styles.playButton}>
              <Play color={Colors.white} size={24} fill={Colors.white} />
            </Pressable>
            <View style={styles.audioInfo}>
              <Text style={styles.audioTitle}>Listen to your story</Text>
              <Text style={styles.audioDuration}>Estimated 5 minutes</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Read Story"
          onPress={() => router.push(`/story-reader?storyId=${story.id}`)}
          size="large"
          style={styles.readButton}
        />
        <Button
          title="Create Another"
          onPress={() => router.push('/story-creation')}
          variant="outline"
          size="large"
          style={styles.createButton}
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
  headerActions: {
    flexDirection: 'row',
    gap: 16,
  },
  shareButton: {
    marginLeft: 8,
  },
  content: {
    flex: 1,
  },
  illustration: {
    width: '100%',
    height: 250,
  },
  storyInfo: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
    lineHeight: 36,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  tag: {
    backgroundColor: Colors.cream,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 14,
    color: Colors.secondary,
    fontWeight: '500',
  },
  summary: {
    fontSize: 16,
    color: Colors.textLight,
    lineHeight: 24,
    marginBottom: 32,
  },
  audioSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  playButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  audioInfo: {
    flex: 1,
  },
  audioTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  audioDuration: {
    fontSize: 14,
    color: Colors.textLight,
  },
  footer: {
    padding: 24,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 12,
  },
  readButton: {
    width: '100%',
  },
  createButton: {
    width: '100%',
  },
});
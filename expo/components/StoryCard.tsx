import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Heart, Clock } from 'lucide-react-native';
import { Story } from '@/types';
import { Colors } from '@/constants/colors';

interface StoryCardProps {
  story: Story;
  onPress: () => void;
  onToggleFavorite: () => void;
}

export function StoryCard({ story, onPress, onToggleFavorite }: StoryCardProps) {
  return (
    <Pressable style={styles.card} onPress={onPress} testID={`story-card-${story.id}`}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: story.illustration || story.image_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop' }}
          style={styles.image}
        />
        <Pressable 
          style={styles.favoriteButton} 
          onPress={onToggleFavorite}
          testID={`favorite-button-${story.id}`}
          accessibilityLabel={story.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart
            size={20}
            color={story.isFavorite ? Colors.error : Colors.white}
            fill={story.isFavorite ? Colors.error : 'transparent'}
          />
        </Pressable>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {story.title}
        </Text>
        
        <View style={styles.heroInfo}>
          <Text style={styles.heroName}>Hero: {story.hero_name}</Text>
          <View style={styles.readingTime}>
            <Clock size={14} color={Colors.textLight} />
            <Text style={styles.readingTimeText}>{story.reading_time} min</Text>
          </View>
        </View>
        
        <Text style={styles.summary} numberOfLines={2}>
          {story.summary}
        </Text>
        
        <View style={styles.tags}>
          {story.tags.slice(0, 2).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 20,
    padding: 8,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  heroInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  heroName: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  readingTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  readingTimeText: {
    fontSize: 12,
    color: Colors.textLight,
  },
  summary: {
    fontSize: 14,
    color: Colors.textLight,
    lineHeight: 20,
    marginBottom: 12,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: Colors.cream,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: Colors.secondary,
    fontWeight: '500',
  },
});
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Story } from '@/types';

const MOCK_STORIES: Story[] = [
  {
    id: '1',
    title: 'The Forest\'s Whisper',
    hero_name: 'Luna',
    hero_type: 'girl',
    image_url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
    reading_time: 5,
    summary: 'A magical adventure where Luna discovers talking animals in an enchanted forest.',
    content: 'Once upon a time, in a forest filled with wonder...',
    tags: ['Adventure', 'Nature', 'Ages 5+'],
    hero: {
      name: 'Luna',
      type: 'girl',
      appearance: {
        hairColor: '#8B4513',
        skinColor: '#FDBCB4',
        clothingColor: '#4CAF50',
      },
    },
    isFavorite: true,
    illustration: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    userId: '1',
  },
  {
    id: '2',
    title: 'The Brave Little Fox',
    hero_name: 'Rusty',
    hero_type: 'animal',
    image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    reading_time: 4,
    summary: 'Rusty the fox learns about courage while helping his forest friends.',
    content: 'In a cozy den beneath the old oak tree...',
    tags: ['Courage', 'Friendship', 'Ages 4+'],
    hero: {
      name: 'Rusty',
      type: 'animal',
      appearance: {
        hairColor: '#FF6B35',
        skinColor: '#FF6B35',
        clothingColor: '#2E8B57',
        animalType: 'fox',
      },
    },
    isFavorite: false,
    illustration: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    created_at: '2024-01-14T15:30:00Z',
    updated_at: '2024-01-14T15:30:00Z',
    userId: '1',
  },
];

export function useStories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [favorites, setFavorites] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    try {
      const storedStories = await AsyncStorage.getItem('stories');
      const parsedStories = storedStories ? JSON.parse(storedStories) : MOCK_STORIES;
      
      // Sort by creation date (newest first)
      const sortedStories = parsedStories.sort((a: Story, b: Story) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      
      setStories(sortedStories);
      setFavorites(sortedStories.filter((story: Story) => story.isFavorite));
    } catch (error) {
      console.error('Error loading stories:', error);
      setStories(MOCK_STORIES);
      setFavorites(MOCK_STORIES.filter(story => story.isFavorite));
    } finally {
      setIsLoading(false);
    }
  };

  const saveStory = async (storyData: Partial<Story>) => {
    const newStory: Story = {
      id: Date.now().toString(),
      title: storyData.title || 'Untitled Story',
      hero_name: storyData.hero_name || storyData.hero?.name || 'Hero',
      hero_type: storyData.hero_type || storyData.hero?.type || 'boy',
      image_url: storyData.image_url || storyData.illustration || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
      reading_time: storyData.reading_time || Math.floor(Math.random() * 5) + 3, // Random 3-7 minutes
      summary: storyData.summary || 'A wonderful adventure awaits in this magical tale...',
      content: storyData.content || 'Once upon a time...',
      tags: storyData.tags || ['Adventure', 'Magic', 'Ages 5+'],
      hero: storyData.hero || {
        name: storyData.hero_name || 'Hero',
        type: storyData.hero_type || 'boy',
        appearance: {
          hairColor: '#8B4513',
          skinColor: '#FDBCB4',
          clothingColor: '#4CAF50',
        },
      },
      isFavorite: false,
      illustration: storyData.illustration || storyData.image_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
      audioUrl: storyData.audioUrl,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      userId: '1',
      questionnaireAnswers: storyData.questionnaireAnswers,
      template_id: storyData.template_id,
      is_template_based: storyData.is_template_based || false,
    };

    // Add to the beginning of the array (newest first)
    const updatedStories = [newStory, ...stories];
    setStories(updatedStories);
    
    // Update favorites if needed
    setFavorites(updatedStories.filter(story => story.isFavorite));
    
    await AsyncStorage.setItem('stories', JSON.stringify(updatedStories));
    return newStory;
  };

  const toggleFavorite = async (storyId: string) => {
    const updatedStories = stories.map(story =>
      story.id === storyId ? { ...story, isFavorite: !story.isFavorite, updated_at: new Date().toISOString() } : story
    );
    
    setStories(updatedStories);
    setFavorites(updatedStories.filter(story => story.isFavorite));
    await AsyncStorage.setItem('stories', JSON.stringify(updatedStories));
  };

  const refreshStories = async () => {
    setIsLoading(true);
    await loadStories();
  };

  return {
    stories,
    favorites,
    isLoading,
    saveStory,
    toggleFavorite,
    refreshStories,
  };
}
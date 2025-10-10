import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Shuffle, Check } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/colors';

interface QuestionOption {
  id: string;
  label: string;
  emoji: string;
}

const QUESTIONS = [
  {
    id: 'topic',
    title: 'Quel sujet\npouvons-nous aborder ?',
    subtitle: 'Plusieurs choix possible',
    options: [
      { id: 'courage', label: 'Le courage', emoji: '🏆' },
      { id: 'nature', label: 'La nature', emoji: '🌍' },
      { id: 'friendship', label: "L'amitié", emoji: '🤝' },
      { id: 'solitude', label: 'La solitude', emoji: '☁️' },
      { id: 'fear', label: 'La peur', emoji: '👻' },
      { id: 'curiosity', label: 'La curiosité', emoji: '🔍' },
    ],
  },
  {
    id: 'animal',
    title: 'Quel animal\nrencontre {heroName} ?',
    subtitle: 'Plusieurs choix possible',
    options: [
      { id: 'bear', label: 'Un ours', emoji: '🐻' },
      { id: 'wolf', label: 'Un loup', emoji: '🐺' },
      { id: 'monkey', label: 'Un singe', emoji: '🐵' },
      { id: 'lion', label: 'Un lion', emoji: '🦁' },
      { id: 'deer', label: 'Un cerf', emoji: '🦌' },
      { id: 'parrot', label: 'Un perroquet', emoji: '🦜' },
    ],
  },
  {
    id: 'location',
    title: 'Où se déroule\nl\'histoire de {heroName} ?',
    subtitle: 'Plusieurs choix possible',
    options: [
      { id: 'city', label: 'En ville', emoji: '🏙️' },
      { id: 'forest', label: 'Dans la forêt', emoji: '🌲' },
      { id: 'desert', label: 'Dans un désert', emoji: '🏜️' },
      { id: 'castle', label: 'Dans un château', emoji: '🏰' },
      { id: 'planet', label: 'Autre planète', emoji: '🪐' },
      { id: 'paris', label: 'À Paris', emoji: '🗼' },
    ],
  },
];

export default function QuestionnaireScreen() {
  const { heroType, heroName, storyTitle, mode } = useLocalSearchParams();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const question = QUESTIONS[currentQuestion];
  const questionTitle = question.title.replace('{heroName}', heroName as string);

  const toggleOption = (optionId: string) => {
    setSelectedOptions(prev => 
      prev.includes(optionId) 
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    );
  };

  const shuffleOptions = () => {
    // In a real app, this would fetch new random options
    // For now, we'll just shuffle the existing ones
    const shuffled = [...question.options].sort(() => Math.random() - 0.5);
    question.options = shuffled;
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      const prevQuestionId = QUESTIONS[currentQuestion - 1].id;
      setSelectedOptions(answers[prevQuestionId] || []);
    } else {
      router.back();
    }
  };

  const handleConfirm = () => {
    if (selectedOptions.length === 0) return;

    const newAnswers = {
      ...answers,
      [question.id]: selectedOptions,
    };
    setAnswers(newAnswers);

    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      const nextQuestionId = QUESTIONS[currentQuestion + 1].id;
      setSelectedOptions(newAnswers[nextQuestionId] || []);
    } else {
      // All questions completed, navigate to loading screen
      const hero = {
        name: heroName,
        type: heroType,
        appearance: {
          hairColor: '#8B4513',
          skinColor: '#FDBCB4',
          clothingColor: '#4CAF50',
        },
      };

      router.push({
        pathname: '/story-loading',
        params: { 
          hero: JSON.stringify(hero),
          storyTitle,
          mode,
          questionnaireAnswers: JSON.stringify(newAnswers),
        },
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{questionTitle}</Text>
        <Text style={styles.subtitle}>{question.subtitle}</Text>
        
        <View style={styles.optionsGrid}>
          {question.options.map((option) => (
            <Pressable
              key={option.id}
              style={[
                styles.optionCard,
                selectedOptions.includes(option.id) && styles.optionCardSelected,
              ]}
              onPress={() => toggleOption(option.id)}
            >
              <Text style={styles.optionEmoji}>{option.emoji}</Text>
              <Text style={styles.optionLabel}>{option.label}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <View style={styles.bottomControls}>
        <Pressable style={styles.controlButton} onPress={handleBack}>
          <ArrowLeft color={Colors.white} size={24} />
        </Pressable>

        <Pressable style={styles.shuffleButton} onPress={shuffleOptions}>
          <Shuffle color={Colors.secondary} size={20} />
          <Text style={styles.shuffleText}>Propose en d'autres</Text>
        </Pressable>

        <Pressable 
          style={[
            styles.controlButton,
            selectedOptions.length === 0 && styles.controlButtonDisabled,
          ]} 
          onPress={handleConfirm}
          disabled={selectedOptions.length === 0}
        >
          <Check color={Colors.white} size={24} />
        </Pressable>
      </View>

      {/* Bottom Tab Bar */}
      <View style={styles.bottomTabBar}>
        <View style={styles.tabItem}>
          <View style={styles.tabIcon} />
        </View>
        <View style={styles.tabItem}>
          <View style={styles.tabIcon} />
        </View>
        <View style={styles.tabItemCenter}>
          <View style={styles.centerButton}>
            <Text style={styles.centerButtonIcon}>+</Text>
          </View>
        </View>
        <View style={styles.tabItem}>
          <View style={styles.tabIcon} />
        </View>
        <View style={styles.tabItem}>
          <View style={styles.tabIcon} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9F0',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 120,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: 40,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  optionCard: {
    width: '47%',
    aspectRatio: 1.2,
    backgroundColor: Colors.secondary,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginBottom: 16,
  },
  optionCardSelected: {
    backgroundColor: Colors.darkBrown,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  optionEmoji: {
    fontSize: 32,
    marginBottom: 12,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.white,
    textAlign: 'center',
  },
  bottomControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#FFF9F0',
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlButtonDisabled: {
    opacity: 0.5,
  },
  shuffleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: Colors.secondary,
    backgroundColor: Colors.white,
    gap: 8,
  },
  shuffleText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.secondary,
  },
  bottomTabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.secondary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 80,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  tabItemCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -30,
  },
  tabIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  centerButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#D2691E',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#CD853F',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  centerButtonIcon: {
    fontSize: 28,
    color: Colors.white,
    fontWeight: '300',
  },
});
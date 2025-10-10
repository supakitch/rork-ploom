import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, MessageCircle, FileText, Palette } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/Button';
import { Colors } from '@/constants/colors';

export default function ModeScreen() {
  const { heroType, heroName, storyTitle } = useLocalSearchParams();
  const [selectedMode, setSelectedMode] = useState<'dialogue' | 'questionnaire' | 'customization' | null>(null);

  const modes = [
    {
      type: 'dialogue' as const,
      icon: MessageCircle,
      title: 'Dialogue',
      description: 'Chat with Ploomer to create your story naturally',
    },
    {
      type: 'questionnaire' as const,
      icon: FileText,
      title: 'Questionnaire',
      description: 'Answer guided questions to build your story',
    },
    {
      type: 'customization' as const,
      icon: Palette,
      title: 'Customization',
      description: 'Choose from story templates and customize them',
    },
  ];

  const handleNext = () => {
    if (selectedMode) {
      if (selectedMode === 'questionnaire') {
        router.push({
          pathname: '/story-creation/questionnaire',
          params: { heroType, heroName, storyTitle, mode: selectedMode },
        });
      } else if (selectedMode === 'customization') {
        router.push({
          pathname: '/story-creation/templates',
          params: { heroType, heroName, storyTitle, mode: selectedMode },
        });
      } else {
        router.push({
          pathname: '/story-creation/appearance',
          params: { heroType, heroName, storyTitle, mode: selectedMode },
        });
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <ArrowLeft color={Colors.text} size={24} />
        </Pressable>
        <Text style={styles.headerTitle}>Creation Mode</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>How would you like to create "{storyTitle}"?</Text>
        
        <View style={styles.modes}>
          {modes.map((mode) => {
            const IconComponent = mode.icon;
            return (
              <Pressable
                key={mode.type}
                style={[
                  styles.mode,
                  selectedMode === mode.type && styles.modeSelected,
                ]}
                onPress={() => setSelectedMode(mode.type)}
              >
                <View style={styles.modeIcon}>
                  <IconComponent 
                    color={selectedMode === mode.type ? Colors.primary : Colors.textLight} 
                    size={24} 
                  />
                </View>
                <View style={styles.modeContent}>
                  <Text style={styles.modeTitle}>{mode.title}</Text>
                  <Text style={styles.modeDescription}>{mode.description}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        <Button
          title="Next Step"
          onPress={handleNext}
          disabled={!selectedMode}
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
    lineHeight: 32,
  },
  modes: {
    marginBottom: 40,
  },
  mode: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  modeSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.cream,
  },
  modeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  modeContent: {
    flex: 1,
  },
  modeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  modeDescription: {
    fontSize: 14,
    color: Colors.textLight,
    lineHeight: 20,
  },
  button: {
    width: '100%',
    marginTop: 'auto',
    marginBottom: 40,
  },
});
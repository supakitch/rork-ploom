import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/Button';
import { Colors } from '@/constants/colors';

export default function AppearanceScreen() {
  const { heroType, heroName, storyTitle, mode } = useLocalSearchParams();
  const [hairColor, setHairColor] = useState('#8B4513');
  const [skinColor, setSkinColor] = useState('#FDBCB4');
  const [clothingColor, setClothingColor] = useState('#4CAF50');

  const hairColors = ['#8B4513', '#FFD700', '#000000', '#FF6B35', '#9B7BC7'];
  const skinColors = ['#FDBCB4', '#F1C27D', '#E0AC69', '#C68642', '#8D5524'];
  const clothingColors = ['#4CAF50', '#2196F3', '#FF9800', '#E91E63', '#9C27B0'];

  const ColorPicker = ({ title, colors, selectedColor, onSelect }: any) => (
    <View style={styles.colorSection}>
      <Text style={styles.colorTitle}>{title}</Text>
      <View style={styles.colorRow}>
        {colors.map((color: string) => (
          <Pressable
            key={color}
            style={[
              styles.colorOption,
              { backgroundColor: color },
              selectedColor === color && styles.colorSelected,
            ]}
            onPress={() => onSelect(color)}
          />
        ))}
      </View>
    </View>
  );

  const handleFinish = () => {
    const hero = {
      name: heroName,
      type: heroType,
      appearance: {
        hairColor,
        skinColor,
        clothingColor,
        ...(heroType === 'animal' && { animalType: 'fox' }),
      },
    };

    router.push({
      pathname: '/chat',
      params: { 
        hero: JSON.stringify(hero),
        storyTitle,
        mode,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <ArrowLeft color={Colors.text} size={24} />
        </Pressable>
        <Text style={styles.headerTitle}>Customize Appearance</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.title}>Let's make {heroName} unique!</Text>
        
        <View style={styles.preview}>
          <View style={styles.avatar}>
            <Text style={styles.avatarEmoji}>
              {heroType === 'boy' ? '👦' : heroType === 'girl' ? '👧' : '🦊'}
            </Text>
          </View>
          <Text style={styles.heroName}>{heroName}</Text>
          <Text style={styles.storyTitle}>"{storyTitle}"</Text>
        </View>

        {heroType !== 'animal' && (
          <ColorPicker
            title="Hair Color"
            colors={hairColors}
            selectedColor={hairColor}
            onSelect={setHairColor}
          />
        )}

        <ColorPicker
          title={heroType === 'animal' ? 'Fur Color' : 'Skin Color'}
          colors={skinColors}
          selectedColor={skinColor}
          onSelect={setSkinColor}
        />

        <ColorPicker
          title="Clothing Color"
          colors={clothingColors}
          selectedColor={clothingColor}
          onSelect={setClothingColor}
        />

        <Button
          title="Begin My Adventure"
          onPress={handleFinish}
          size="large"
          style={styles.button}
        />
      </ScrollView>
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
    marginBottom: 32,
  },
  preview: {
    alignItems: 'center',
    marginBottom: 40,
    padding: 24,
    backgroundColor: Colors.white,
    borderRadius: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarEmoji: {
    fontSize: 40,
  },
  heroName: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  storyTitle: {
    fontSize: 16,
    color: Colors.textLight,
    fontStyle: 'italic',
  },
  colorSection: {
    marginBottom: 32,
  },
  colorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  colorRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  colorOption: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  colorSelected: {
    borderColor: Colors.primary,
  },
  button: {
    width: '100%',
    marginBottom: 40,
  },
});
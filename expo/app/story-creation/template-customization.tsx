import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/Button';
import { Colors } from '@/constants/colors';

export default function TemplateCustomizationScreen() {
  const { 
    heroType, 
    heroName, 
    storyTitle, 
    mode, 
    templateId, 
    templateTitle, 
    templateCover 
  } = useLocalSearchParams();
  
  const [customTitle, setCustomTitle] = useState(templateTitle as string || storyTitle as string || '');
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

  const handleGenerate = () => {
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
      pathname: '/story-loading',
      params: { 
        hero: JSON.stringify(hero),
        storyTitle: customTitle,
        mode,
        templateId,
        isTemplateBased: 'true',
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <ArrowLeft color={Colors.text} size={24} />
        </Pressable>
        <Text style={styles.headerTitle}>Personnaliser</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Template Preview */}
        <View style={styles.templatePreview}>
          <Image 
            source={{ uri: templateCover as string }} 
            style={styles.templateImage}
          />
          <View style={styles.heroOverlay}>
            <View style={styles.heroAvatar}>
              <Text style={styles.heroEmoji}>
                {heroType === 'boy' ? '👦' : heroType === 'girl' ? '👧' : '🦊'}
              </Text>
            </View>
            <Text style={styles.heroName}>{heroName}</Text>
          </View>
        </View>

        {/* Story Title */}
        <View style={styles.titleSection}>
          <Text style={styles.sectionTitle}>Titre de l'histoire</Text>
          <TextInput
            style={styles.titleInput}
            value={customTitle}
            onChangeText={setCustomTitle}
            placeholder="Entrez le titre de votre histoire"
            placeholderTextColor={Colors.textLight}
          />
        </View>

        {/* Appearance Customization */}
        <Text style={styles.sectionTitle}>Apparence de {heroName}</Text>
        
        {heroType !== 'animal' && (
          <ColorPicker
            title="Couleur des cheveux"
            colors={hairColors}
            selectedColor={hairColor}
            onSelect={setHairColor}
          />
        )}

        <ColorPicker
          title={heroType === 'animal' ? 'Couleur de la fourrure' : 'Couleur de la peau'}
          colors={skinColors}
          selectedColor={skinColor}
          onSelect={setSkinColor}
        />

        <ColorPicker
          title="Couleur des vêtements"
          colors={clothingColors}
          selectedColor={clothingColor}
          onSelect={setClothingColor}
        />

        <Button
          title="Commencer Mon Aventure"
          onPress={handleGenerate}
          size="large"
          style={styles.generateButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9F0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#FFF9F0',
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
    paddingTop: 20,
  },
  templatePreview: {
    position: 'relative',
    marginBottom: 32,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  templateImage: {
    width: '100%',
    height: 200,
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    alignItems: 'center',
  },
  heroAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  heroEmoji: {
    fontSize: 30,
  },
  heroName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  titleSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  titleInput: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.text,
  },
  colorSection: {
    marginBottom: 24,
  },
  colorTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 12,
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
  generateButton: {
    width: '100%',
    marginBottom: 40,
    marginTop: 20,
  },
});
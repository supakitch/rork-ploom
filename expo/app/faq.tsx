import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, ChevronDown } from 'lucide-react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    id: '1',
    question: "Qu'est-ce que Ploom ?",
    answer: "Ploom est une application d'histoires personnalisées pour enfants, qui utilise une IA pour transformer vos idées en contes féeriques interactifs.",
  },
  {
    id: '2',
    question: "Comment fonctionne Ploom ?",
    answer: "Choisissez votre mode (Dialogue, Questionnaire, Personnalisation ou Template), donnez quelques informations (héros, univers, titre), puis Ploom génère et raconte une histoire unique.",
  },
  {
    id: '3',
    question: "Ploom est adapté à tous les âges ?",
    answer: "Oui. Les histoires sont calibrées pour différents groupes d'âge (5-8, 9-12, etc.) et le contenu reste toujours bienveillant et approprié.",
  },
  {
    id: '4',
    question: "Y a-t-il une période d'essai ?",
    answer: "Vous bénéficiez de 7 jours d'essai gratuit avec accès illimité à toutes les histoires avant de choisir un abonnement.",
  },
  {
    id: '5',
    question: "Quel est le prix de l'abonnement ?",
    answer: "Mensuel : 6,99 € / mois\nAnnuel : 59,99 € / an (2 mois offerts)",
  },
];

export default function FAQScreen() {
  console.log('=== FAQ Screen Rendered ===');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpanded = (id: string) => {
    console.log('Toggle FAQ item:', id);
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <Pressable 
            onPress={() => {
              console.log('Back button pressed from FAQ');
              router.back();
            }} 
            style={styles.backButton}
            testID="faq-back-button"
          >
            <ArrowLeft color={Colors.white} size={24} />
          </Pressable>
          <Text style={styles.headerTitle}>Foire aux questions</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          testID="faq-scroll-view"
        >
          {FAQ_DATA.map((item) => {
            const isExpanded = expandedId === item.id;
            
            return (
              <View key={item.id} style={styles.card}>
                <Pressable
                  style={styles.cardHeader}
                  onPress={() => toggleExpanded(item.id)}
                  accessibilityRole="button"
                  accessibilityLabel={`Toggle answer for: ${item.question}`}
                  testID={`faq-item-${item.id}`}
                >
                  <Text style={styles.question}>{item.question}</Text>
                  <View style={[
                    styles.chevronContainer,
                    isExpanded && styles.chevronRotated
                  ]}>
                    <ChevronDown color={Colors.textLight} size={20} />
                  </View>
                </Pressable>
                
                {isExpanded && (
                  <View style={styles.answerContainer}>
                    <Text style={styles.answer}>{item.answer}</Text>
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CE94FF',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.white,
    textAlign: 'center' as const,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  contentContainer: {
    paddingTop: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden' as const,
  },
  cardHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  question: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
    marginRight: 12,
    lineHeight: 24,
  },
  chevronContainer: {
    transform: [{ rotate: '0deg' }],
  },
  chevronRotated: {
    transform: [{ rotate: '180deg' }],
  },
  answerContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 0,
  },
  answer: {
    fontSize: 16,
    color: '#3E1F13',
    lineHeight: 24,
  },
});

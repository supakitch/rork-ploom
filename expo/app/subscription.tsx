import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Lock, Bell, X } from 'lucide-react-native';
import { router } from 'expo-router';
import { Button } from '@/components/Button';
import { Logo } from '@/components/Logo';
import { Colors } from '@/constants/colors';

export default function SubscriptionScreen() {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('annual');

  const timelineSteps = [
    {
      icon: Lock,
      title: 'Période d\'essai',
      subtitle: 'Profitez de 7 jours',
      isActive: true,
    },
    {
      icon: Bell,
      title: 'Jour 5 : Rappel',
      subtitle: 'Profitez de 7 jours',
      isActive: false,
    },
    {
      icon: X,
      title: 'Jour 7 : Fin de l\'essai',
      subtitle: 'Profitez de 7 jours',
      isActive: false,
    },
  ];

  const Sparkle = ({ style }: { style: any }) => (
    <Text style={[styles.sparkle, style]}>✨</Text>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#B19CD9', '#DDA0DD', '#E6E6FA']} style={styles.gradient}>
        {/* Sparkles */}
        <Sparkle style={{ position: 'absolute', top: 100, left: 50, fontSize: 16 }} />
        <Sparkle style={{ position: 'absolute', top: 150, right: 80, fontSize: 12 }} />
        <Sparkle style={{ position: 'absolute', top: 200, left: 30, fontSize: 14 }} />
        <Sparkle style={{ position: 'absolute', top: 300, right: 40, fontSize: 18 }} />
        <Sparkle style={{ position: 'absolute', top: 400, left: 70, fontSize: 10 }} />
        <Sparkle style={{ position: 'absolute', top: 500, right: 60, fontSize: 16 }} />

        <View style={styles.header}>
          <Pressable onPress={() => router.back()}>
            <ArrowLeft color={Colors.white} size={24} />
          </Pressable>
          <Pressable>
            <Text style={styles.restoreButton}>Restaurer</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.logoSection}>
            <View style={styles.logoContainer}>
              <Logo width={140} height={40} color={Colors.white} />
              <View style={styles.proBadge}>
                <Text style={styles.proText}>PRO</Text>
              </View>
            </View>
            <Text style={styles.title}>Contez à l'infini !</Text>
            <Text style={styles.subtitle}>Là où chaque mot{'\n'}crée un univers...</Text>
          </View>

          <View style={styles.timeline}>
            {timelineSteps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <View key={index} style={styles.timelineItem}>
                  <View style={styles.timelineLeft}>
                    <View style={[
                      styles.timelineIcon,
                      step.isActive ? styles.timelineIconActive : styles.timelineIconInactive
                    ]}>
                      <IconComponent 
                        color={step.isActive ? Colors.white : Colors.white} 
                        size={16} 
                      />
                    </View>
                    {index < timelineSteps.length - 1 && (
                      <View style={styles.timelineLine} />
                    )}
                  </View>
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineTitle}>{step.title}</Text>
                    <Text style={styles.timelineSubtitle}>{step.subtitle}</Text>
                  </View>
                </View>
              );
            })}
          </View>

          <View style={styles.pricingSection}>
            <View style={styles.pricingOptions}>
              <Pressable
                style={[
                  styles.pricingOption,
                  selectedPlan === 'annual' && styles.pricingOptionSelected
                ]}
                onPress={() => setSelectedPlan('annual')}
              >
                <Text style={styles.pricingLabel}>Annuel</Text>
                <Text style={styles.pricingPrice}>42€</Text>
              </Pressable>

              <Pressable
                style={[
                  styles.pricingOption,
                  selectedPlan === 'monthly' && styles.pricingOptionSelected
                ]}
                onPress={() => setSelectedPlan('monthly')}
              >
                <Text style={styles.pricingLabel}>Mensuel</Text>
                <Text style={styles.pricingPrice}>5€</Text>
              </Pressable>
            </View>

            <Pressable style={styles.startTrialButton}>
              <Text style={styles.startTrialText}>Commencez la période d'essai</Text>
            </Pressable>

            <Text style={styles.cancelText}>Annuler à tout moment</Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  sparkle: {
    color: Colors.white,
    opacity: 0.8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  restoreButton: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.white,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  logoSection: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 60,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  proBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 12,
  },
  proText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.white,
    letterSpacing: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.white,
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 22,
  },
  timeline: {
    marginBottom: 60,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: 20,
  },
  timelineIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineIconActive: {
    backgroundColor: Colors.cream,
  },
  timelineIconInactive: {
    backgroundColor: Colors.secondary,
  },
  timelineLine: {
    width: 2,
    height: 40,
    backgroundColor: Colors.secondary,
    marginTop: 8,
  },
  timelineContent: {
    flex: 1,
    justifyContent: 'center',
  },
  timelineTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.white,
    marginBottom: 4,
  },
  timelineSubtitle: {
    fontSize: 14,
    color: Colors.white,
    opacity: 0.8,
  },
  pricingSection: {
    alignItems: 'center',
  },
  pricingOptions: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  pricingOption: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: 32,
    paddingVertical: 20,
    borderRadius: 25,
    alignItems: 'center',
    minWidth: 120,
  },
  pricingOptionSelected: {
    backgroundColor: Colors.darkBrown,
  },
  pricingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.white,
    marginBottom: 4,
  },
  pricingPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.white,
  },
  startTrialButton: {
    backgroundColor: Colors.cream,
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 25,
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
  },
  startTrialText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.secondary,
  },
  cancelText: {
    fontSize: 14,
    color: Colors.white,
    opacity: 0.8,
  },
});
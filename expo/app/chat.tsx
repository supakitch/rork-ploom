import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Send } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ApiService } from '@/services/api';
import { ChatMessage } from '@/types';
import { useStories } from '@/hooks/useStories';
import { Colors } from '@/constants/colors';

export default function ChatScreen() {
  const { 
    hero: heroString, 
    storyTitle, 
    mode, 
    questionnaireAnswers,
    templateId,
    isTemplateBased 
  } = useLocalSearchParams();
  const hero = heroString ? JSON.parse(heroString as string) : null;
  const answers = questionnaireAnswers ? JSON.parse(questionnaireAnswers as string) : null;
  const { saveStory } = useStories();
  
  const getInitialMessage = () => {
    if (mode === 'questionnaire' && answers) {
      const topicText = answers.topic ? `exploring themes of ${answers.topic.join(', ')}` : '';
      const animalText = answers.animal ? `meeting ${answers.animal.join(', ')}` : '';
      const locationText = answers.location ? `in ${answers.location.join(', ')}` : '';
      
      return `Hi! I'm Ploomer, your magical story companion! 🌸 Based on your choices, I'm excited to create "${storyTitle}" with ${hero?.name} ${topicText} ${animalText} ${locationText}! Let me craft this adventure for you...`;
    }
    
    if (mode === 'customization' && templateId) {
      return `Hi! I'm Ploomer, your magical story companion! 🌸 I'm excited to help you create "${storyTitle}" using your chosen template with ${hero?.name}! Let me craft this personalized adventure for you...`;
    }
    
    return `Hi! I'm Ploomer, your magical story companion! 🌸 I'm so excited to help you create "${storyTitle}" with ${hero?.name}! Tell me, what kind of adventure would you like to create together?`;
  };
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: getInitialMessage(),
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Auto-generate story if coming from questionnaire or template customization
  useEffect(() => {
    if ((mode === 'questionnaire' && answers) || (mode === 'customization' && templateId)) {
      // Auto-generate the story after a short delay
      const timer = setTimeout(() => {
        handleGenerate();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [mode, answers, templateId]);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      let systemPrompt = `You are Ploomer, a magical storytelling companion for children. You help create personalized stories titled "${storyTitle}" featuring ${hero?.name}, a ${hero?.type}. Keep responses engaging, age-appropriate, and encourage creativity. Ask follow-up questions to develop the story.`;
      
      if (mode === 'questionnaire' && answers) {
        systemPrompt += ` The user has chosen these story elements: topics (${answers.topic?.join(', ') || 'none'}), animals (${answers.animal?.join(', ') || 'none'}), locations (${answers.location?.join(', ') || 'none'}). Incorporate these elements naturally into the story development.`;
      }

      if (mode === 'customization' && templateId) {
        systemPrompt += ` The user has chosen a story template (ID: ${templateId}). Create a story that follows the template's structure while incorporating the user's customizations.`;
      }

      const response = await ApiService.generateStory([
        {
          role: 'system',
          content: systemPrompt,
        },
        ...messages.map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
        })),
        {
          role: 'user',
          content: inputText,
        },
      ]);

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.completion,
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm having trouble connecting right now. Let's try again!",
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    
    try {
      // Generate story content from chat messages
      const storyContent = messages
        .filter(msg => msg.role === 'assistant')
        .map(msg => msg.content)
        .join('\n\n');

      // Generate story summary
      let summaryPrompt = `Create a brief, engaging summary (2-3 sentences) for this children's story. Make it sound magical and appealing to parents and children.`;
      
      if (mode === 'questionnaire' && answers) {
        summaryPrompt += ` The story incorporates these elements: ${answers.topic?.join(', ') || ''}, ${answers.animal?.join(', ') || ''}, ${answers.location?.join(', ') || ''}.`;
      }

      if (mode === 'customization' && templateId) {
        summaryPrompt += ` The story is based on template ID: ${templateId}.`;
      }

      const summaryResponse = await ApiService.generateStory([
        {
          role: 'system',
          content: summaryPrompt,
        },
        {
          role: 'user',
          content: `Story title: "${storyTitle}"
Hero: ${hero?.name} (${hero?.type})
Story content: ${storyContent}`,
        },
      ]);

      // Create the story data
      const storyData = {
        title: storyTitle as string,
        hero_name: hero?.name || 'Hero',
        hero_type: hero?.type || 'boy',
        summary: summaryResponse.completion || `Join ${hero?.name} on a magical adventure in "${storyTitle}". A wonderful tale of courage, friendship, and discovery awaits!`,
        content: storyContent || `Once upon a time, ${hero?.name} embarked on an incredible adventure...`,
        tags: ['Adventure', 'AI Generated', `Ages 5+`],
        reading_time: Math.max(3, Math.ceil(storyContent.length / 200)), // Estimate reading time
        hero: hero,
        illustration: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000)}?w=400&h=300&fit=crop&auto=format`, // Random illustration
        questionnaireAnswers: answers,
        template_id: templateId as string,
        is_template_based: isTemplateBased === 'true',
      };

      // Save the story
      const newStory = await saveStory(storyData);
      
      // Navigate to story reader if coming from questionnaire or template, otherwise go to home
      if ((mode === 'questionnaire' && answers) || (mode === 'customization' && templateId)) {
        router.replace(`/story-reader?storyId=${newStory.id}`);
      } else {
        router.replace('/(tabs)');
      }
      
    } catch (error) {
      console.error('Error generating story:', error);
      
      // Fallback: save a basic story even if AI generation fails
      const fallbackStoryData = {
        title: storyTitle as string,
        hero_name: hero?.name || 'Hero',
        hero_type: hero?.type || 'boy',
        summary: `Join ${hero?.name} on a magical adventure in "${storyTitle}". A wonderful tale of courage, friendship, and discovery awaits!`,
        content: `Once upon a time, there was a ${hero?.type} named ${hero?.name} who lived in a magical world. ${hero?.name} was brave and kind, always ready for adventure. One day, an incredible journey began that would change everything...`,
        tags: ['Adventure', 'Magic', 'Ages 5+'],
        reading_time: 4,
        hero: hero,
        illustration: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
        questionnaireAnswers: answers,
        template_id: templateId as string,
        is_template_based: isTemplateBased === 'true',
      };
      
      const newStory = await saveStory(fallbackStoryData);
      
      // Navigate to story reader if coming from questionnaire or template, otherwise go to home
      if ((mode === 'questionnaire' && answers) || (mode === 'customization' && templateId)) {
        router.replace(`/story-reader?storyId=${newStory.id}`);
      } else {
        router.replace('/(tabs)');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const MessageBubble = ({ message }: { message: ChatMessage }) => (
    <View style={[
      styles.messageBubble,
      message.role === 'user' ? styles.userBubble : styles.aiBubble,
    ]}>
      <Text style={[
        styles.messageText,
        message.role === 'user' ? styles.userText : styles.aiText,
      ]}>
        {message.content}
      </Text>
    </View>
  );

  // Hide input and generate button if in questionnaire or template mode (auto-generating)
  const isAutoGeneratingMode = (mode === 'questionnaire' && answers) || (mode === 'customization' && templateId);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <ArrowLeft color={Colors.text} size={24} />
        </Pressable>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Chat with Ploomer</Text>
          <Text style={styles.headerSubtitle}>Creating "{storyTitle}"</Text>
        </View>
        {!isAutoGeneratingMode && (
          <Pressable onPress={handleGenerate} disabled={isGenerating}>
            <Text style={[styles.generateButton, isGenerating && styles.generateButtonDisabled]}>
              {isGenerating ? 'Creating...' : 'Generate'}
            </Text>
          </Pressable>
        )}
      </View>

      <KeyboardAvoidingView 
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {(isLoading || isGenerating) && (
            <View style={[styles.messageBubble, styles.aiBubble]}>
              <Text style={styles.loadingText}>
                {isGenerating ? 'Creating your magical story...' : 'Ploomer is thinking...'}
              </Text>
            </View>
          )}
        </ScrollView>

        {!isAutoGeneratingMode && (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type your message..."
              placeholderTextColor={Colors.textLight}
              multiline
              maxLength={500}
              editable={!isGenerating}
            />
            <Pressable
              style={[styles.sendButton, (!inputText.trim() || isLoading || isGenerating) && styles.sendButtonDisabled]}
              onPress={sendMessage}
              disabled={!inputText.trim() || isLoading || isGenerating}
            >
              <Send color={Colors.white} size={20} />
            </Pressable>
          </View>
        )}
      </KeyboardAvoidingView>
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
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textLight,
  },
  generateButton: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  generateButtonDisabled: {
    opacity: 0.5,
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.cream,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primary,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: Colors.text,
  },
  aiText: {
    color: Colors.white,
  },
  loadingText: {
    color: Colors.white,
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 12,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
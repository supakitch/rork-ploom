export interface User {
  id: string;
  fullName: string;
  username: string;
  email: string;
  avatar?: string;
  subscription: 'free' | 'premium';
  createdAt: string;
  updated_at?: string;
}

export interface Story {
  id: string;
  title: string;
  hero_name: string;
  hero_type: 'boy' | 'girl' | 'animal';
  image_url?: string;
  reading_time: number;
  summary: string;
  content: string;
  illustration?: string;
  tags: string[];
  hero: Hero;
  isFavorite: boolean;
  audioUrl?: string;
  created_at: string;
  updated_at: string;
  userId: string;
  questionnaireAnswers?: QuestionnaireAnswers;
  template_id?: string;
  is_template_based?: boolean;
}

export interface StoryTemplate {
  id: string;
  title: string;
  cover_image: string;
  category: string;
  description: string;
  tags: string[];
  isFavorite: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  estimated_time: number;
  illustration_style: string;
}

export interface Hero {
  name: string;
  type: 'boy' | 'girl' | 'animal';
  appearance: {
    hairColor: string;
    skinColor: string;
    clothingColor: string;
    animalType?: string;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface StoryCreationState {
  title?: string;
  hero?: Hero;
  mode?: 'dialogue' | 'questionnaire' | 'customization';
  chatMessages: ChatMessage[];
  isComplete: boolean;
  questionnaireAnswers?: QuestionnaireAnswers;
  template_id?: string;
}

export interface QuestionnaireAnswers {
  topic?: string[];
  animal?: string[];
  location?: string[];
}
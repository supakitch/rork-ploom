const API_BASE_URL = 'https://toolkit.rork.com';

export class ApiService {
  private static token: string | null = null;

  static setToken(token: string) {
    this.token = token;
  }

  static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  static async generateStory(messages: any[]): Promise<{ completion: string }> {
    return this.request('/text/llm/', {
      method: 'POST',
      body: JSON.stringify({ messages }),
    });
  }

  static async generateImage(prompt: string, size = '1024x1024'): Promise<{
    image: { base64Data: string; mimeType: string };
    size: string;
  }> {
    return this.request('/images/generate/', {
      method: 'POST',
      body: JSON.stringify({ prompt, size }),
    });
  }
}
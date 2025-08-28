class ChatApiService {
  private baseUrl = 'http://51.21.101.77/google-ads-new/api';
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`,
    };
  }

  async createSession(title: string) {
    const response = await fetch(`${this.baseUrl}/chat/sessions/create/`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ title }),
    });
    return response.json();
  }

  async sendMessage(message: string, sessionId: string) {
    const response = await fetch(`${this.baseUrl}/chat/message/`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ message, session_id: sessionId }),
    });
    return response.json();
  }

  async getSessions() {
    const response = await fetch(`${this.baseUrl}/chat/sessions/`, {
      headers: this.getHeaders(),
    });
    return response.json();
  }

  async getChatHistory(sessionId: string) {
    const response = await fetch(`${this.baseUrl}/chat/sessions/${sessionId}/`, {
      headers: this.getHeaders(),
    });
    return response.json();
  }

  async deleteSession(sessionId: string) {
    const response = await fetch(`${this.baseUrl}/chat/sessions/${sessionId}/delete/`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return response.json();
  }

  async getAccountSummary() {
    const response = await fetch(`${this.baseUrl}/account-summary/`, {
      headers: this.getHeaders(),
    });
    return response.json();
  }
}

export default ChatApiService;


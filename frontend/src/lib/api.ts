const API_BASE_URL = '/api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  role: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
    createdAt: string;
  };
  token: string;
  message: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Добавляем токен авторизации если он есть
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      console.log('Making API request:', { url, method: config.method, headers: config.headers });
      
      const response = await fetch(url, config);
      
      console.log('API response received:', { 
        url, 
        status: response.status, 
        statusText: response.statusText,
        ok: response.ok 
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ 
          message: 'Произошла ошибка сервера',
          statusCode: response.status 
        }));
        console.error('API request failed:', { url, status: response.status, error: errorData.message });
        
        // Если это ошибка авторизации, удаляем токен
        if (response.status === 401) {
          console.log('Unauthorized request, removing token');
          this.removeToken();
        }
        
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log('API response data:', responseData);
      return responseData;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Произошла неизвестная ошибка');
    }
  }

  // Методы аутентификации
  async login(data: LoginRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getProfile(): Promise<any> {
    return this.request('/auth/profile');
  }

  async verifyToken(): Promise<any> {
    return this.request('/auth/verify');
  }

  // Методы для работы с блоками курсов
  async getBlocks(courseId: string): Promise<any> {
    return this.request(`/blocks/course/${courseId}`);
  }

  async getBlock(id: string): Promise<any> {
    return this.request(`/blocks/${id}`);
  }

  async createBlock(data: any): Promise<any> {
    return this.request('/blocks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateBlock(id: string, data: any): Promise<any> {
    return this.request(`/blocks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteBlock(id: string): Promise<any> {
    return this.request(`/blocks/${id}`, {
      method: 'DELETE',
    });
  }

  async reorderBlocks(blocks: { id: string; position: number }[]): Promise<any> {
    return this.request('/blocks/reorder', {
      method: 'POST',
      body: JSON.stringify({ blocks }),
    });
  }

  // Методы для работы с уроками (через блоки)
  async createLesson(data: any): Promise<any> {
    return this.request('/blocks', {
      method: 'POST',
      body: JSON.stringify({
        title: data.title,
        content: data.content || '',
        type: data.type || 'LESSON',
        courseId: data.courseId,
        position: data.position || 0
      }),
    });
  }

  async updateLesson(id: string, data: any): Promise<any> {
    return this.request(`/blocks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        title: data.title,
        content: data.content,
        type: data.type
      }),
    });
  }

  async deleteLesson(id: string): Promise<any> {
    return this.request(`/blocks/${id}`, {
      method: 'DELETE',
    });
  }

  // Метод для создания модуля (создает блок с типом MODULE)
  async createModule(data: any): Promise<any> {
    return this.request('/blocks', {
      method: 'POST',
      body: JSON.stringify({
        title: data.title,
        courseId: data.courseId,
        type: 'MODULE',
        content: data.description || ''
      }),
    });
  }

  // Методы для работы с курсами
  async getCourses(): Promise<any[]> {
    return this.request('/courses');
  }

  async getCourse(id: string): Promise<any> {
    return this.request(`/courses/${id}`);
  }

  async createCourse(data: any): Promise<any> {
    return this.request('/courses', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCourse(id: string, data: any): Promise<any> {
    return this.request(`/courses/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteCourse(id: string): Promise<void> {
    return this.request(`/courses/${id}`, {
      method: 'DELETE',
    });
  }

  // Методы для работы с избранными курсами
  async addToFavorites(courseId: string): Promise<any> {
    return this.request(`/courses/${courseId}/favorite`, {
      method: 'POST',
    });
  }

  async removeFromFavorites(courseId: string): Promise<any> {
    return this.request(`/courses/${courseId}/favorite`, {
      method: 'DELETE',
    });
  }

  async getFavorites(): Promise<any[]> {
    return this.request('/courses/favorites/my');
  }

  // Методы для работы с начатыми курсами
  async markAsStarted(courseId: string): Promise<any> {
    return this.request(`/courses/${courseId}/start`, {
      method: 'POST',
    });
  }

  async getStartedCourses(): Promise<any[]> {
    return this.request('/courses/started/my');
  }

  // Методы для работы с дашбордом
  async getDashboardStats(): Promise<any> {
    return this.request('/dashboard/stats');
  }

  // Методы для работы с прогрессом
  async markLessonComplete(lessonId: string, courseId: string): Promise<any> {
    return this.request(`/progress/lesson/${lessonId}/complete`, {
      method: 'POST',
      body: JSON.stringify({ courseId }),
    });
  }

  async getCourseProgress(courseId: string): Promise<any> {
    return this.request(`/progress/course/${courseId}`);
  }

  async getMyProgress(): Promise<any[]> {
    return this.request('/progress/my');
  }

  async getCompletedLessons(courseId: string): Promise<any[]> {
    return this.request(`/progress/course/${courseId}/lessons`);
  }

  // Методы для работы с пользователями
  async getUsers(page?: number, limit?: number, search?: string, role?: string): Promise<any> {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    if (search) params.append('search', search);
    if (role) params.append('role', role);
    
    const queryString = params.toString();
    const endpoint = queryString ? `/users?${queryString}` : '/users';
    
    return this.request(endpoint);
  }

  // Методы для работы с аудитом
  async getAuditHistory(page?: number, limit?: number, entity?: string, action?: string, startDate?: string, endDate?: string): Promise<any> {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    if (entity) params.append('entity', entity);
    if (action) params.append('action', action);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const queryString = params.toString();
    const endpoint = queryString ? `/audit?${queryString}` : '/audit';
    
    return this.request(endpoint);
  }

  // Методы для работы с токенами
  setToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  removeToken(): void {
    localStorage.removeItem('authToken');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const apiClient = new ApiClient();
export default apiClient;
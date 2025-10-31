import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

export interface DashboardStats {
  totalCourses: number;
  activeCourses: number;
  totalStudents: number;
  completedCourses: number;
  organizations: number;
  contacts: number;
  recentActivity: any[];
  changes: {
    totalCourses: string;
    activeCourses: string;
    totalStudents: string;
    completedCourses: string;
    organizations: string;
    contacts: string;
  };
}

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats(userId: string, userRole: string): Promise<DashboardStats> {
    try {
      // Базовая статистика для всех ролей
      const [totalCourses, organizations, contacts, recentActivity] = await Promise.all([
        this.getCourseStats(userId, userRole),
        this.getOrganizationStats(userId, userRole),
        this.getContactStats(userId, userRole),
        this.getRecentActivity(userId, userRole),
      ]);

      // Дополнительная статистика для администраторов и кураторов
      let totalStudents = 0;
      let completedCourses = 0;

      if (['ADMIN', 'CURATOR'].includes(userRole)) {
        const studentStats = await this.getStudentStats();
        totalStudents = studentStats.totalStudents;
        completedCourses = studentStats.completedCourses;
      } else {
        // Для обычных пользователей показываем их личную статистику
        const userStats = await this.getUserStats(userId);
        completedCourses = userStats.completedCourses;
      }

      // Получаем данные за предыдущий период для расчета изменений
      const changes = await this.calculateChanges(userId, userRole, {
        totalCourses: totalCourses.total,
        activeCourses: totalCourses.active,
        totalStudents,
        completedCourses,
        organizations: organizations.total,
        contacts: contacts.total,
      });

      return {
        totalCourses: totalCourses.total,
        activeCourses: totalCourses.active,
        totalStudents,
        completedCourses,
        organizations: organizations.total,
        contacts: contacts.total,
        recentActivity,
        changes,
      };
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      // Возвращаем пустую статистику в случае ошибки
      return {
        totalCourses: 0,
        activeCourses: 0,
        totalStudents: 0,
        completedCourses: 0,
        organizations: 0,
        contacts: 0,
        recentActivity: [],
        changes: {
          totalCourses: '',
          activeCourses: '',
          totalStudents: '',
          completedCourses: '',
          organizations: '',
          contacts: '',
        },
      };
    }
  }

  private async getCourseStats(userId: string, userRole: string) {
    const whereClause = userRole === 'CLIENT' ? { authorId: userId } : {};

    const [total, active] = await Promise.all([
      this.prisma.course.count({ where: whereClause }),
      this.prisma.course.count({ 
        where: { 
          ...whereClause,
          // Предполагаем, что активные курсы имеют статус или дату создания в последние 30 дней
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        } 
      }),
    ]);

    return { total, active };
  }

  private async getOrganizationStats(userId: string, userRole: string) {
    const whereClause = userRole === 'CLIENT' ? { ownerId: userId } : {};

    const total = await this.prisma.org.count({ where: whereClause });
    return { total };
  }

  private async getContactStats(userId: string, userRole: string) {
    let whereClause = {};

    if (userRole === 'CLIENT') {
      // Клиенты видят только контакты своих организаций
      const userOrgs = await this.prisma.org.findMany({
        where: { ownerId: userId },
        select: { id: true },
      });
      
      whereClause = {
        orgId: {
          in: userOrgs.map(org => org.id),
        },
      };
    }

    const total = await this.prisma.contact.count({ where: whereClause });
    return { total };
  }

  private async getStudentStats() {
    // Подсчитываем пользователей с ролью CANDIDATE как студентов
    const totalStudents = await this.prisma.user.count({
      where: { role: 'CANDIDATE' },
    });

    // Для completedCourses пока возвращаем 0, так как нет таблицы прогресса курсов
    // В будущем здесь будет запрос к таблице course_progress или similar
    const completedCourses = 0;

    return { totalStudents, completedCourses };
  }

  private async getUserStats(userId: string) {
    // Для обычных пользователей показываем количество их завершенных курсов
    // Пока возвращаем 0, так как нет таблицы прогресса
    const completedCourses = 0;

    return { completedCourses };
  }

  private async getRecentActivity(userId: string, userRole: string) {
    try {
      let whereClause: any = {};

      // Ограничиваем активность для клиентов
      if (userRole === 'CLIENT') {
        whereClause.userId = userId;
      }

      const recentLogs = await this.prisma.auditLog.findMany({
        where: {
          ...whereClause,
          timestamp: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Последние 7 дней
          },
        },
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
        },
        orderBy: { timestamp: 'desc' },
        take: 5,
      });

      return recentLogs.map(log => ({
        id: log.id,
        action: log.action,
        entity: log.entity,
        entityId: log.entityId,
        timestamp: log.timestamp,
        user: log.user,
        details: log.details,
      }));
    } catch (error) {
      console.error('Error getting recent activity:', error);
      return [];
    }
  }

  private async calculateChanges(userId: string, userRole: string, currentStats: any) {
    try {
      // Получаем данные за предыдущий месяц для сравнения
      const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

      // Получаем статистику за предыдущий период
      const [prevCourses, prevOrganizations, prevContacts] = await Promise.all([
        this.getCourseStatsForPeriod(userId, userRole, oneMonthAgo),
        this.getOrganizationStatsForPeriod(userId, userRole, oneMonthAgo),
        this.getContactStatsForPeriod(userId, userRole, oneMonthAgo),
      ]);

      let prevStudents = 0;
      let prevCompletedCourses = 0;

      if (['ADMIN', 'CURATOR'].includes(userRole)) {
        const prevStudentStats = await this.getStudentStatsForPeriod(oneMonthAgo);
        prevStudents = prevStudentStats.totalStudents;
        prevCompletedCourses = prevStudentStats.completedCourses;
      } else {
        const prevUserStats = await this.getUserStatsForPeriod(userId, oneMonthAgo);
        prevCompletedCourses = prevUserStats.completedCourses;
      }

      // Рассчитываем изменения
      const formatChange = (current: number, previous: number, period: string) => {
        const diff = current - previous;
        if (diff === 0) return '';
        const sign = diff > 0 ? '+' : '';
        return `${sign}${diff} за ${period}`;
      };

      return {
        totalCourses: formatChange(currentStats.totalCourses, prevCourses.total, 'месяц'),
        activeCourses: formatChange(currentStats.activeCourses, prevCourses.active, 'неделю'),
        totalStudents: formatChange(currentStats.totalStudents, prevStudents, 'месяц'),
        completedCourses: formatChange(currentStats.completedCourses, prevCompletedCourses, 'неделю'),
        organizations: formatChange(currentStats.organizations, prevOrganizations.total, 'месяц'),
        contacts: formatChange(currentStats.contacts, prevContacts.total, 'месяц'),
      };
    } catch (error) {
      console.error('Error calculating changes:', error);
      return {
        totalCourses: '',
        activeCourses: '',
        totalStudents: '',
        completedCourses: '',
        organizations: '',
        contacts: '',
      };
    }
  }

  private async getCourseStatsForPeriod(userId: string, userRole: string, beforeDate: Date) {
    const whereClause = userRole === 'CLIENT' ? { authorId: userId } : {};

    const [total, active] = await Promise.all([
      this.prisma.course.count({ 
        where: { 
          ...whereClause,
          createdAt: { lte: beforeDate }
        } 
      }),
      this.prisma.course.count({ 
        where: { 
          ...whereClause,
          createdAt: { 
            lte: beforeDate,
            gte: new Date(beforeDate.getTime() - 30 * 24 * 60 * 60 * 1000)
          }
        } 
      }),
    ]);

    return { total, active };
  }

  private async getOrganizationStatsForPeriod(userId: string, userRole: string, beforeDate: Date) {
    const whereClause = userRole === 'CLIENT' ? { ownerId: userId } : {};

    const total = await this.prisma.org.count({ 
      where: { 
        ...whereClause,
        createdAt: { lte: beforeDate }
      } 
    });
    return { total };
  }

  private async getContactStatsForPeriod(userId: string, userRole: string, beforeDate: Date) {
    let whereClause: any = { createdAt: { lte: beforeDate } };

    if (userRole === 'CLIENT') {
      const userOrgs = await this.prisma.org.findMany({
        where: { ownerId: userId },
        select: { id: true },
      });
      
      whereClause.orgId = {
        in: userOrgs.map(org => org.id),
      };
    }

    const total = await this.prisma.contact.count({ where: whereClause });
    return { total };
  }

  private async getStudentStatsForPeriod(beforeDate: Date) {
    const totalStudents = await this.prisma.user.count({
      where: { 
        role: 'CANDIDATE',
        createdAt: { lte: beforeDate }
      },
    });

    const completedCourses = 0; // Пока 0, так как нет таблицы прогресса

    return { totalStudents, completedCourses };
  }

  private async getUserStatsForPeriod(userId: string, beforeDate: Date) {
    const completedCourses = 0; // Пока 0, так как нет таблицы прогресса

    return { completedCourses };
  }
}
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { AuditService } from './audit.service';
import { AuditAction } from './audit-action.enum';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    private auditService: AuditService,
    private reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    // Skip if no user (public routes)
    if (!user) {
      return next.handle();
    }

    // Get metadata from decorators
    const entity = this.reflector.get<string>('resource', context.getHandler());
    const action = this.reflector.get<string>('action', context.getHandler());
    
    // Skip if no entity/action metadata
    if (!entity || !action) {
      return next.handle();
    }

    // Map HTTP methods to audit actions
    const httpMethod = request.method;
    let auditAction: AuditAction;
    
    switch (httpMethod) {
      case 'POST':
        auditAction = AuditAction.CREATE;
        break;
      case 'GET':
        auditAction = AuditAction.READ;
        break;
      case 'PUT':
      case 'PATCH':
        auditAction = AuditAction.UPDATE;
        break;
      case 'DELETE':
        auditAction = AuditAction.DELETE;
        break;
      default:
        auditAction = AuditAction.READ;
    }

    // Get resource ID from params if available
    const resourceId = request.params?.id;
    
    // Prepare audit details
    const auditDetails = {
      method: httpMethod,
      url: request.url,
      userAgent: request.headers['user-agent'],
      ip: request.ip,
      params: request.params,
      query: request.query,
      // Don't log sensitive data like passwords
      body: this.sanitizeBody(request.body),
    };

    return next.handle().pipe(
      tap({
        next: (response) => {
          // Log successful operations
          this.auditService.createAuditLog(
            user?.userId || user?.id,
            auditAction,
            entity,
            resourceId,
            {
              ...auditDetails,
              success: true,
              responseStatus: 'success',
            },
          );
        },
        error: (error) => {
          // Log failed operations
          this.auditService.createAuditLog(
            user?.userId || user?.id,
            auditAction,
            entity,
            resourceId,
            {
              ...auditDetails,
              success: false,
              error: error.message,
              responseStatus: 'error',
            },
          );
        },
      }),
    );
  }

  private sanitizeBody(body: any): any {
    if (!body || typeof body !== 'object') {
      return body;
    }

    const sensitiveFields = ['password', 'token', 'secret', 'key'];
    const sanitized = { ...body };

    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    }

    return sanitized;
  }
}
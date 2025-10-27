import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { AuditService } from './audit.service';
export declare class AuditInterceptor implements NestInterceptor {
    private auditService;
    private reflector;
    constructor(auditService: AuditService, reflector: Reflector);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
    private sanitizeBody;
}

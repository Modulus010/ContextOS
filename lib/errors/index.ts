/**
 * Unified Error Handling System
 * Centralized error handling with consistent error types and messages
 */

import { ZodError } from 'zod';
import { NextResponse } from 'next/server';

// Error Types
export enum ErrorType {
    VALIDATION = 'VALIDATION_ERROR',
    DATABASE = 'DATABASE_ERROR',
    AI_SERVICE = 'AI_SERVICE_ERROR',
    NOT_FOUND = 'NOT_FOUND',
    UNAUTHORIZED = 'UNAUTHORIZED',
    RATE_LIMIT = 'RATE_LIMIT_EXCEEDED',
    UNKNOWN = 'UNKNOWN_ERROR',
}

// Custom Error Class
export class AppError extends Error {
    constructor(
        public type: ErrorType,
        public message: string,
        public statusCode: number = 500,
        public details?: any
    ) {
        super(message);
        this.name = 'AppError';
        Object.setPrototypeOf(this, AppError.prototype);
    }
}

// Error Factory Functions
export class ErrorHandler {
    static validation(message: string, details?: any): AppError {
        return new AppError(ErrorType.VALIDATION, message, 400, details);
    }

    static database(message: string, details?: any): AppError {
        return new AppError(ErrorType.DATABASE, message, 500, details);
    }

    static aiService(message: string, details?: any): AppError {
        return new AppError(ErrorType.AI_SERVICE, message, 503, details);
    }

    static notFound(resource: string): AppError {
        return new AppError(ErrorType.NOT_FOUND, `${resource} 未找到`, 404);
    }

    static unauthorized(message: string = '未授权访问'): AppError {
        return new AppError(ErrorType.UNAUTHORIZED, message, 401);
    }

    static rateLimit(message: string = '请求过于频繁，请稍后再试'): AppError {
        return new AppError(ErrorType.RATE_LIMIT, message, 429);
    }

    static unknown(message: string = '发生未知错误'): AppError {
        return new AppError(ErrorType.UNKNOWN, message, 500);
    }

    // Parse Zod validation errors
    static fromZodError(error: ZodError): AppError {
        const messages = error.issues.map(err => `${err.path.join('.')}: ${err.message}`);
        return new AppError(
            ErrorType.VALIDATION,
            '数据验证失败',
            400,
            { errors: messages }
        );
    }

    // Convert any error to AppError
    static fromError(error: unknown): AppError {
        if (error instanceof AppError) {
            return error;
        }

        if (error instanceof ZodError) {
            return this.fromZodError(error);
        }

        if (error instanceof Error) {
            // Check for Supabase errors
            if ('code' in error && 'details' in error) {
                return this.database(error.message, { code: (error as any).code });
            }
            return this.unknown(error.message);
        }

        return this.unknown('发生未知错误');
    }
}

// API Response Helpers
export class ApiResponse {
    static success<T>(data: T, statusCode: number = 200) {
        return NextResponse.json({ success: true, data }, { status: statusCode });
    }

    static error(error: AppError | unknown) {
        const appError = error instanceof AppError ? error : ErrorHandler.fromError(error);

        const response = {
            success: false,
            error: {
                type: appError.type,
                message: appError.message,
                ...(appError.details && { details: appError.details }),
            },
        };

        // Log errors in development
        if (process.env.NODE_ENV === 'development') {
            console.error('API Error:', appError);
        }

        return NextResponse.json(response, { status: appError.statusCode });
    }

    static created<T>(data: T) {
        return this.success(data, 201);
    }

    static noContent() {
        return new NextResponse(null, { status: 204 });
    }
}

// Client-side error handling
export function handleClientError(error: unknown, fallbackMessage: string): string {
    if (error instanceof Error) {
        console.error('Client Error:', error);
        return error.message || fallbackMessage;
    }

    console.error('Unknown Client Error:', error);
    return fallbackMessage;
}

// Safe async wrapper for server actions
export async function safeAsync<T>(
    fn: () => Promise<T>,
    errorHandler?: (error: AppError) => T
): Promise<T> {
    try {
        return await fn();
    } catch (error) {
        const appError = ErrorHandler.fromError(error);
        if (errorHandler) {
            return errorHandler(appError);
        }
        throw appError;
    }
}

import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common'
import { Request, Response } from 'express'
import { ErrorResponse } from '../response/response.dto'

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
   catch(exception: unknown, host: ArgumentsHost) {
      const ctx = host.switchToHttp()
      const response = ctx.getResponse<Response>()
      const request = ctx.getRequest<Request>()

      const status =
         exception instanceof HttpException
            ? exception.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR

      const exceptionResponse = exception instanceof HttpException ? exception.getResponse() : null

      const code = this.resolveCode(status, exceptionResponse)
      const message = this.resolveMessage(exception, exceptionResponse)
      const details = this.resolveDetails(exceptionResponse)

      const body: ErrorResponse = {
         success: false,
         message,
         error: details !== undefined ? { code, details } : { code },
         timestamp: new Date().toISOString(),
         path: request.url
      }

      response.status(status).json(body)
   }

   private resolveCode(status: number, exceptionResponse: unknown): string {
      if (
         exceptionResponse &&
         typeof exceptionResponse === 'object' &&
         'error' in exceptionResponse
      ) {
         return String((exceptionResponse as Record<string, unknown>).error)
            .toUpperCase()
            .replace(/ /g, '_')
      }
      return `HTTP_${status}`
   }

   private resolveMessage(exception: unknown, exceptionResponse: unknown): string {
      if (
         exceptionResponse &&
         typeof exceptionResponse === 'object' &&
         'message' in exceptionResponse
      ) {
         const msg = (exceptionResponse as Record<string, unknown>).message
         return Array.isArray(msg) ? msg[0] : String(msg)
      }
      if (exception instanceof Error) return exception.message
      return 'Internal server error'
   }

   private resolveDetails(exceptionResponse: unknown): unknown {
      if (
         exceptionResponse &&
         typeof exceptionResponse === 'object' &&
         'message' in exceptionResponse
      ) {
         const msg = (exceptionResponse as Record<string, unknown>).message
         if (Array.isArray(msg) && msg.length > 1) return msg
      }
      return undefined
   }
}

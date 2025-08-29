// common/filters/all-exceptions.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from "@nestjs/common";
import { Response } from "express";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const payload = exception.getResponse();

      let message: string | string[] = "An unexpected error occurred";
      let error = this.statusText(status); // "Bad Request", "Not Found", etc.

      if (typeof payload === "string") {
        message = payload;
      } else if (payload && typeof payload === "object") {
        const p = payload as any;
        message = p.message ?? exception.message;
        error = p.error ?? this.statusText(status);
      }

      return res.status(status).json({
        statusCode: status,
        message,
        error,
      });
    }

    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exception instanceof Error && exception.message ? exception.message : "Internal server error";

    return res.status(status).json({
      statusCode: status,
      message,
      error: this.statusText(status),
    });
  }

  private statusText(status: number): string {
    const raw = HttpStatus[status] as string | undefined;
    if (!raw) return "Error";
    return raw
      .toLowerCase()
      .split("_")
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(" ");
  }
}

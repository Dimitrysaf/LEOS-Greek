import { ErrorHandler, Injectable } from '@angular/core';
import { AuthService } from '@/core/services/auth.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private authService: AuthService) {}

  handleError(error: any): void {
    const message = error?.message || '';

    // Webpack/Angular lazy chunk error
    if (error?.name === 'ChunkLoadError' || /Loading chunk .* failed/.test(message)) {
      // Mark token as expired to trigger ECAS login
      this.authService.markTokenAsExpired(this.authService.loadTokenData().accessToken);
      return;
    }

    // Fallback: log everything else normally
    console.error(error);
  }
}
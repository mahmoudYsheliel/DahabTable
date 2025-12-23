import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

import { routes } from './app.routes';
import { definePreset } from '@primeuix/themes';


const myPreset = definePreset(Aura, {
  semantic: {
    primary: {
      100: '#fde8eb',
      200: '#f9bfc6',
      300: '#f594a1',
      400: '#f16b7b',
      500: '#ec1c34',
      600: '#d9192f',
      700: '#b81527',
      800: '#96101f',
      900: '#740c17',
    }
    
  },
  typography:{
    fontFamily:'Roboto, sans-serif'
  }
})
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),

    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: myPreset,
      }
    })
  ]
};

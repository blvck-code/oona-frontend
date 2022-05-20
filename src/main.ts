import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
  if (window) {
    // tslint:disable-next-line:only-arrow-functions typedef
    window.console.warn = window.console.info = window.console.error = function() {
      // Don't log anything to save on load resource
    };
  }
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

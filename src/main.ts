import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  var head = document.getElementById("head");

  const googleLinkScript = document.createElement('script');
  googleLinkScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-VE96YZWR72';
  googleLinkScript.async = true;

  const googleCodeScript = document.createElement('script');
  googleCodeScript.innerHTML = `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-VE96YZWR72');`;

  document.head.appendChild(googleLinkScript);
  document.head.appendChild(googleCodeScript);

  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

import { createRoot } from 'react-dom/client'
import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import 'antd/dist/reset.css'

import { App } from './view'
import {
  EngineProvider,
  SelectedEntityProvider,
  ThemeProvider,
  NotificationProvider,
  NeedsReloadProvider,
  CommandProvider,
  CommandScopeProvider,
} from './view/providers'
import { APP_ROOT } from './consts/root-nodes'
import { ROOT_SCOPE } from './consts/command-scopes'

import en from './view/locales/en.json'
import './export'

void i18next
  .use(initReactI18next)
  .init({
    lng: 'en',
    resources: {
      en: {
        translation: en,
      },
    },
  })

const root = createRoot(document.getElementById(APP_ROOT) as HTMLElement)

root.render(
  <ThemeProvider>
    <EngineProvider>
      <CommandProvider>
        <CommandScopeProvider name={ROOT_SCOPE}>
          <SelectedEntityProvider>
            <NotificationProvider>
              <NeedsReloadProvider>
                <App />
              </NeedsReloadProvider>
            </NotificationProvider>
          </SelectedEntityProvider>
        </CommandScopeProvider>
      </CommandProvider>
    </EngineProvider>
  </ThemeProvider>,
)

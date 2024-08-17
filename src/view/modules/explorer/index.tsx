import {
  useCallback,
  useEffect,
  useContext,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import { Tabs } from 'antd'

import { SelectedEntityContext } from '../../providers'
import { persistentStorage } from '../../../persistent-storage'
import { TabsCSS } from '../../common-styles/tabs.style'

import { LevelsExplorer, TemplatesExplorer, ScenesList } from './components'
import { ExplorerStyled } from './explorer.style'

export const Explorer = (): JSX.Element => {
  const { t } = useTranslation()
  const { type } = useContext(SelectedEntityContext)

  const [activeTab, setActiveTab] = useState(() => persistentStorage.get('explorer.activeTab', 'levels'))

  const handleChange = useCallback((activeKey: string) => {
    setActiveTab(activeKey)
    persistentStorage.set('explorer.activeTab', activeKey)
  }, [])

  useEffect(() => {
    if (type) {
      handleChange(type === 'actor' ? 'level' : type)
    }
  }, [type])

  return (
    <ExplorerStyled>
      <Tabs css={TabsCSS} type="card" activeKey={activeTab} onChange={handleChange}>
        <Tabs.TabPane tab={t('explorer.tab.levels')} key="level">
          <LevelsExplorer />
        </Tabs.TabPane>
        <Tabs.TabPane tab={t('explorer.tab.templates')} key="template">
          <TemplatesExplorer />
        </Tabs.TabPane>
        <Tabs.TabPane tab={t('explorer.tab.scenes')} key="scene">
          <ScenesList />
        </Tabs.TabPane>
        <Tabs.TabPane tab={t('explorer.tab.loaders')} key="loader">
          <ScenesList isLoaders />
        </Tabs.TabPane>
      </Tabs>
    </ExplorerStyled>
  )
}

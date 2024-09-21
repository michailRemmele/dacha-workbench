import React, {
  useEffect,
  useContext,
  FC,
} from 'react'

import { ROOT_SCOPE } from '../../../consts/command-scopes'

import { CommandContext } from './command-provider'

interface CommandScopeProps {
  name?: string
  children: JSX.Element | Array<JSX.Element>
}

export const CommandScopeContext = React.createContext<string>(ROOT_SCOPE)

export const CommandScopeProvider: FC<CommandScopeProps> = ({
  name = ROOT_SCOPE,
  children,
}): JSX.Element => {
  const { store, setActiveScope } = useContext(CommandContext)

  useEffect(() => {
    setActiveScope(name)

    return () => {
      setActiveScope(ROOT_SCOPE)
    }
  }, [name])

  useEffect(() => () => {
    store.clean({ scope: name })
  }, [])

  return (
    <CommandScopeContext.Provider value={name}>
      {children}
    </CommandScopeContext.Provider>
  )
}

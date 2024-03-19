import React, { FC, useState } from 'react'
import MarkdownEditor, { defaultCommands,ICommand } from '@uiw/react-markdown-editor'
import MarkdownViewer from '@uiw/react-markdown-preview'
import '@uiw/react-markdown-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'
import { useThemeMode } from '@/hooks/useThemeMode'
import { image } from './image'

export interface MdEditorProps {
  defaultValue?: string
  onChange?: (value: string) => void
  onFocus?: (e: React.FocusEvent<HTMLDivElement, Element> ) => void
  onBlur?: (e: React.FocusEvent<HTMLDivElement, Element>) => void
}
export const MdEditor: FC<MdEditorProps> = ({ defaultValue, onChange, onFocus, onBlur }) => {
  const { isDarkMode } = useThemeMode()
  const [markdown, setMarkdown] = useState(defaultValue || '')
 
  
  return (
    <div className="" data-color-mode={isDarkMode ? 'dark' : 'light'}>
      <MarkdownEditor
        value={defaultValue}
        height="300px"
        onFocus={(e)=>onFocus && onFocus(e)}
        onChange={(value) => onChange && onChange(value)}
        onBlur={(e) => onBlur && onBlur(e)}
        visible={true}
        toolbars={['undo','redo','bold','italic','strike','header','code','codeBlock','quote','ulist','olist', 'todo', 'link',image]}
      />
    </div>
  )
}

export interface MdViewerProps {
  source:string
}
export const MdViewer: FC<MdViewerProps> = ({ source }) => {
  const { isDarkMode } = useThemeMode()
  
  return (
    <div className="" data-color-mode={isDarkMode ? 'dark' : 'light'}>
      <MarkdownViewer source={source} />

    </div>
  )
}

export default MdEditor
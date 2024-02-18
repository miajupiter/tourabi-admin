"use client"

import React, { FC, useEffect } from "react"
import { useLanguage } from '@/hooks/i18n'
import '@mdxeditor/editor/style.css';
import { MDXEditor } from '@mdxeditor/editor'


export interface EditorProps {
  title: string
}

const TextEditor: FC<EditorProps> = ({
  title = 'editor title'
}) => {
  // const { t, lang } = useLanguage()

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark my-6">
      <div className="px-4 py-6 md:px-6 xl:px-7.5">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          {title}
        </h4>
      </div>

      <div className="grid grid-cols-1 h-[500px] border-t border-stroke p-4 dark:border-strokedark ">
        <MDXEditor
        className='w-full'
        markdown={`
        # Merhaba dunya

        - madde 1
        - madde 2

        ## konu 1

        Reprehenderit minim Lorem et labore aliquip qui culpa pariatur in occaecat consequat nulla commodo. Lorem nulla ut reprehenderit non exercitation Lorem excepteur ullamco cillum elit ullamco excepteur. Exercitation consequat tempor et nostrud quis nulla sunt mollit id duis labore esse. Mollit mollit proident velit cillum eiusmod. Aliqua ea in consectetur incididunt est occaecat voluptate aliquip dolore amet cillum dolore. Aliquip quis exercitation esse pariatur magna consequat incididunt excepteur laboris consequat magna duis.

        \`\`\`bash
        const ali1cem2=()=>{
          return <>sdfsdfsdfsdf</>
        }

        \`\`\`
        `} onChange={(markd)=>{
          console.log(markd)
        }} />
      </div>

    </div>
  )
}

export default TextEditor

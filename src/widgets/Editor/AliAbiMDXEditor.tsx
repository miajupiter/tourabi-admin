"use client"

import React, { FC, ForwardedRef, useEffect, useState } from "react"
import { useLanguage } from '@/hooks/i18n'
import { LeafDirective } from 'mdast-util-directive'
import {
  AdmonitionDirectiveDescriptor,
  MDXEditor,
  UndoRedo,
  codeBlockPlugin,
  codeMirrorPlugin,
  diffSourcePlugin,
  directivesPlugin,
  frontmatterPlugin,
  headingsPlugin,
  imagePlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  quotePlugin,
  sandpackPlugin,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  Separator,
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CreateLink,
  DiffSourceToggleWrapper,
  InsertImage,
  ListsToggle,
  KitchenSinkToolbar,
  DirectiveDescriptor,
  MDXEditorProps,
  MDXEditorMethods,
  ImageUploadHandler,
  InsertTable,
  InsertThematicBreak,
  CodeToggle,
  CodeMirrorEditor,
  InsertCodeBlock
} from '@mdxeditor/editor'

import '@mdxeditor/editor/style.css'
import './mdx-editor.css'
import { useThemeMode } from '@/hooks/useThemeMode'
import { v4 } from 'uuid'
export async function expressImageUploadHandler(image: File) {
  const formData = new FormData()
  formData.append('image', image)
  const response = await fetch('/uploads/new', { method: 'POST', body: formData })
  const json = (await response.json()) as { url: string }
  return json.url
}

interface YoutubeDirectiveNode extends LeafDirective {
  name: 'youtube'
  attributes: { id: string }
}

export const YoutubeDirectiveDescriptor: DirectiveDescriptor<YoutubeDirectiveNode> = {
  name: 'youtube',
  type: 'leafDirective',
  testNode(node) {
    return node.name === 'youtube'
  },
  attributes: ['id'],
  hasChildren: false,
  Editor: ({ mdastNode, lexicalNode, parentEditor }) => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <button
          onClick={() => {
            parentEditor.update(() => {
              lexicalNode.selectNext()
              lexicalNode.remove()
            })
          }}
        >
          delete
        </button>
        <iframe
          width="560"
          height="315"
          src={`https://www.youtube.com/embed/${mdastNode.attributes?.id}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        ></iframe>
      </div>
    )
  }
}

export function generateS3FileName(prefix: string) {
  let fileName = new Date().toISOString().replace(/\:/g, '').replace(/\-/g, '').replace(/\T/g, '_').split('.')[0]
  fileName = prefix + fileName
}

export const uploadToS3Bucket = async (file: File, s3FilePath: string) =>
  new Promise<string>(async (resolve, reject) => {
    if (!file) {
      return reject('Please select a file to upload.')
    }
    fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', },
      body: JSON.stringify({ filename: s3FilePath, contentType: file.type }),
    })
      .then(response => {
        if (response.ok) {
          response.json()
            .then(result => {
              const { url, fields } = result
              const formData = new FormData()
              Object.entries(fields).forEach(([key, value]) => {
                formData.append(key, value as string)
              })
              formData.append('file', file)

              fetch(url, {
                method: 'POST',
                body: formData,
              }).then(uploadResponse => {
                if (uploadResponse.ok) {
                  const fileUrl = `${url}${fields.key}`
                  resolve(fileUrl)
                } else {
                  reject('upload failed')
                }
              })
                .catch(err => reject(err.message || err))

            })
            .catch(err => reject(err.message || err))

        } else {
          reject('Failed to get pre-signed URL.')
        }
      })
      .catch(err => reject(err.message || err))
  })


export const ALL_PLUGINS = [
  // toolbarPlugin({ toolbarContents: () => <KitchenSinkToolbar  /> }),
  toolbarPlugin({
    toolbarContents: () => <>
      <DiffSourceToggleWrapper options={['rich-text','source','diff']}>
        <UndoRedo />
        <Separator />
        <BlockTypeSelect />
        <BoldItalicUnderlineToggles />
        <Separator />
        <InsertThematicBreak />
        <InsertTable />
        <CodeToggle />
        <CreateLink />
        <Separator />
        <ListsToggle />
        <InsertImage />
        <InsertCodeBlock />
      </DiffSourceToggleWrapper>
    </>
  }),
  listsPlugin(),
  quotePlugin(),
  headingsPlugin({ allowedHeadingLevels: [1, 2, 3, 4] }),
  linkPlugin(),
  linkDialogPlugin(),
  imagePlugin({
    async imagePreviewHandler(imageSource) {
      return new Promise((resolve, reject) => {
        console.log('imagePreviewHandler imageSource', imageSource)
        resolve(imageSource)
      })
    },
    // imageAutocompleteSuggestions: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150'],
    async imageUploadHandler(file: File) {
      return new Promise((resolve, reject) => {
        uploadToS3Bucket(file, `mdximages/${file.name}`)
          .then(fileUrl => {
            console.log('fileUrl:', fileUrl)
            resolve(fileUrl)
          })
          .catch(err => {
            console.log('imageUploadHandler err:', err)
            reject(err)
          })
      })
    },
  }),
  tablePlugin(),
  thematicBreakPlugin(),
  frontmatterPlugin(),
  codeBlockPlugin({ defaultCodeBlockLanguage: '' }),

  // // sandpackPlugin({ sandpackConfig: virtuosoSampleSandpackConfig }),
  codeMirrorPlugin({ codeBlockLanguages: { js: 'JavaScript', css: 'CSS', txt: 'Plain Text', tsx: 'TypeScript', '': 'Unspecified' } }),
  directivesPlugin({ directiveDescriptors: [] }),
  diffSourcePlugin({ viewMode: 'rich-text', diffMarkdown: 'boo' }),
  markdownShortcutPlugin()
]


export const AliAbiMDXEditor = ({
  editorRef,
  ...props
}: { editorRef?: ForwardedRef<MDXEditorMethods> | null } & MDXEditorProps) => {

  const { isDarkMode } = useThemeMode()

  return (
    <>
      <MDXEditor
        ref={editorRef}
        className={`${isDarkMode ? 'dark-theme ' : ''} prose lg:prose-xl dark:prose-invert w-full prose-img:rounded-[4px] prose-a:text-blue-600`}
        plugins={ALL_PLUGINS}
        toMarkdownOptions={{
          tightDefinitions: true,
          resourceLink: false
        }}
        {...props}
      />
    </>
  )
}

export default AliAbiMDXEditor

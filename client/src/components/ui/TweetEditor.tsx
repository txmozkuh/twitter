import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import Image from '@tiptap/extension-image'
import { useEffect } from 'react'
import { Bold, Heading1, Heading2, ImageUp, Italic, UnderlineIcon } from 'lucide-react'
import { Heading } from '@tiptap/extension-heading'

export default function TweetEditor() {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image,
      Placeholder.configure({
        placeholder: "What's happening" // Your placeholder text
      }),
      Heading.configure({
        HTMLAttributes: {
          class: 'my-custom-class'
        },
        levels: [1, 2]
      })
    ],
    content: '' // Empty content to show the placeholder
  })

  // Example: Insert image (you can use input file to upload)
  const insertImage = () => {
    const url = prompt('Enter image URL')
    if (url) {
      editor?.chain().focus().setImage({ src: url }).run()
    }
  }

  useEffect(() => {
    const detectTags = () => {
      const text = editor?.getText()
      if (text) {
        const tags = text.match(/#\w+/g)
        const mentions = text.match(/@\w+/g)
        console.log({ tags, mentions })
      }
    }

    editor?.on('update', detectTags)
  }, [editor])

  return (
    <div className='w-full'>
      {/* Editor content */}
      <EditorContent editor={editor} className='min-h-[50px] max-w-[100%] py-2 text-xl' />

      {/* Toolbar buttons */}
      <div className='border-border-grey flex w-full items-center gap-4 border-t py-2'>
        <Bold
          className={`${editor?.isActive('bold') ? 'bg-text-grey/20 rounded-full' : ''} stroke-blue-sky size-7 stroke-3 p-1 hover:scale-110`}
          onClick={() => editor?.chain().focus().toggleBold().run()}
        />
        <UnderlineIcon
          className={`${editor?.isActive('underline') ? 'bg-text-grey/20 rounded-full' : ''} stroke-blue-sky size-7 stroke-3 p-1 hover:scale-110`}
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
        />
        <Italic
          className={`${editor?.isActive('italic') ? 'bg-text-grey/20 rounded-full' : ''} stroke-blue-sky size-7 stroke-3 p-1 hover:scale-110`}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        />
        <Heading1
          className={`${editor?.isActive('heading', { level: 1 }) ? 'bg-text-grey/20 rounded-full' : ''} stroke-blue-sky size-7 stroke-3 p-1 hover:scale-110`}
          onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
        />
        <Heading2
          className={`${editor?.isActive('heading', { level: 2 }) ? 'bg-text-grey/20 rounded-full' : ''} stroke-blue-sky size-7 stroke-3 p-1 hover:scale-110`}
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
        />
        <ImageUp className='stroke-blue-sky size-5 stroke-3 hover:scale-110' onClick={insertImage} />
        <button
          disabled={!editor?.getText()}
          className='border-border-grey ml-auto rounded-full border bg-white px-6 py-2 font-bold text-black disabled:bg-white/60'
          onClick={() => console.log(editor?.getText())}
        >
          Post
        </button>
      </div>
    </div>
  )
}

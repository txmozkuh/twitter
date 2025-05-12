import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import Image from '@tiptap/extension-image'
import { useEffect } from 'react'
import { ImageUp } from 'lucide-react'
import { Heading } from '@tiptap/extension-heading'

export default function CommentEditor() {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image,
      Placeholder.configure({
        placeholder: 'Post your reply' // Your placeholder text
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
        <ImageUp className='stroke-blue-sky size-4 stroke-2 hover:scale-110' onClick={insertImage} />
        <button
          disabled={!editor?.getText()}
          className='border-border-grey ml-auto rounded-full border bg-white px-6 py-2 font-bold text-black disabled:bg-white/60'
          onClick={() => console.log(editor?.getText())}
        >
          Reply
        </button>
      </div>
    </div>
  )
}

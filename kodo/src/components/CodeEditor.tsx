import { useEffect, useRef } from 'react'
import { EditorView, keymap, lineNumbers, highlightActiveLine, highlightActiveLineGutter, drawSelection, placeholder as placeholderExt } from '@codemirror/view'
import { EditorState, Compartment, Prec } from '@codemirror/state'
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands'
import { bracketMatching, indentOnInput, indentUnit, syntaxHighlighting, HighlightStyle } from '@codemirror/language'
import { closeBrackets, closeBracketsKeymap, autocompletion, completionKeymap } from '@codemirror/autocomplete'
import { python } from '@codemirror/lang-python'
import { cpp } from '@codemirror/lang-cpp'
import { tags } from '@lezer/highlight'
import type { Lang } from '../judge/protocol'

const highlight = HighlightStyle.define([
  { tag: [tags.keyword, tags.controlKeyword, tags.operatorKeyword, tags.definitionKeyword, tags.moduleKeyword], color: 'var(--tok-keyword)' },
  { tag: [tags.string, tags.special(tags.string)], color: 'var(--tok-string)' },
  { tag: [tags.number, tags.bool, tags.null], color: 'var(--tok-number)' },
  { tag: [tags.comment, tags.lineComment, tags.blockComment], color: 'var(--tok-comment)', fontStyle: 'italic' },
  { tag: [tags.function(tags.variableName), tags.function(tags.propertyName)], color: 'var(--tok-function)' },
  { tag: [tags.typeName, tags.className, tags.processingInstruction], color: 'var(--tok-type)' },
  { tag: [tags.standard(tags.variableName), tags.special(tags.variableName)], color: 'var(--tok-builtin)' },
])

const langExt = (lang: Lang) => (lang === 'python' ? python() : cpp())

interface Props {
  value: string
  onChange: (v: string) => void
  lang: Lang
  onRun?: () => void
  onSubmit?: () => void
  label: string
  placeholder?: string
  minHeight?: number
}

export function CodeEditor({ value, onChange, lang, onRun, onSubmit, label, placeholder, minHeight }: Props) {
  const host = useRef<HTMLDivElement>(null)
  const view = useRef<EditorView | null>(null)
  const langComp = useRef(new Compartment())
  const callbacks = useRef({ onChange, onRun, onSubmit })
  callbacks.current = { onChange, onRun, onSubmit }

  useEffect(() => {
    const v = new EditorView({
      parent: host.current!,
      state: EditorState.create({
        doc: value,
        extensions: [
          lineNumbers(),
          highlightActiveLineGutter(),
          highlightActiveLine(),
          history(),
          drawSelection(),
          indentOnInput(),
          bracketMatching(),
          closeBrackets(),
          autocompletion({ activateOnTyping: true }),
          indentUnit.of('    '),
          EditorState.tabSize.of(4),
          syntaxHighlighting(highlight),
          langComp.current.of(langExt(lang)),
          placeholder ? placeholderExt(placeholder) : [],
          Prec.highest(
            keymap.of([
              { key: 'Mod-Enter', run: () => (callbacks.current.onRun?.(), true) },
              { key: 'Mod-Shift-Enter', run: () => (callbacks.current.onSubmit?.(), true) },
            ]),
          ),
          keymap.of([...closeBracketsKeymap, ...defaultKeymap, ...historyKeymap, ...completionKeymap, indentWithTab]),
          EditorView.updateListener.of((u) => {
            if (u.docChanged) callbacks.current.onChange(u.state.doc.toString())
          }),
          EditorView.contentAttributes.of({ 'aria-label': label, spellcheck: 'false', autocapitalize: 'off', autocorrect: 'off' }),
          minHeight ? EditorView.theme({ '&': { minHeight: `${minHeight}px` } }) : [],
        ],
      }),
    })
    view.current = v
    // Pour les tests automatisés (développement uniquement).
    if (import.meta.env.DEV) (window as unknown as { __kodoEditor?: EditorView }).__kodoEditor = v
    return () => v.destroy()
    // L'éditeur est créé une seule fois ; langue et contenu sont synchronisés plus bas.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    view.current?.dispatch({ effects: langComp.current.reconfigure(langExt(lang)) })
  }, [lang])

  // Contenu remplacé de l'extérieur (changement de problème ou de langage, réinitialisation).
  useEffect(() => {
    const v = view.current
    if (v && v.state.doc.toString() !== value) {
      v.dispatch({ changes: { from: 0, to: v.state.doc.length, insert: value } })
    }
  }, [value])

  return <div ref={host} className="h-full min-h-0 overflow-hidden" />
}

import type { DetailedHTMLProps, HTMLAttributes } from 'react'

declare global {
  namespace React.JSX {
    interface IntrinsicElements {
      'gmp-place-autocomplete': DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        'included-region-codes'?: string
        placeholder?: string
      }
    }
  }
}

export {}

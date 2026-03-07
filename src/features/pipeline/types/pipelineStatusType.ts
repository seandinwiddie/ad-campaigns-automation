export type PipelineStatus =
  | 'idle'
  | 'validating'
  | 'resolving'
  | 'generating'
  | 'composing'
  | 'complete'
  | 'error';

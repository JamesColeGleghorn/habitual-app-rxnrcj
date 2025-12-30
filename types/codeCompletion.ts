
export type CodeLanguage = 
  | 'javascript'
  | 'typescript'
  | 'python'
  | 'java'
  | 'cpp'
  | 'csharp'
  | 'go'
  | 'rust'
  | 'swift'
  | 'kotlin'
  | 'php'
  | 'ruby'
  | 'html'
  | 'css'
  | 'sql';

export type CodeCompletionModel = 
  | 'deepseek/deepseek-coder'
  | 'anthropic/claude-3.5-sonnet'
  | 'openai/gpt-4-turbo'
  | 'meta-llama/codellama-34b-instruct'
  | 'mistralai/codestral-latest';

export interface CodeCompletionRequest {
  code: string;
  language: CodeLanguage;
  cursorPosition?: number;
  model?: CodeCompletionModel;
  temperature?: number;
  maxTokens?: number;
}

export interface CodeCompletionResponse {
  completion: string;
  model: string;
  duration_ms: number;
  tokens?: {
    prompt?: number;
    completion?: number;
    total?: number;
  };
}

export interface CompletionHistory {
  id: string;
  code: string;
  completion: string;
  language: CodeLanguage;
  model: string;
  timestamp: number;
}

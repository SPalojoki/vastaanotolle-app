export interface Form {
  id: string
  title: string
  accessCode: string
  published: boolean
  createdAt: string
  updatedAt: string
}

export interface LoaderData {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  data: any
}

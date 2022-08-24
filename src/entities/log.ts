import { UserDocument } from '@entities/user'

export interface LogDocument {
  user: UserDocument
  group: 'join' | 'left'
  createdAt: number
}

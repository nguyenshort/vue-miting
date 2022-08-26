import { UserDocument } from '@entities/user'
import { GoalDocument } from '@entities/goal'

export interface InviteDocument {
  id: string|number
  from: UserDocument
  to: GoalDocument
  createdAt: number
}

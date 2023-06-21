// eslint-disable-next-line
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      name: string
      email: string
      session_id?: string
    }
    meals: {
      meal_id: string
      user_id: string
      meal_name: string
      meal_description: string
      date: string
      inside_diet: boolean
    }
  }
}

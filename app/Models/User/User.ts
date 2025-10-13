import { DateTime } from 'luxon'
import { BaseModel, beforeFetch, beforeFind, column } from '@ioc:Adonis/Lucid/Orm'

export default class User extends BaseModel {
  public static softDelete = true

  @column({ isPrimary: true })
  public id: string

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime

  @column.dateTime()
  public deleted_at: DateTime

  static get table() {
    return "" // table name
  }

  @beforeFind()
  public static findWithoutSoftDeletes(query) {
    query.whereNull("deleted_at")
  }

  @beforeFetch()
  public static fetchWithoutSoftDeletes(query) {
    query.whereNull("deleted_at")
  }
}

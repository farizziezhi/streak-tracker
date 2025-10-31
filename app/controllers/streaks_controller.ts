import type { HttpContext } from '@adonisjs/core/http'
import StreakRecord from '#models/streak_record'
import { DateTime } from 'luxon'
import db from '@adonisjs/lucid/services/db'

export default class StreaksController {
  async store({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const today = DateTime.now().toFormat('yyyy-MM-dd')

    try {
      await StreakRecord.create({
        userId: user.id,
        dateRecorded: DateTime.fromFormat(today, 'yyyy-MM-dd')
      })

      return response.created({ message: 'Activity recorded successfully' })
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return response.conflict({ message: 'Activity already recorded for today' })
      }
      throw error
    }
  }

  async public({ response }: HttpContext) {
    // Get all users with their streak records
    const users = await db.query()
      .select('u.id', 'u.username')
      .from('users as u')
      .orderBy('u.username')

    const leaderboard = []

    for (const user of users) {
      // Get user's records ordered by date desc
      const records = await db.query()
        .select('date_recorded')
        .from('streak_records')
        .where('user_id', user.id)
        .orderBy('date_recorded', 'desc')

      let currentStreak = 0
      const today = DateTime.now().startOf('day')
      
      for (let i = 0; i < records.length; i++) {
        const recordDate = DateTime.fromJSDate(records[i].date_recorded).startOf('day')
        const expectedDate = today.minus({ days: i })
        
        if (recordDate.equals(expectedDate)) {
          currentStreak++
        } else {
          break
        }
      }

      leaderboard.push({
        username: user.username,
        current_streak: currentStreak
      })
    }

    // Sort by streak desc, then username asc
    leaderboard.sort((a, b) => {
      if (b.current_streak !== a.current_streak) {
        return b.current_streak - a.current_streak
      }
      return a.username.localeCompare(b.username)
    })

    return response.ok(leaderboard)
  }
}
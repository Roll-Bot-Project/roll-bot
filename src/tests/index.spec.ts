import { Context } from 'koishi'
import mock from '@koishijs/plugin-mock'
import memory from '@koishijs/plugin-database-memory'

const app = new Context()
app.plugin(mock)


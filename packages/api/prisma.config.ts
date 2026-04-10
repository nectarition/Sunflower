import 'dotenv/config'
import { listLocalDatabases } from '@prisma/adapter-d1'
import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: `file:${listLocalDatabases()[0]}`
  }
})

import { Schema } from "koishi"

namespace BasicConfig {
  export interface Config {
    adminUsers: string[]
    cacheHours: number
    defaultTimeOffset: string
  }
}

namespace PermissionConfig {
  export interface Config {
    allowGuildAdminDelete: boolean
    allowGuildAdminEnd: boolean
    allowNormalUserAdd: boolean
  }
}

namespace RemindConfig {
  export interface Config {
    defaultReminders: {
      type: string
      cron: string
    }
  }
}

export interface Config {
  basic: BasicConfig.Config
  permission: PermissionConfig.Config
  remind: RemindConfig.Config
}

const basicConfig: Schema<BasicConfig.Config> = Schema.object({
  adminUsers: Schema.union([
    Schema.array(String),
    Schema.transform(String, adminUsers => [adminUsers]),
  ]).default([""]),
  cacheHours: Schema.number().default(72),
  defaultTimeOffset: Schema.string().pattern(/^[+-](0?[0-9])(?::([0-5]?[0-9])(?::([0-5]?[0-9]))?)?$/).default("+8")
});

const permissionConfig: Schema<PermissionConfig.Config> = Schema.object({
  allowGuildAdminDelete: Schema.boolean().default(true),
  allowGuildAdminEnd: Schema.boolean().default(true),
  allowNormalUserAdd: Schema.boolean().default(true)
})

const remindConfig: Schema<RemindConfig.Config> = Schema.object({
  defaultReminders: Schema.object({
    type: Schema.string(),
    cron: Schema.string()
  })
})

export const Config: Schema<Config> = Schema.object({
  basic: basicConfig,
  permission: permissionConfig,
  remind: remindConfig
}).i18n({
  "de-DE": require("./locales/de-DE")._config,
  "en-US": require("./locales/en-US")._config,
  "zh-CN": require("./locales/zh-CN")._config,
})

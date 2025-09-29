import { Version } from '@neoxr/wb'
import fs from 'node:fs'

export const run = {
  usage: ['menu', 'help', 'command'],
  async: async (m, { client, text, isPrefix, setting, system, plugins, Config, Utils }) => {
    try {
      const local_size = fs.existsSync('./' + Config.database + '.json') ? await Utils.formatSize(fs.statSync('./' + Config.database + '.json').size) : ''
      const library = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))
      let print = 
`⛩️❯─「 *Eternal Inc* 」─❮⛩️

🌸 *Konnichiwaaa* (๑>ᴗ<๑) @${m.sender.replace(/@.+/g, '')}-chan~
I'm *Levi*
🍀 My prefix is *"${isPrefix}"* ~

*📭 Command List 📭*`

      let filter = Object.entries(plugins).filter(([_, obj]) => obj.run.usage)
      let cmd = Object.fromEntries(filter)
      let category = []
      for (let name in cmd) {
        let obj = cmd[name].run
        if (!cmd) continue
        if (!obj.category || setting.hidden.includes(obj.category)) continue
        if (Object.keys(category).includes(obj.category)) category[obj.category].push(obj)
        else {
          category[obj.category] = []
          category[obj.category].push(obj)
        }
      }
      const keys = Object.keys(category).sort()
      for (let k of keys) {
        let cmd = Object.entries(plugins).filter(([_, v]) => v.run.usage && v.run.category == k.toLowerCase())
        let commands = []
        cmd.map(([_, v]) => {
          switch (v.run.usage.constructor.name) {
            case 'Array':
              v.run.usage.map(x => commands.push(x))
              break
            case 'String':
              commands.push(v.run.usage)
          }
        })
        if (commands.length > 0) {
          print += `\n\n❯──── ${Utils.ucword(k)} ────❮\n➠\`\`\`${commands.sort((a, b) => a.localeCompare(b)).join(', ')}\`\`\``
        }
      }

      print += `

📝 *Hint:* Use *${isPrefix}help <command_name>* for detailed info on a command! Example: *${isPrefix}help hello*
🌟 *Arigato for Choosing Eternal!*`

      client.sendMessageModify(m.chat, print, m, {
        ads: false,
        largeThumb: true,
        thumbnail: Utils.isUrl(setting.cover) ? setting.cover : Buffer.from(setting.cover, 'base64'),
        url: setting.link
      })
    } catch (e) {
      client.reply(m.chat, Utils.jsonFormat(e), m)
    }
  },
  error: false
}

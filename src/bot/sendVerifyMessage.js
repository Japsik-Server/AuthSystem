const database = require("../database/Database");
const {getLocale} = require("../Language");
module.exports = async function sendVerifyMessage(guild, user, channelId, messageId, userGuilds, interaction = false) {
    await database.getServerSettings(guild.id, (async serverSettings => {
        if ((channelId !== serverSettings.channelID || messageId !== serverSettings.messageID) && !interaction) {
            return
        }
        if (!serverSettings.status) {
            await user.send(getLocale(serverSettings.language, "userBotError")).catch(() => {
            })
            return
        }
        try {
            if (serverSettings.status) {
                userGuilds.set(user.id, guild)
                if (serverSettings.verifyMessage !== "") {
                    await user.send(serverSettings.verifyMessage).catch(() => {
                    })
                } else {
                    let message = getLocale(serverSettings.language, "userEnterEmail", ("(<name>" + serverSettings.domains.toString().replaceAll(",", "|").replaceAll("*", "\\*") + ")"))
                    if (serverSettings.logChannel !== "") {
                        // message += " Caution: The admin can see the used email address"
                        message += "> 계속 진행할 경우 Japsik Server 운영정책에 동의한 것으로 간주됩니다."
                    }
                    await user.send(message).catch(() => {
                    })
                }

            }
        } catch {
            await user.send(getLocale(serverSettings.language, "userRetry"))
        }
    }))
}

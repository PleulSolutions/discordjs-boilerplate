import { Client, Collection, Intents } from "discord.js";

const fs = require('fs');
const Database = require('better-sqlite3');

class CustomClient extends Client {
    commands: Collection<string, any>;
    databaseConnection: any;

    constructor() {
        super({ intents: [Intents.FLAGS.GUILDS] });
        this.commands = new Collection();
        this.databaseConnection = new Database('database.db', { verbose: console.log });
    }

    initializeEvents() {
        let eventFiles = fs.readdirSync('./src/client/events').filter(file => file.endsWith('.ts'));

        for (let file of eventFiles) {
            let event = require(`./events/${file}`);

            if (event.once) {
                super.once(event.default.name, (...args) => event.default.execute(...args));
            } else {
                super.on(event.default.name, (...args) => event.default.execute(...args));
            }
        }
    }

    initializeCommands() {
        const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.ts'));

        for (let file of commandFiles) {
            let commandFile = require(`../commands/${file}`);
            let command = new commandFile.default();

            this.commands.set(command.data.name, command);
        }
    }

    initializeAndStartCronJobs() {
        let jobFiles = fs.readdirSync('./src/cronjobs/jobs').filter(file => file.endsWith('.ts'));

        for (const file of jobFiles) {
            let job = require(`../cronjobs/jobs/${file}`);
            new job.default().start();
        }
    }
}

export {CustomClient}
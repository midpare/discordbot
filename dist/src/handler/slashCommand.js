"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const SubCommands_1 = require("../managers/SubCommands");
const Utils_1 = require("../structures/Utils");
function default_1(client) {
    return __awaiter(this, void 0, void 0, function* () {
        const slashCommandFiles = new Array();
        Utils_1.Utils.getPath(slashCommandFiles, __dirname + '/../slashCommands');
        //Wait for bot to login
        client.on('ready', () => __awaiter(this, void 0, void 0, function* () {
            for (const path of slashCommandFiles) {
                const file = (yield Promise.resolve().then(() => __importStar(require(path)))).default;
                if (file instanceof SubCommands_1.SubCommand)
                    continue;
                client.slashCommands.set(file.name, file);
                const command = Object.assign({}, file);
                delete command.aliases;
                delete command.category;
                delete command.usage;
                delete command.execute;
                if (command.subCommands) {
                    const directories = new Array();
                    Utils_1.Utils.getPath(directories, path.split('/').slice(0, -1).join('/') + command.subCommands);
                    command.options = new Array();
                    for (const dir of directories) {
                        const subFile = (yield Promise.resolve().then(() => __importStar(require(dir)))).default;
                        client.subCommands.set(file.name + ' ' + subFile.name, subFile);
                        const subCommand = Object.assign({}, subFile);
                        delete subCommand.aliases;
                        delete subCommand.category;
                        delete subCommand.usage;
                        delete subCommand.execute;
                        command.options.push(subCommand);
                    }
                    delete command.subCommands;
                }
                for (const [_, guild] of client.guilds.cache) {
                    guild.commands.create(command);
                }
            }
        }));
    });
}
exports.default = default_1;

import mongoose from 'mongoose';
import { gambling } from '../src/models/gambling';
import { Collection, GuildMember, MessageEmbed, MessageMentions, Message } from 'discord.js';
import eventEmitter from 'events'
import { ExtendClient } from '../src/structures/Client';
import { Command } from '../src/managers/Commands';

const client = new ExtendClient();

describe('test', () => {
  const date = new Date();
  const today = '' + date.getFullYear() + date.getMonth() + date.getDate();
  let msg: Message;
  let mockUser = {
    _id: expect.anything(),
    id: 'test id',
    name: 'test name',
    date: 0,
    money: 0,
    debt: 0,
    principalDebt: 0,
    gamLevel: 1,
    bankruptcy: 0,
    baseMoneyCoolTime: 0,
    stock: [],
  };

  let args: Array<string>;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_DB_URI + '/testDB');
  });

  afterAll(async () => {
    await gambling.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(() => {
    mockUser.money = 0;
    mockUser.debt = 0;
    mockUser.principalDebt = 0;
    mockUser.stock = [];

    args = [];
    
    msg = {
      channel: {
        send: jest.fn(),
        createMessageComponentCollector: (options = {}) => new eventEmitter(),
      },
      reply: jest.fn(() => msg),
      author: {
        id: 'test id',
        username: 'test name',
      },
      mentions: {
        members: new Collection(),
      } as unknown as MessageMentions,
    } as unknown as Message;
  });

  async function setMoney(money: number) {
    (await gambling.updateOne({ id: 'test id' }, { $set: { money } })).matchedCount;
  }

  async function setDebt(debt: number) {
    (await gambling.updateOne({ id: 'test id' }, { $set: { principalDebt: debt, debt } })).matchedCount;
  }

  async function getCommand(name: string): Promise<Command> {
    return (await import(`../src/commands/gambling/${name}`)).default
  }

  it('join', async () => {
    const command = await getCommand('join');

    await command.execute({ msg, args, client });
    const user = await gambling.findOne({ id: 'test id' });
    expect(msg.reply).toHaveBeenCalledWith(client.messages.gambling.join.success);
    expect(user).toMatchObject(mockUser);

    await command.execute({ msg, args, client });
    expect(msg.reply).toHaveBeenLastCalledWith(client.messages.gambling.join.alreadyJoin);
  });

  it('baseMoney', async () => {
    const command = await getCommand('baseMoney');

    await setMoney(0);
    await command.execute({ msg, args, client });
    const user = await gambling.findOne({ id: 'test id' });

    mockUser.money = 25000;
    mockUser.baseMoneyCoolTime = user.baseMoneyCoolTime;
    expect(user).toMatchObject(mockUser);
    expect(msg.reply).toHaveBeenLastCalledWith(client.messages.gambling.baseMoney.success(25000))

    await command.execute({ msg, args, client });
    expect(msg.reply).toHaveBeenLastCalledWith(client.messages.gambling.baseMoney.haveMoney);
  });

  it('daily', async () => {
    const command = await getCommand('daily');

    await setMoney(0);
    await command.execute({ msg, args, client });
    const user = await gambling.findOne({ id: 'test id' });

    mockUser.money = expect.any(Number);
    mockUser.date = parseFloat(today);

    expect(user).toMatchObject(mockUser);
    expect(user.money).toBeGreaterThanOrEqual(50000);
    expect(user.money).toBeLessThanOrEqual(100000);
    expect(msg.reply).toHaveBeenLastCalledWith(client.messages.gambling.daily.success(0, user.money));

    await command.execute({ msg, args, client });
    expect(msg.reply).toHaveBeenLastCalledWith(client.messages.gambling.daily.today);
  })

  it('balance', async () => {
    const command = await getCommand('balance');

    await setMoney(10000);
    await command.execute({ msg, args, client });
    expect(msg.reply).toHaveBeenLastCalledWith(client.messages.gambling.balance('test name', 10000));

    await setMoney(5000);
    await command.execute({ msg, args, client });
    expect(msg.reply).toHaveBeenLastCalledWith(client.messages.gambling.balance('test name', 5000));
  });

  it('gambling', async () => {
    const command = await getCommand('gambling');

    await command.execute({ msg, args, client });
    expect(msg.reply).toHaveBeenLastCalledWith(client.messages.naturalNumber);

    args = ['-1'];
    await command.execute({ msg, args, client });
    expect(msg.reply).toHaveBeenLastCalledWith(client.messages.naturalNumber);

    args = ['2000'];
    await setMoney(1000)
    await command.execute({ msg, args, client });
    expect(msg.reply).toHaveBeenLastCalledWith(client.messages.overMoney(1000));

    args = ['3000'];
    await setMoney(10000);
    await command.execute({ msg, args, client });
    const user = await gambling.findOne({ id: 'test id' });
    expect([7000, 13000]).toContain(user.money);

    if (user.money == 7000) {
      mockUser.money = 7000;
      expect(user).toMatchObject(mockUser);
      expect(msg.reply).toHaveBeenLastCalledWith(client.messages.gambling.failureGamb(10000, 3000));
    } else if (user.money == 13000) {
      mockUser.money = 13000;
      expect(user).toMatchObject(mockUser);
      expect(msg.reply).toHaveBeenLastCalledWith(client.messages.gambling.successGamb(10000, 3000));
    }
  });

  it('allIn', async () => {
    const command = await getCommand('allIn');

    await setMoney(0);
    await command.execute({ msg, args, client });
    expect(msg.reply).toHaveBeenLastCalledWith(client.messages.noneMoney);

    await setMoney(10000);
    await command.execute({ msg, args, client });
    const user = await gambling.findOne({ id: 'test id' });
    expect([0, 20000]).toContain(user.money);

    if (user.money == 0) {
      mockUser.money = 0;
      expect(user).toMatchObject(mockUser);
      expect(msg.reply).toHaveBeenLastCalledWith(client.messages.gambling.failureGamb(10000, 10000));
    } else if (user.money == 20000) {
      mockUser.money = 20000;
      expect(user).toMatchObject(mockUser);
      expect(msg.reply).toHaveBeenLastCalledWith(client.messages.gambling.successGamb(10000, 10000));
    }
  })

  it('half', async () => {
    const command = await getCommand('half');

    await setMoney(0);
    await command.execute({ msg, args, client });
    expect(msg.reply).toHaveBeenLastCalledWith(client.messages.noneMoney);

    await setMoney(10000);
    await command.execute({ msg, args, client });
    const user = await gambling.findOne({ id: 'test id' });
    expect([5000, 15000]).toContain(user.money);

    if (user.money == 5000) {
      mockUser.money = 5000;
      expect(user).toMatchObject(mockUser);
      expect(msg.reply).toHaveBeenLastCalledWith(client.messages.gambling.failureGamb(10000, 5000));
    } else if (user.money == 15000) {
      mockUser.money = 15000;
      expect(user).toMatchObject(mockUser);
      expect(msg.reply).toHaveBeenLastCalledWith(client.messages.gambling.successGamb(10000, 5000));
    }
  })

  it('loan', async () => {
    const command = await getCommand('loan');

    await setMoney(10000);
    await command.execute({ msg, args, client });
    expect(msg.reply).toHaveBeenLastCalledWith(client.messages.naturalNumber);

    args = ['-10'];
    await command.execute({ msg, args, client });
    expect(msg.reply).toHaveBeenLastCalledWith(client.messages.naturalNumber);

    args = ['1000001'];
    await command.execute({ msg, args, client });
    expect(msg.reply).toHaveBeenLastCalledWith(client.messages.gambling.loan.overMoney);

    args = ['900001'];
    await setDebt(100000);
    await command.execute({ msg, args, client });
    expect(msg.reply).toHaveBeenLastCalledWith(client.messages.gambling.loan.overMoney);

    args = ['500000'];
    await command.execute({ msg, args, client });
    const user = await gambling.findOne({ id: 'test id' });

    mockUser.debt = 600000;
    mockUser.principalDebt = 600000;
    mockUser.money = 510000;
    expect(msg.reply).toHaveBeenLastCalledWith(client.messages.gambling.loan.success(100000, 500000))
    expect(user).toMatchObject(mockUser);
  });

  it('debt', async () => {
    const command = await getCommand('debt');

    await setDebt(10000);
    await command.execute({ msg, args, client });
    expect(msg.reply).toHaveBeenLastCalledWith(client.messages.gambling.debt('test name', 10000));

    await setDebt(5000);
    await command.execute({ msg, args, client });
    expect(msg.reply).toHaveBeenLastCalledWith(client.messages.gambling.debt('test name', 5000));
  });

  it('payBack', async () => {
    const command = await getCommand('payBack');

    await command.execute({ msg, args, client });
    expect(msg.reply).toHaveBeenLastCalledWith(client.messages.naturalNumber);

    args = ['-10'];
    await command.execute({ msg, args, client });
    expect(msg.reply).toHaveBeenLastCalledWith(client.messages.naturalNumber);

    args = ['30000'];
    await setMoney(20000);
    await command.execute({ msg, args, client });
    expect(msg.reply).toHaveBeenLastCalledWith(client.messages.overMoney(20000));

    args = ['10000'];
    await setDebt(5000);
    await command.execute({ msg, args, client });
    expect(msg.reply).toHaveBeenLastCalledWith(client.messages.gambling.payBack.overMoney(5000));

    args = ['5000'];
    await command.execute({ msg, args, client });
    const user = await gambling.findOne({ id: 'test id' });

    mockUser.debt = 0;
    mockUser.principalDebt = 0;
    mockUser.money = 15000;
    expect(user).toMatchObject(mockUser);
    expect(msg.reply).toHaveBeenLastCalledWith(client.messages.gambling.payBack.success(5000, 5000))
  });

  it('rsp', async () => {
    const command = await getCommand('rsp');

    args = ['test'];
    await command.execute({ msg, args, client });
    expect(msg.reply).toHaveBeenLastCalledWith('??????, ??????, ??? ??? ????????? ??????????????????????????????.\n !rsp <??????/??????/???> <???>');

    args = ['??????'];
    await command.execute({ msg, args, client });
    expect(msg.reply).toHaveBeenLastCalledWith('????????? ????????? ?????????????????? ????????????.');

    args = ['??????', '-1'];
    await command.execute({ msg, args, client });
    expect(msg.reply).toHaveBeenLastCalledWith('????????? ????????? ?????????????????? ????????????.');

    args = ['??????', '20000'];
    await setMoney(10000);
    await command.execute({ msg, args, client });
    expect(msg.reply).toHaveBeenLastCalledWith('?????? ???????????? ?????? ?????? ???????????? ??? ????????????. \n?????? ??????: 10,000???');

    args = ['??????', '5000'];
    await command.execute({ msg, args, client });
    const user = await gambling.findOne({ id: 'test id' });
    expect([5000, 8000, 17500]).toContain(user.money);
  });

  it('send', async () => {
    const command = await getCommand('send');

    await command.execute({ msg, args, client })
    expect(msg.reply).toHaveBeenLastCalledWith('????????? ????????? ?????????????????? ????????????.')
    const target = {
      id: 'test send id',
    } as unknown as GuildMember;

    msg.mentions.members?.set('key', target);

    await command.execute({ msg, args, client });
    expect(msg.reply).toHaveBeenLastCalledWith('????????? ????????? ????????? ?????? ???????????????.');

    const newUser = new gambling({ id: 'test send id', name: 'test send name' });
    await newUser.save();

    await command.execute({ msg, args, client });
    expect(msg.reply).toHaveBeenLastCalledWith('????????? ????????? ?????????????????? ????????????.');

    args = ['', '-1'];
    await setMoney(10000);
    await command.execute({ msg, args, client });
    expect(msg.reply).toHaveBeenLastCalledWith('????????? ????????? ?????????????????? ????????????.');

    args = ['', '100000'];
    await command.execute({ msg, args, client });
    expect(msg.reply).toHaveBeenLastCalledWith('?????? ???????????? ?????? ?????? ???????????? ??? ????????????. \n?????? ??????: 10,000???');

    args = ['', '10000'];
    await command.execute({ msg, args, client });
    const sendUser = await gambling.findOne({ id: 'test id' });
    const targetUser = await gambling.findOne({ id: 'test send id' });

    expect(sendUser).toMatchObject(mockUser);
    expect(targetUser.money).toBe(10000);
    expect(msg.reply).toHaveBeenLastCalledWith('??????????????? test send name????????? 10,000?????? ??????????????????!');

    await gambling.deleteOne({ id: 'test send id' });
  });

  it('ranking', async () => {
    const command = await getCommand('ranking');

    for (let i = 0; i < 5; i++) {
      const money = Math.sin(i) < 0 ? Math.floor(Math.sin(i) * -10000) : Math.floor(Math.sin(i) * 10000);
      const newUser = new gambling({ id: `test ranking id ${i}`, name: `test ranking name ${i}`, money });
      await newUser.save();
    }

    await command.execute({ msg, args, client });
    const embed = {
      'author': null,
      'color': null,
      'title': '??????',
      'description': '????????? ??? ????????? ???????????????.',
      'fields': [
        { 'inline': false, 'name': 'test ranking name 2', 'value': '9,092???' },
        { 'inline': false, 'name': 'test ranking name 1', 'value': '8,414???' },
        { 'inline': false, 'name': 'test ranking name 4', 'value': '7,568???' },
        { 'inline': false, 'name': 'test ranking name 3', 'value': '1,411???' },
      ],
      'footer': null,
      'image': null,
      'provider': null,
      'thumbnail': null,
      'timestamp': null,
      'type': 'rich',
      'url': null,
      'video': null,
    } as MessageEmbed;
    expect(msg.channel.send).toHaveBeenCalledWith({ embeds: [embed] });
  });
});
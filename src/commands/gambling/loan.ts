import { gambling } from '../../models/gambling';
import { Command } from '../../managers/Commands';

export default new Command({
  name: '대출',
  category: '도박',
  usage: '대출 <돈>',
  description: '최대 100만원까지의 돈을 대출합니다.',
  execute: async ({ msg, args, client }) => {
    const id = msg.author.id;
    const user = await client.models.gambling.findOne({ id });

    const debt = parseFloat(args[0]);
    if (!Number.isInteger(debt) || debt <= 0)
      return msg.reply(client.messages.naturalNumber);

    if (user.debt + debt > 1000000)
      return msg.reply(client.messages.gambling.loan.overMoney);

    (await client.models.gambling.updateOne({ id }, { $inc: { principalDebt: debt, debt, money: debt } })).matchedCount;
    msg.reply(client.messages.gambling.loan.success(user.debt, debt));
  },
});
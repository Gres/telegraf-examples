/**
 * keyboard-bot
 */
const Telegraf = require('telegraf')
const { Extra, Markup } = require('telegraf')

module.exports = () => {
  const bot = new Telegraf(process.env.BOT_TOKEN)

  //зарегистрировать посредника для логгирования
  bot.use(Telegraf.log())

  //при получении команды onetime:
  //отправить сообщение 'One time keyboard',
  //отобразить клавиатуру с тремя кнопками
  bot.command('onetime', ({ reply }) =>
    reply('One time keyboard', Markup
      .keyboard(['/simple', '/inline', '/pyramid'])
      .oneTime()
      .resize()
      .extra()
    )
  )

  //при получении команды custom:
  //отправить сообщение 'Custom buttons keyboard',
  //отобразить клавиатуру с семью кнопками, распределенными между тремя строками: две
  //в первой строке, две - во второй и три - в третьей
  bot.command('custom', ({ reply }) => {
    return reply('Custom buttons keyboard', Markup
      .keyboard([
        ['🔍 Search', '😎 Popular'],         // Row1 with 2 buttons
        ['☸ Setting', '📞 Feedback'],       // Row2 with 2 buttons
        ['📢 Ads', '⭐️ Rate us', '👥 Share'] // Row3 with 3 buttons
      ])
      .oneTime()
      .resize()
      .extra()
    )
  })

  //при получении команды special
  //отправить сообщение 'Special buttons keyboard',
  //отобразить клавиатуру с двумя кнопками:
  //кнопками, запрашивающая контакты,
  //кнопка, запрашивающая местоположение.
  bot.command('special', (ctx) => {
    //метод Extra.markup может принимать функцию, которая принимает объект класса Markup
    return ctx.reply('Special buttons keyboard', Extra.markup((markup) => {
      return markup.resize()
        .keyboard([
          markup.contactRequestButton('Send contact'),
          markup.locationRequestButton('Send location')
        ])
    }))
  })

  //при получении команды pyramid
  //отправить сообщение 'Keyboard wrap',
  //отобразить клавиатуру с шестью кнопками, распределенными между тремя строками:
  //одна в первой строке, две - во второй и три - в третьей.
  bot.command('pyramid', (ctx) => {
    //метод Extra.markup может принимать объект класса Markup и объект с
    //дополнительными параметрами (в данном случае с параметром wrap)
    return ctx.reply('Keyboard wrap', Extra.markup(
      Markup.keyboard(['one', 'two', 'three', 'four', 'five', 'six'], {
        //btn - название кнопки,
        //index - индекс кнопки,
        //currentRow - массив с кнопками, расположенными на данной строке
        //если метод wrap возвращает false, то добавить кнопку в текущую строку, если
        //он возвращает true, то перейти к следующей строке
        wrap: (btn, index, currentRow) => currentRow.length >= (index + 1) / 2
      })
    ))
  })

  //при получении команды simple
  //отправить сообщение, содержащее указанный HTML-код, добавив к нему клавиатуру с
  //двумя кнопками
  bot.command('simple', (ctx) => {
    return ctx.replyWithHTML('<b>Coke</b> or <i>Pepsi?</i>', Extra.markup(
      Markup.keyboard(['Coke', 'Pepsi'])
    ))
  })

  //при получении команды inline
  //отправить сообщение, содержащее указанный HTML-код, добавив к нему встроенную
  //клавиатуру с двумя кнопками, при нажатии на каждую из кнопок инициализируется
  //соответствующее событие
  bot.command('inline', (ctx) => {
    return ctx.reply('<b>Coke</b> or <i>Pepsi?</i>', Extra.HTML().markup((m) =>
      m.inlineKeyboard([
        //инициализировать событие Coke
        m.callbackButton('Coke', 'Coke'),
        //инициализировать событие Pepsi
        m.callbackButton('Pepsi', 'Pepsi')
      ])))
  })

  //при получении команды random
  //отправить сообщение 'random example', добавив к нему встроенную клавиатуру с
  // двумя/тремя кнопками
  bot.command('random', (ctx) => {
    return ctx.reply('random example',
      Markup.inlineKeyboard([
        //инициализировать событие Coke
        Markup.callbackButton('Coke', 'Coke'),
        //инициализировать событие Dr Pepper
        //третьим параметром метод callbackButton принимает флаг, который указывает,
        //отображать кнопку или нет
        Markup.callbackButton('Dr Pepper', 'Dr Pepper', Math.random() > 0.5),
        //инициализировать событие Pepsi
        Markup.callbackButton('Pepsi', 'Pepsi')
      ]).extra()
    )
  })

  //при получении сообщения '/wrap <одна или несколько цифр>'
  //отправить сообщение 'Keyboard wrap',
  //отобразить клавиатуру с шестью кнопками, распределенными между указанным
  //количеством столбцов
  bot.hears(/\/wrap (\d+)/, (ctx) => {
    return ctx.reply('Keyboard wrap', Extra.markup(
      Markup.keyboard(['one', 'two', 'three', 'four', 'five', 'six'], {
        //свойство columns содержит количество столбцов
        columns: parseInt(ctx.match[1])
      })
    ))
  })

  //при инициализации события Dr Pepper
  //отправить сообщение со смайликом
  bot.action('Dr Pepper', (ctx, next) => {
    return ctx.reply('👍').then(next)
  })

  //при инициализации любого события
  //выводить всплывающую подсказку с сообщением 'Oh, <choice>! Great choise'
  bot.action(/.+/, (ctx) => {
    return ctx.answerCallbackQuery(`Oh, ${ctx.match[0]}! Great choise`)
  })

  bot.startPolling()
}

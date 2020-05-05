import Loader from './loader.js'
export class Main extends Loader {
  async render() {
      main.setLoading(true)
      await main.load()

      if (main.App.userdata[1].toNumber() != 2 && main.App.userdata[1].toNumber() != 1) // if not seller or admin
        main.goBack()

      await main.renderOptions()
      main.setLoading(false)
  }

  async renderOptions(app = null) {
    if ($('#options').length != 0)
      return

    if (app != null)
      main.App = app

    $('#content').append('<div id="options"></div>')
    var options = $('#options')
    options.css({'text-align':'center'})
    options.append('<button type="button" id="1" class="option">Create game</button>')
    $('#1').on('click', main.renderCreateGame)
    options.append('<button type="button" id="2" class="option">Your games</button>')
    $('#2').on('click', main.renderMyGames)
    options.append('<button type="button" id="3" class="option">Edit game</button>')
    $('#3').on('click', main.renderUpdateGame)
    if (typeof main.App.userdata !== 'undefined' && main.App.userdata[4] != 0)
    {
      options.append('<br><button type="button" id="debtbtn" class="option" style="color:red"><b>Return debt to the shop</b></button>')
      $('#debtbtn').on('click', main.renderDebtReturnForm)
      $('#1, #3').prop('disabled', true)
    }

    $('.option').css({'width':'140px','heigth':'50px','margin':'5px'})
  }

  async renderCreateGame() {
    if ($('#create').length != 0)
    {
      $('#create').remove()
      return
    }
    
    main.clearContent()

    $('#options').after('<div id="create"></div>')

    var div = $('#create')
    div.hide()

    div.css({'padding':'2%', 'text-align':'center', 'width':'40%', 'margin-bottom':'2%', 'margin-top':'1%', 'margin-left':'30%', 'margin-right':'30%', 'border-style': 'solid', 'border-width':'thin', 'border-color':'darkgray'})
    div.append('<h4 style="text-align:center">Create Game</h4>')
    div.append('<form id="newGame"></form>')
    var form = $('#newGame')
    form.append('<label for="name">Name: </label>')
    form.append('<input id="name" type="text" placeholder="Game\'s name"><br>')
    form.append('<label for="releaseYear">Year: </label>')
    form.append('<input id="releaseYear" type="number" min="1900" max="2020"><br>')
    form.append('<label for="price">Price (eth): </label>')
    form.append('<input id="price" type="number" step="0.01" min="0.01" max="100" placeholder="Price in eth"><br>')
    form.append('<textarea id="shortDesc" rows="4" cols="50" maxlength="280" placeholder="Short description"></textarea><br>')
    form.append('<input type="checkbox" id="sale" checked="true">')
    form.append('<label for="sale">Set game for sale</label><br>')
    form.append('<input type="submit" value="Create"></input>')
    form.append("&nbsp;&nbsp;&nbsp;")
    form.append('<button type="button" id="cancelCreate">Cancel</button>')
    form.submit(main.createGame)
    form.find('#name, #releaseYear, #price').css({'width': '30%',})
    form.find('#cancelCreate').on('click', main.clearContent)

    div.show()
  }

  async renderDebtReturnForm() {
    if ($('#debt').length != 0)
    {
      $('#debt').remove()
      return
    }

    main.clearContent()

    $('#options').append('<div id="debt"></div>')
    var div = $('#debt')
    div.hide()
    div.css({'padding':'10px','text-align':'center', 'width':'50%', 'margin-top':'10px', 'margin-left':'25%', 'margin-right':'25%', 'border-style': 'solid', 'border-width':'thin', 'border-color':'darkgray'})

    div.append('<form id="returndebt"></form>')
    var form = $('#returndebt')
    form.append('<p>Your total debt is: ' + main.App.userdata[4] + '</p>')
    form.append('<label for="amountToReturn">Amount to return: </label>')
    form.append('<input type="number" id="amountToReturn" min="1" required>')
    form.append('<button type="submit">OK</button>')
    form.submit(main.returnDebt)

    div.show()
  }

  async returnDebt(e) {
    e.preventDefault()
    main.setLoading(true)
    var amount = $('#amountToReturn').val()
    window.alert('confirm the transaction to return debt')
    await main.App.shop.ReturnDebt({from: main.App.account, value: amount})
    main.clearContent()
    window.location.reload()
  }

  async renderMyGames() {
    if ($('#myGames').length != 0)
    {
      $('#myGames').remove()
      return
    }
    
    main.clearContent()

    $('#options').after('<div id="myGames"></div>')

    var div = $('#myGames')
    div.hide()
    div.css('text-align', 'center')
    div.append('<center><h4>List of your created games</h4></center>')

    var createdGames = await main.App.shop.GetSellersGames(main.App.account)
    if (createdGames.length != 0)
    {

      div.append('<table id="gamesTable"></table>')
      var table = $('#gamesTable')

      table.css({'width': '60%','margin-left': '20%', 'margin-right': '20%'})

      table.append('<tr></tr>')
      table.find('tr').append('<td><b>ID</b></td>')
      table.find('tr').append('<td><b>Name</b></td>')
      table.find('tr').append('<td><b>Price</b></td>')
      table.find('tr').append('<td><b>Sold copies</b></td>')
      table.find('tr').append('<td><b>Created</b></td>')
      table.find('tr').append('<td><b>Status</b></td>')

      for (var i = 0; i<createdGames.length; i++)
      {
        var id = web3.toBigNumber(createdGames[i]).toNumber()
        var game = await main.App.shop.games(id)

        if(!game[0]) // jei zaidimas istrintas, neirasinejam niekur
          continue

        var name = game[3]
        var price = main.makeEth(game[5]) + ' eth'
        if (game[8])
          var status = "For sale"
        else
          var status = "Not for sale"
        var sold = game[7].toNumber()
        var date = main.makeDate(game[9])

        // add values to table
        table.append('<tr></tr>')
        var row = table.find('tr').last()
        row.append('<td>' + id + '</td>')
        row.append('<td><a href="game.html?id=' + id + '">' + name + '</a></td>')
        row.append('<td>' + price + '</td>')
        row.append('<td>' + sold + '</td>')
        row.append('<td>' + date + '</td>')
        row.append('<td>' + status + '</td>')
      }
      $('#gamesTable, th, td').css({'border': '1px solid black', 'border-collapse':'collapse'})

    }
    else{
      div.append('<p>You havent added any games yet</p>')
    }
    div.show()
  }

  async renderUpdateGame() {
    if ($('#edit').length !=0)
    {
      $('#edit').remove()
      return
    }

    main.clearContent()

    $('#options').after('<div id="edit"></div>')
    var div = $('#edit')
    div.hide()
    div.css({'padding':'10px','text-align':'center', 'width':'50%', 'margin-top':'10px', 'margin-left':'25%', 'margin-right':'25%', 'border-style': 'solid', 'border-width':'thin', 'border-color':'darkgray'})

    var createdGames = await main.App.shop.GetSellersGames(main.App.account)
    div.append('<form id="games"></form>')
    if (createdGames.length > 0)
    {
      var form = $('#games')
      form.append('<label for="gameList">Choose a game to edit: </label>')
      form.append('<select id="gameList"></select>')
      var select = $('#gameList')
      for (var i = 0; i<createdGames.length; i++)
      {
        var game = await main.App.shop.games(web3.toBigNumber(createdGames[i]).toNumber()) 
        if(!game[0]) // jei zaidimas istrintas, neirasinejam niekur
          continue 

        select.append('<option value="' + game[1]/*id*/ + '">' + game[3]/*name*/ + '</option>')
      }
      form.append('&nbsp;&nbsp;<button type="submit">OK</button>')
      form.submit(main.renderGameInfo)
    }
    else{
      div.append('<p>You havent added any games yet</p>')
    }
    div.show()
  }

  async renderGameInfo(e) {
    if (typeof e == 'undefined')
      return
    e.preventDefault()

    if ($('#gameInfo').length != 0)
    { 
      $('#gameInfo').remove()
    }
    
    var id = $('#gameList').val()
    var game = await main.App.shop.games(id)
    $('#games').after('<br><form id="gameInfo"></form>')
    var form = $('#gameInfo')
    form.append('<label for="name">Game\'s name: </label>')
    form.append('<input id="name" type="text" value="' + game[3]  + '" required>')
    form.append('<br>')
    form.append('<label for="year">Year: </label>')
    form.append('<input id="year" type="number" value="' + game[6] + '" required>')
    form.append('<br>')
    form.append('<label for="price">Price (eth): </label>')
    form.append('<input id="price" type="number" min="0.01" max="100" step="0.01" value="' + Math.round((web3.fromWei(game[5], 'ether').toNumber() + Number.EPSILON) * 100) / 100 + '" required>')
    form.append('<br>')
    form.append('<textarea id="shortDesc" rows="6" cols="50" maxlength="280">' + game[4] + '</textarea>')
    form.append('<br>')
    if (game[8])
      form.append('<input type="checkbox" id="sale" checked="true">')
    else 
      form.append('<input type="checkbox" id="sale">')
    form.append('<label for="sale">Set game on sale </label>')
    form.append('<br>')
    form.append('<button type="submit">Done</button>')
    form.append('&nbsp;&nbsp;<button id="deleteGame" type="button" style="color:red">DELETE GAME</button>')
    form.append('&nbsp;&nbsp;<button id="cancelEdit" type="button">Cancel</button>')
    form.find('#cancelEdit').on('click', main.clearContent)
    form.find('#deleteGame').on('click', {id: id}, main.deleteGame)
    form.submit({id: id}, main.updateGame)
  }

  clearContent() {
    var content = $('#content')
    content.find('div:not(#options)').remove()
  }

  async createGame(e) {
    e.preventDefault()

    main.setLoading(true)
    window.alert('confirm the transaction to create new game')
    var name = $('#name').val()
    var year = $('#releaseYear').val()
    var price = $('#price').val() * 1000000000000000000 // wei
    var desc = $('#shortDesc').val()
    var state = $('#sale').is(":checked")
    await main.App.shop.CreateGame(name, desc, price, year, state)
    main.clearContent()
    main.setLoading(false)
  }

  async deleteGame(e) {
    main.setLoading(true)
    window.alert("confirm the transaction if you really want to delete this game")
    await main.App.shop.DeleteGame(e.data.id)
    main.clearContent()
    main.setLoading(false)
  }

  async updateGame(e) {
    e.preventDefault()
    main.setLoading(true)
    var name = $('#gameInfo #name').val()
    var year = $('#gameInfo #year').val()
    var price = $('#gameInfo #price').val()
    var desc = $('#gameInfo #shortDesc').val() * 1000000000000000000 // wei
    var state = $('#gameInfo #sale').is(":checked")
    window.alert("confirm the transaction to submit game's changes")
    await main.App.shop.UpdateGame(e.data.id, name, desc, price, year, state);
    main.clearContent()
    main.setLoading(false)
  }
}

let main = new Main()
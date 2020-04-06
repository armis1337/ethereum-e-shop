App = {                                                                                                                                                               
    loading: false,                                                                                                                                                     
    contracts: {},                                                                                                                                                      
                                                                                                                                                                        
    load: async () => {                                                                                                                                                 
      //await App.setLoading(true)                                                                                                                                      
      await App.loadWeb3()                                                                                                                                              
      await App.loadAccount()                                                                                                                                           
      await App.loadContract()                                                                                                                                          
      await App.render()                                                                                                                                                
    },                                                                                                                                                                  
                                                                                                                                                                        
    loadWeb3: async () => {                                                                                                                                             
      if(typeof web3 !== 'undefined')                                                                                                                                   
      {                                                                                                                                                                 
        App.web3Provider = web3.currentProvider                                                                                                                         
        web3 = new Web3(web3.currentProvider)                                                                                                                           
      }                                                                                                                                                                 
      else                                                                                                                                                              
      {                                                                                                                                                                 
        window.alert("Pls connect to metamask...")                                                                                                                      
      }
      // modern dapp browsers
      if (window.ethereum){
        window.web3 = new Web3(ethereum)
        //console.log("sweiki")
        try
        {
          //request account access if needed
          await ethereum.enable()
          //accounts now exposed
          //web3.eth.sendTransaction({/* ... */})
        }
        catch (error)
        {
          //user denied account access...
          console.log(error)
          //window.alert("Please allow access")
        }
      }
      // legacy dapp browsers
      else if (window.web3)
      {
        App.web3Provider = web3.currentProvider
        window.web3 = new Web3(web3.currentProvider)
        // accounts always exposed
        //web3.eth.sendTransaction({/* ... */})
      }
      // non-dapp browsers
      else
      {
        console.log('non-ethereum browser detected. you should consider trying metamask!')
      }
    },
  
    loadAccount: async () => {
      // set the current blockchain account
      const accounts = await ethereum.enable()
      //App.account = accounts[0]
      App.account = web3.eth.accounts[0]
    },
  
    loadContract: async () => {
      //create a javascript version of the smart contract 
      const shop = await $.getJSON('EShop.json')
      App.contracts.Shop = TruffleContract(shop)
      App.contracts.Shop.setProvider(App.web3Provider)
  
      // fill the smart contract with the values from blockchain
      App.shop = await App.contracts.Shop.deployed()
      //userdata = await App.shop.Users(App.account.toString())
    },
  
    render: async () => {
      // prevent double render
      if (App.loading) {
        return
      }
  
      //update the app loading state
      App.setLoading(true)

      
      var userdata = await App.shop.Users(App.account.toString())

      if (userdata[1].toNumber() != 2 && userdata[1].toNumber() != 1) // if not seller or admin
        App.goBack()
      
      App.renderGames()

      App.setLoading(false)
    },

    goBack: () => {
        //$('#content').remove()
        window.location.replace('index.html')
        window.reload(true)
    },

    renderGame: async() => {
      var id = $('#gameList').val()
      var game = await App.shop.games(id)
      //console.log('id = ' + id)
      //console.log('name = ' + game[3])

      App.cancelEdit()

      //$('#content').append('<div id="editGame"><form id="updateGame" onSubmit="App.updateGame(' + id + ');return false;"></form></div>')
      $('.games').after('<div id="editGame"><form id="updateGame" onSubmit="App.updateGame(' + id + ');return false;"></form></div>')
      var form = $('#updateGame')
      form.append('<hr>')
      form.append('<label for="name">Game\'s name: </label>')
      form.append('<input id="name" type="text" value="' + game[3]  + '" required>')
      form.append('<br>')
      form.append('<label for="year">Year: </label>')
      form.append('<input id="year" type="number" value="' + game[6] + '" required>')
      form.append('<br>')
      form.append('<label for="price">Price (wei): </label>')
      form.append('<input id="price" type="number" step="0.0000001" value="' + game[5] + '" required>')
      form.append('<br>')
      form.append('<textarea id="shortDesc" rows="6" cols="50" maxlength="280">' + game[4] + '</textarea>')
      form.append('<br>')
      if (game[8])
        form.append('<input type="checkbox" id="sale" checked="true">')
      else 
        form.append('<input type="checkbox" id="sale">')
      //console.log(game[8])
      form.append('<label for="sale">Set game on sale </label>')
      form.append('<br>')
      form.append('<button type="submit">Done</button>')
      form.append('    <button onClick="App.deleteGame('+ id +')" type="button" style="color:red">DELETE GAME</button>')
      form.append('<br>')
      form.append('<button onClick="App.cancelEdit(); return false;" type="button">Cancel</button>')
    },

    cancelEdit: () => {
      $('#editGame').remove()
    },

    renderGames: async() => {
      var createdGames = await App.shop.GetSellersGames(App.account)
      console.log(createdGames.length)

      // render users created games into table AND dropdown

      if (createdGames.length != 0)
      {
        // sukuriam lentele
        $('.myGames').empty()
        $('.myGames').html('<hr>')
        $('.myGames').append('<center><h4>List of your created games</h4></center>')
        $('.myGames').append('<table id="gamesTable" style="width:100%"></table>')

        var table = $('#gamesTable')

        table.css('border', '1px solid black')
        table.css('border-collapse', 'collapse')

        table.append('<tr></tr>')
        table.find('tr').append('<td>ID</td>')
        table.find('tr').append('<td>Name</td>')
        table.find('tr').append('<td>Price</td>')
        table.find('tr').append('<td>Sold copies</td>')
        table.find('tr').append('<td>Status</td>')

        // sutvarkom dropdown
        $('#gameList').empty()
        $('#gameList').attr('disabled', false)
        $('.games :submit').attr('disabled', false)

        for (var i = 0; i<createdGames.length; i++)
        {
          var game = await App.shop.games(web3.toBigNumber(createdGames[i]).toNumber())

          if(!game[0]) // jei zaidimas istrintas, neirasinejam niekur
            continue

          table.append('<tr></tr>')
          row = table.find('tr').last()
          var id = web3.toBigNumber(createdGames[i]).toNumber()
          var name = game[3]
          var price = game[5]
          if (game[8])
            var status = "For sale"
          else
            var status = "Not for sale"
          var sold = game[7].toNumber()

          // sumetam reiksmes i lentele
          row.append('<td>' + id + '</td>')
          row.append('<td>' + name + '</td>')
          row.append('<td>' + price + '</td>')
          row.append('<td>' + sold + '</td>')
          row.append('<td>' + status + '</td>')

          // sumetam reiksmes i dropdown
          $('#gameList').append('<option value="' + id + '">' + name + '</option>')
        }
        table.find('th').css('border', '1px solid black')
        table.find('th').css('border-collapse', 'collapse')
        table.find('th').css('padding', '15px')
        table.find('td').css('border', '1px solid black')
        table.find('td').css('border-collapse', 'collapse')
        table.find('td').css('padding', '10px')
      }
      else
      {
        $('#gameList').attr('disabled', true)
        $('.games :submit').attr('disabled', true)
        return
      }
    },

    createGame: async () => {
      App.setLoading(true)
      var name = $('#newGame').val()
      var year = $('#releaseYear').val()
      var price = $('#price').val()
      var desc = $('#shortDesc').val()
      var state = $('#sale').is(":checked")
      await App.shop.CreateGame(name, desc, price, year, state)
      App.setLoading(false)
      window.location.reload()
    },

    deleteGame: async(id) => {
      App.setLoading(true)
      window.alert("confirm the transaction if you really want to delete this game")
      await App.shop.DeleteGame(id)
      window.location.reload()
    },

    updateGame: async(id) => {
      App.setLoading(true)
      var name = $('#updateGame #name').val()
      var year = $('#updateGame #year').val()
      var price = $('#updateGame #price').val()
      var desc = $('#updateGame #shortDesc').val()
      console.log('desc = ' + desc)
      var state = $('#updateGame #sale').is(":checked")
      //console.log(name, year, price, desc, state)
      //await App.setLoading(true)
      window.alert("confirm the transaction to submit game's changes")
      await App.shop.UpdateGame(id, name, desc, price, year, state);
      window.location.reload()
    },
  
    setLoading: (boolean) => {
      App.loading = boolean
      const loader = $('#loader')
      const content = $('#content')
      if (boolean)
      {
        loader.show()
        content.hide()
      }
      else
      {
        loader.hide()
        content.show()
      }
    }
  }
  
  $(() => {
    $(window).load(() => {
      App.load()
    })
  })
  
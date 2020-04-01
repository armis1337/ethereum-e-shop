var App = {                                                                                                                                                               
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
    },
  
    render: async () => {
      // prevent double render
      if (App.loading) {
        return
      }
  
      //update the app loading state
      App.setLoading(true)
      
      //check if admin
      var userdata = await App.shop.Users(App.account.toString())
      if (userdata[1] != 2)
      {
        $('#content').html('<center><h2 style="color:red">you are not an admin,<br> get out</h2></center>')
        $('#content').append('<br><center><a href="index.html">Home</a></center>')
        App.setLoading(false)
        return
      }


      //add games to dropdown list
      var gameCount = await App.shop.gameCount()
      var gamesLen = await App.shop.GetGamesLength()
      gamesLen = gamesLen.toNumber()
      //console.log(gamesLen)
      for (var i=0; i<gamesLen; i++)
      {
        var game = await App.shop.games(i)
        if(!game[0])
          continue
        $('#gameList').append('<option value="' + game[1]/*id*/ + '">' + game[3]/*name*/ + '</option>')
      }
      //$('#editGame').on('submit', {/*id: $("select#gameList").val()*/}, App.renderGame)
      
      App.setLoading(false)
    },

    renderGame: async() => {
      var id = $('#gameList').val()
      var game = await App.shop.games(id)

      App.cancelEdit()

      $('#content').append('<div id="editGame"><form id="updateGame" onSubmit="App.updateGame(' + id + ');return false;"></form></div>')
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
      form.append('<textarea id="shortDesc" rows="4" cols="50" maxlength="280">' + game[4] + '</textarea>')
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

    deleteGame: async(id) => {
      App.setLoading(true)
      window.alert("confirm the transaction if you really want to delete this game")
      await App.shop.DeleteGame(id)
      window.location.reload()
    },

    updateGame: async(id) => {
      App.setLoading(true)
      var name = $('#name').val()
      var year = $('#year').val()
      var price = $('#price').val()
      var desc = $('#shortDesc').val()
      var state = $('#sale').is(":checked")
      //console.log(name, year, price, desc, state)
      //await App.setLoading(true)
      window.alert("confirm the transaction to submit game's changes")
      await App.shop.UpdateGame(id, name, desc, price, year, state);
      window.location.reload()
    },

    createGame: async () => {
      App.setLoading(true)
      var name = $('#newGame').val()
      var year = $('#releaseYear').val()
      var price = $('#price').val()
      var desc = $('#shortDesc').val()
      //var state = $('#sale').val()
      var state = $('#sale').is(":checked")
      await App.shop.CreateGame(name, desc, price, year, state)
      //await App.shop.CreateItem(name)
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
  
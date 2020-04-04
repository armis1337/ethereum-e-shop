var App = {                                                                                                                                                               
    loading: false,       // bv false                                                                                                                                               
    contracts: {},                                                                                                                                                      
                                                                                                                                                                        
    load: async () => {       
      //App.setLoading(true)                                                                                                                                                                                                                                                                              
      await App.loadWeb3()                                                                                                                                              
      await App.loadAccount()                                                                                                                                           
      await App.loadContract()  
      //App.setLoading(false)                                                                                                                                           
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
      if (userdata[1] == 0)
      {
        $('#content').html('<center><h2 style="color:red">you are not an admin,<br>get out</h2></center>')
        $('#content').append('<br><center><a href="index.html">Home</a></center>')
        App.setLoading(false)
        return
      }

      //add games to dropdown list
      var gameCount = await App.shop.gameCount()
      var gamesLen = await App.shop.GetGamesLength()
      gamesLen = gamesLen.toNumber()
      gameCount = gameCount.toNumber()
      //var test = await App.shop.games(0)
      //console.log('test = ' + test[3] + ' id = ' + test[1])
      if (gamesLen > 0 && gameCount > 0)
      {
        $('#gameList').empty()
        $('#gameList').attr('disabled', false)
        $('.games :submit').attr('disabled', false)
        for (var i=0; i<gamesLen; i++)
        {
          var game = await App.shop.games(i)
          //console.log('i='+i + ' id='+game[1] + ' initialized=' + game[0] + ' name=' + game[3])
          if(!game[0])
            continue
          $('#gameList').append('<option value="' + game[1]/*id*/ + '">' + game[3]/*name*/ + '</option>')
          //console.log(game[1] + ' - ' + game[3])
        }
      }
      else
      {
        $('#gameList').attr('disabled', true)
        $('.games :submit').attr('disabled', true)
      }

      await App.renderGroups()
      
      App.setLoading(false)
    },

    renderGroups: async() => {
      //prideti userius i sellers
      $('#groups').append('<hr>')
      $('#groups').append('<form id="seller">')
      var form = $('#groups #seller')
      form.append('<p>Add user to "Sellers" group</p>')
      form.append('<label for="sellerAddress">Users address: </label>')
      form.append('<input id="sellerAddress" type="text" placeholder="0x000..." required>')
      form.append('<input type="submit" value="Add"></input>')
      form.on('submit', {}, App.makeSeller)

      // visu selleriu sarasas
      $('#groups').append('<div id="sellersList"></div>')
      var list = $('#sellersList')
      list.append('<h4>list of all sellers:</h4')
      var sLen = await App.shop.GetSellersLength();
      for (var i = 0; i < sLen; i++)
      {
        //console.log('i = ' + i)
        var addr = await App.shop.Sellers(i)
        if(web3.toBigNumber(addr) != 0)
          list.append("<p>id: " + i + ", address: " + addr)
      }

      // prideti userius i adminus
      $('#groups').append('<hr>')
      $('#groups').append('<form id="admin">')
      var form = $('#groups #admin')
      form.append('<p>Add user to "Administrator" group</p>')
      form.append('<label for="adminAddress">Users address: </label>')
      form.append('<input id="adminAddress" type="text" placeholder="0x000..." required>')
      form.append('<input type="submit" value="Add"></input>')
      form.on('submit', {}, App.makeAdmin)

      // visu adminu sarasas


      $('#groups').append('<div id="adminList"></div>')
      var list = $('#adminList')
      list.append('<h4>list of all administrators:</h4')
      var aLen = await App.shop.GetAdminsLength();
      //sLen = sLen.toNumber()
      for (var i = 0; i < aLen; i++)
      {
        //console.log('i = ' + i)
        var addr = await App.shop.Admins(i)
        if(web3.toBigNumber(addr) != 0)
          list.append("<p>id: " + i + ", address: " + addr)
      }

      // paversti selleri/admina normal useriu
      $('#groups').append('<hr>')
      $('#groups').append('<form id="normal">')
      var form = $('#groups #normal')
      form.append('<p>Remove users groups</p>')
      form.append('<label for="userAddress">Users address: </label>')
      form.append('<input id="userAddress" type="text" placeholder="0x000..." required>')
      form.append('<input type="submit" value="Remove"></input>')
      form.on('submit', {}, App.makeNormal)
    },

    makeSeller: async(e) => {
      e.preventDefault()
      var addr = $('#sellerAddress').val()
      //
      //reik tikrinimo ar nera jau selleris arba adminas
      //
      App.setLoading(true)
      window.alert('confirm the transaction to make user\n' + addr + '\na Seller')
      await App.shop.MakeSeller(addr)
      App.setLoading(false)
      window.location.reload()
    },

    makeAdmin: async(e) => {
      e.preventDefault()
      var addr = $('#adminAddress').val()
      //
      // irgi tikrinimo reik
      //
      App.setLoading(true)
      window.alert('confirm the transaction to make user\n' + addr + '\nAdmin')
      await App.shop.MakeAdmin(addr)
      App.setLoading(false)
      window.location.reload()
    },

    makeNormal: async(e) => {
      e.preventDefault()
      var addr = $('#userAddress').val()
      //
      // irgi tikrinimo reik
      //
      App.setLoading(true)
      window.alert('confirm the transaction to make user\n' + addr + '\nNormal user')
      await App.shop.MakeNormal(addr)
      App.setLoading(false)
      window.location.reload()
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
  
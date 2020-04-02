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
      
      /*
      //render account
      $('#acc').html(App.account)
      var admin = await App.shop.admin()
      $('#adm').html(admin)
      */
      /*$('#acc').html(App.account)
      var gamecount = await App.shop.gameCount()
      gamecount = gamecount.toNumber()
      $('#gameCount').html(gamecount)
      
      var userdata = await App.shop.Users(App.account.toString())
      //console.log(userdata[2].toNumber())
      
      if (userdata[2].toNumber() != 2)
        await $('.admin').remove()*/
      
      await App.renderGames()
      App.setLoading(false)
    },

    renderGames: async() => {
      var gameCount = await App.shop.gameCount()
      var gamesLen = await App.shop.GetGamesLength()
      gamesLen = gamesLen.toNumber()
      if (gameCount > 0)
      {
        $(".gameList").html()
        $(".gameList").empty()
        const br = "<br />"
        const hr = "<hr />"
        for (var i = 0; i < gamesLen; i++)
        {
          //var id = "<p>ID: " + i + "</p>"
          var game = await App.shop.games(i)
          if (!game[0])
            continue
          
          var name = "<p>Name: " + game[3] +  "</p>"
          var desc = "<p>Description: " + game[4] + "</p>"
          var seller = "<p>Seller: " + game[2] + "</p>"
          var price = "<p>Price: " + game[5] + "</p>"
          var releaseYear = "<p>Year released: " + game[6] + "</p>"
          var soldCopies = "<p>Total sold copies: " + game[7] + "</p>"
          var url = "<a href=" + window.location.origin + "/game.html?id=" + i + ">Game's page</a>"
          var ii = "<p>i = " + i + "</p>"
          var id = "<p>id = " + game[1] + "</p>"
          //console.log(url)
          if (game[8] == true)
            var state = "<p>For sale</p>"
          else
            var state = "<p>Not for sale</p>"

          $(".gameList").append(hr, name, seller, price, releaseYear, desc, soldCopies, state, ii, id, url)
        }
      }

        /*if (item[3] == 0)
        {
          status = '<p>Status: For sale</p>'
        }
        else
        {
          status = '</p>Status: Not for sale</p>'
        }
        if (App.account == ownerAddress)
        {
          $(".gameList").append(hr, id, name, owner, price, status, "you are owner of this item")
        }
        else {
          $(".gameList").append(hr, id, name, owner, price, status)
        }*/
        
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
  
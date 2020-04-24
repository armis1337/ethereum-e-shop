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
        try
        {
          await ethereum.enable()
        }
        catch (error)
        {
          //user denied account access...
          console.log(error)
        }
      }
      // legacy dapp browsers
      else if (window.web3)
      {
        App.web3Provider = web3.currentProvider
        window.web3 = new Web3(web3.currentProvider)
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

      await App.renderGames()
      App.setLoading(false)
    },

    renderGames: async() => {
      var gameCount = await App.shop.gameCount()
      if (gameCount > 0)
      {
        $(".gameList").html()
        $(".gameList").empty()
        const br = "<br />"
        const hr = "<hr />"
        for (var i = 0; i < gameCount; i++)
        {
          //var id = "<p>ID: " + i + "</p>"
          var game = await App.shop.games(i)
          var name = "<p>Name: " + game[1] +  "</p>"
          var desc = "<p>Description: " + game[2] + "</p>"
          var seller = "<p>Seller: " + game[0] + "</p>"
          var price = "<p>Price: " + game[3] + "</p>"
          var releaseYear = "<p>Year released: " + game[4] + "</p>"
          var soldCopies = "<p>Total sold copies: " + game[5] + "</p>"
          var url = "<a href=" + window.location.origin + "/game.html?id=" + i + ">Game's page</a>"
          console.log(url)
          if (game[6] == true)
            var state = "<p>For sale</p>"
          else
            var state = "<p>Not for sale</p>"

          $(".gameList").append(hr, name, seller, price, releaseYear, desc, soldCopies, state, url)
        }
      }        
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
  
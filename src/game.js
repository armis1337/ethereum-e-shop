var App = {                                                                                                                                                               
    loading: false,                                                                                                                                                     
    contracts: {},                                                                                                                                                      
                                                                                                                                                                        
    load: async () => {                                                                                                                                                                                                                                                                                 
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
     
      await App.renderGame()
    },

    renderGame: async() => {
      App.setLoading(true)
      //var query_id = window.location.href
      var id = location.search.substring(4)
      var gamesLen = await App.shop.GetGamesLength()
      gamesLen = gamesLen.toNumber()
      //console.log(id)
      if (id > gamesLen)
        App.goBack()

      var game = await App.shop.games(id)
      if (!game[0])
        App.goBack()

      //console.log(game[4])
      $(".gameInfo #name").html(game[3]);
      $(".gameInfo #desc").html(game[4]);
      $(".gameInfo #year").html(game[6].toNumber());
      $(".gameInfo #price").html(game[5].toNumber());
      $(".gameInfo #seller").html(game[2]);
      $(".gameInfo #soldCount").html(game[7].toNumber())
      if (game[8] == true)
        var state = "For sale";
      else
        var state = "Not for sale";
      $(".gameInfo #state").html(state);

      if (game[2] == App.account)
      {
        $(".gameInfo").append("<p style='color:red'>You are seller of this item</p>")
        $("#buy").remove()   
      }
      else if (await App.shop.UserHasGame(App.account, id))
      {
        $('#buy').remove()
        $('.gameInfo').append("<p style='color:red'>You own this item</p>")
      }
      else if (!game[8])
      {
        $('#buy').remove()
      }
      
      //console.log(await App.shop.UserHasGame(App.account, id))
      $('#buy').on('submit', {id: id, price: game[5].toFixed()}, await  App.buy)
        
      //$newTemplate.find('.buy').on('submit', {id: id, price: price}, App.buy)
      App.setLoading(false)
    },

    goBack: () => {
      window.location.replace('games.html')
      window.reload(true)
    },

    buy: async (e) => {
      App.setLoading(true)
      e.preventDefault()
      await App.shop.BuyGame(e.data.id, {from: App.account, value: e.data.price})
      App.setLoading(false)
      window.location.reload()
    },
  
    setLoading: (boolean) => {
      //App.loading = boolean
      const loader = $('#loader')
      const content = $('#content')
      if (boolean)
      {
        content.hide()
        loader.show()
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
  
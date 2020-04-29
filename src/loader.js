class Loader {
  App = {  
    loading: false,
    contracts: {},
  }

  async load() {
    await this.loadWeb3()
    await this.loadAccount()
    await this.loadContract()
  }

  async loadWeb3() {
    if(typeof web3 !== 'undefined')                                                                                                                                   
    {                                                                                                                                                                                     
      this.App.web3Provider = web3.currentProvider                                                                                                   
      web3 = new Web3(web3.currentProvider)                                                                                                                           
    }                                                                                                                                                                 
    else                                                                                                                                                              
    {                                                                                                                                                                 
      window.alert("Pls connect to metamask...")                                                                                                                      
    }
    if (window.ethereum){
      window.web3 = new Web3(ethereum)
      try
      {
        await ethereum.enable()
      }
      catch (error)
      {
        console.log(error)
      }
    }
    else if (window.web3)
    {
      App.web3Provider = web3.currentProvider
      window.web3 = new Web3(web3.currentProvider)
    }
    else
    {
      console.log('non-ethereum browser detected. you should consider trying metamask!')
    }
  }

  async loadAccount() {
    const accounts = await ethereum.enable()
    this.App.account = web3.eth.accounts[0]
  }

  async loadGame(id) {
    var game = await this.App.shop.games(id)
    this.App.game = game
  }

  async loadContract() {
    //const shop = await $.getJSON('EShop.json')
    const shop = await $.getJSON('EShop.json')
    this.App.contracts.Shop = TruffleContract(shop)
    this.App.contracts.Shop.setProvider(this.App.web3Provider)
    this.App.shop = await this.App.contracts.Shop.deployed()
    this.App.userdata = await this.App.shop.Users(this.App.account.toString())
  }

  async loadGames() { // galima bus perkelt i loader.js
    var gameCount = await this.App.shop.gameCount()
    var gamesLen = await this.App.shop.GetGamesLength()
    this.App.games = []
    this.App.page = 1
    for (var i = 0; i < gamesLen; i++)
    {
        var game = await this.App.shop.games(i)
        if (game[0])
            this.App.games.push(game)
    }
  }

  setLoading (boolean) {
    //console.log('chaning state...')
    this.App.loading = boolean
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
  
  goBack() {
    $('#content').remove()
    window.location.replace('index.html')
  }

  makeDate (unix) {
    var date = new Date(unix * 1000)
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    if (month < 10)
        month = '0' + month
    var day = date.getDate()
    if (day < 10)
        day = '0' + day
    var hours = date.getHours()
    if (hours < 10)
        hours = '0' + hours
    var min = date.getMinutes()
    if (min < 10)
        min = '0' + min
    var sec = date.getSeconds()
    if (sec < 10)
        sec = '0' + sec
    date = year + '-' + month + '-' + day + ' ' + hours + ':' + min + ':' + sec
    return date
  }

};

export default Loader;
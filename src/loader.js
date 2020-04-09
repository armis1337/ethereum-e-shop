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

  async loadContract() {
    const shop = await $.getJSON('EShop.json')
    this.App.contracts.Shop = TruffleContract(shop)
    this.App.contracts.Shop.setProvider(this.App.web3Provider)
    this.App.shop = await this.App.contracts.Shop.deployed()
    this.App.userdata = await this.App.shop.Users(this.App.account.toString())
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

};

export default Loader;
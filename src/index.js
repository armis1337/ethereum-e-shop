import Loader from './loader.js'
export class Main extends Loader {
    async render () {
        main.setLoading(true)
        
        await main.load() // load web3, contract, acc, etc.

        //main render
        $('#acc').html(main.App.account)

        var gamecount = await main.App.shop.gameCount()
        gamecount = gamecount.toNumber()
        $('#gameCount').html(gamecount)
        var myGames = main.App.userdata[2].toNumber()
        if(main.App.userdata[1] == 1 || main.App.userdata[1] == 2)
            $('#myGames').html('My created games: ')
        
        $('#myGames').append(main.App.userdata[2].toNumber())
        if(main.App.userdata[1].toNumber() == 0) // normal user
        {
            $('.admin').remove()
            $('.seller').remove()
            $('#role').append(' - Normal user')
        }
        else if (main.App.userdata[1].toNumber() == 1) // seller
        {
            $('.admin').remove()
            $('#role').append(' - Seller')
            $('#role').css('color', 'green')
        }
        else if (main.App.userdata[1].toNumber() == 2) // admin
        {
            $('.seller').remove()
            $('#role').append(' - Admin')
            $('#role').css('color', 'red')
        }
        else { return false }

        main.setLoading(false)
    }
};

let main = new Main()
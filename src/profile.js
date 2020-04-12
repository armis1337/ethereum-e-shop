import Loader from './loader.js'
class Main extends Loader {
    async render() {
        main.setLoading(true)
        await main.load()

        if(web3.toBigNumber(main.App.account) == 0 || main.App.account == 'undefined')
            main.goBack()

        await main.renderInfo()

        main.setLoading(false)
    }

    async renderInfo() {
        $('#content').append('<div id="userinfo"></div>')
        var div = $('#userinfo')
        div.append('<p>Address: ' + main.App.account + '</p>')
        var name = main.App.userdata[0]
        if(name.length == 0)
            name = 'Not set'
        div.append('<p>Name: ' + name + '</p>')
        var group = main.App.userdata[1].toNumber()
        switch(group){
            case 0:
                group = 'Normal user'
                break
            case 1:
                group = 'Seller'
                break
            case 2:
                group = 'Admin'
                break
            default:
                group = 'Undefined'
        }
        div.append('<p>Group: ' + group + '</p>')
        var games
        if (group == 'Admin' || group == 'Seller'){
            games = 'Created games: '
        }
        else{
            games = 'Owned games: '
        }
        games += main.App.userdata[2].toNumber()
        div.append('<p>' + games + '</p>')
        div.append('<br><button id="viewGames" type="button">View games</button>')
        $('#viewGames').on('click', main.renderGames)
    }

    async renderGames() {
        if ($('#gameList').length != 0)
        {
            $('#gameList').remove()
            return
        }

        $('#userinfo').after('<div id="gameList"></div>')
        var div = $('#gameList')
        // suzinom ar turi kazkiek zaidimu
        console.log(await main.App.userdata[2].toNumber())
        if (main.App.userdata[2].toNumber() > 0)
        {
            div.append('<table id="gamesTable" style="width:100%"></table>')
            var table = $('#gamesTable')

            table.css({'width': '80%','margin-left': '10%', 'margin-right': '10%'})

            table.append('<tr></tr>')
            table.find('tr').append('<td><b>ID</b></td>')
            table.find('tr').append('<td><b>Name</b></td>')
            table.find('tr').append('<td><b>Price</b></td>')
            table.find('tr').append('<td><b>Sold copies</b></td>')
            table.find('tr').append('<td><b>Status</b></td>')
            table.find('tr').append('<td><b>Seller</b></td>')
        }

    }
}

//let main = new Main()

$(() => {
    $(window).load(() => {
        window.main = new Main()
        window.main.render()
    })
})
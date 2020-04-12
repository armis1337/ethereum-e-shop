import Loader from './loader.js'
class Main extends Loader {
    async render() {
        main.setLoading(true)
        await main.load()

        if(web3.toBigNumber(main.App.account) == 0 || main.App.account == 'undefined')
            main.goBack()

        await main.renderInfo()

        await main.renderOptions()

        main.setLoading(false)
    }

    async renderOptions() {
        $('#content').append('<div id="options"></div>')
        var div = $('#options')
        div.css('text-align', 'center')
        div.append('<form id="changename"></form>')
        var form = $('#changename')
        form.append('<label for="newname">New name: </label>')
        form.append('<input id="newname" type="text"></input>')
        form.append('&nbsp;<button type="submit">OK</button>')
        form.submit(main.changeName)
    }
    
    async changeName (e) {
        e.preventDefault()
        var name = $('#newname').val()
        console.log(name)
        main.setLoading(true)
        await main.App.shop.ChangeName(name)
        await main.renderInfo()
        main.setLoading(false)
    }

    async renderInfo() {
        if ($('#userinfo').length != 0)
            $('#userinfo').remove()

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
        var games = main.App.userdata[2].toNumber()
        if (group == 'Admin' || group == 'Seller'){
            games = 'Created games: ' + games
            div.append('<p>' + games + '</p>')
        }
        else{
            games = 'Owned games: ' + games
            div.append('<p>' + games + '</p>')
            div.append('<br><button id="viewGames" type="button">View games</button>')
            $('#viewGames').on('click', main.renderGames)
        }
    }

    async renderGames() {
        if ($('#gameList').length != 0)
        {
            $('#gameList').remove()
            return
        }
        else if (main.App.userdata[1] != 0)
            return

        $('#userinfo').after('<div id="gameList"></div>')
        var div = $('#gameList')
        div.hide()
        // suzinom ar turi kazkiek zaidimu
        //console.log(await main.App.userdata[2].toNumber())
        if (main.App.userdata[2].toNumber() > 0)
        {
            div.append('<table id="gamesTable" style="width:100%"></table>')
            var table = $('#gamesTable')

            table.css({'width': '60%','margin-left': '20%', 'margin-right': '20%'})

            table.append('<tr></tr>')
            table.find('tr').append('<td><b>ID</b></td>')
            table.find('tr').append('<td><b>Name</b></td>')
            if (main.App.userdata[1] == 0) // jei normal
            {
                table.find('tr').append('<td><b>Bought</b></td>')

                var gamedata = await main.App.shop.GetUsersGames(main.App.account)
                //gamedata[0] - zaidimu idai
                //gamedata[1] - datos
                for (var i = 0; i<gamedata[0].length; i++)
                {
                    var game = await main.App.shop.games(web3.toBigNumber(gamedata[0][i]).toNumber())
                    var name = game[3]
                    var bought = web3.toBigNumber(gamedata[1][i]).toNumber()
                    bought = new Date(bought * 1000)
                    var year = bought.getYear() + 1900
                    var month = bought.getMonth() + 1
                    if (month < 10)
                        month = '0' + month
                    var day = bought.getDate()
                    if (day < 10)
                        day = '0' + day
                    var h = bought.getHours()
                    if (h < 10)
                        h = '0' + h
                    var min = bought.getMinutes()
                    if (min < 10)
                        min = '0' + min
                    var sec = bought.getSeconds()
                    if (sec < 10)
                        sec = '0' + sec
                    // add values to table
                    table.append('<tr></tr>')
                    var row = table.find('tr').last()
                    row.append('<td>' + i + '</td>')
                    row.append('<td>' + name + '</td>')
                    row.append('<td>' + year +'-'+ month + '-' + day + ' ' + h + ':' + min + ':' + sec + '</td>')
                }
                $('#gamesTable, th, td').css({'border': '1px solid black', 'border-collapse':'collapse'})
            }
            else
            {  
                table.find('tr').append('<td><b>Sold copies</b></td>')
                table.find('tr').append('<td><b>Created</b></td>')
                var gamedata = await main.App.shop.GetSellersGames(main.App.account)
                for (var i = 0; i<gamedata[0].length; i++)
                {

                }
            }
        }
        else
        {
            div.append('yuo own no games lmaoo=D')
        }
        div.show()
    }
}

//let main = new Main()

$(() => {
    $(window).load(() => {
        window.main = new Main()
        window.main.render()
    })
})
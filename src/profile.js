import Loader from './loader.js'
class Main extends Loader {
    async render() {
        main.setLoading(true)
        await main.load()

        if(web3.toBigNumber(main.App.account) == 0 || main.App.account == 'undefined')
            main.goBack()

        //await main.renderInfo()

        await main.renderOptions()

        main.setLoading(false)
    }

    async renderOptions() {
        if ($('#options').length != 0)
            return
        
        $('#content').append('<div id="options"></div>')
        var div = $('#options')
        div.css('text-align', 'center')
        div.append('<button type="button" id="1" class="option">View my info</button>')
        $('#1').on('click', main.renderInfo)
        if (main.App.userdata[1] == 0) // tik normal useris sitam puslapy gali paziuret savo geimus,
        {                              // jei adminas/selleris, turi eit i savo valdymo puslapi
            div.append('<button type="button" id="2" class="option">View my games</button>')
            $('#2').on('click', main.renderGames)
        }
        div.append('<button type="button" id="3" class="option">Change my name</button>')
        $('#3').on('click', main.renderChangeNameForm)

        $('.option').css({'width':'140px','heigth':'50px','margin':'5px'})
    }
    
    renderChangeNameForm() {
        if($('#changeName').length != 0)
        {
            $('#changeName').remove()
            return
        }
        main.clearContent()
        $('#options').after('<div id="changeName"></div>')
        var div = $('#changeName')
        div.hide()
        div.css({'padding':'10px', 'text-align':'center', 'width':'50%', 'margin-top':'10px', 'margin-left':'25%', 'margin-right':'25%', 'border-style': 'solid', 'border-width':'thin', 'border-color':'darkgray'})
        div.append('<form id="changeNameForm"></form>')
        var form = $('#changeNameForm')
        var name = main.App.userdata[0]
        if (name.length == 0)
            name = "-"
        form.append('<p>Your current name: ' + name + '</p>')
        form.append('<label for="newName">New name: </label>')
        form.append('<input type="text" id="newName" required></input>')
        form.append('<br><button type="submit" style="margin: 5px">Confirm</button>')
        form.submit(main.changeName)
        div.show()
    }

    async changeName (e) {
        e.preventDefault()
        var name = $('#newName').val()
        main.setLoading(true)
        window.alert('confirm the transaction to change your name')
        await main.App.shop.ChangeName(name)
        main.clearContent()
        window.location.reload()
        //main.setLoading(false)
    }

    async renderInfo() {
        if ($('#userinfo').length != 0)
        {
            $('#userinfo').remove()
            return
        }

        main.clearContent()

        //$('#content').append('<div id="userinfo"></div>')
        $('#options').after('<div id="userinfo"></div>')
        var div = $('#userinfo')
        div.hide()
        div.css({'padding':'10px', 'text-align':'center', 'width':'50%', 'margin-top':'10px', 'margin-left':'25%', 'margin-right':'25%', 'border-style': 'solid', 'border-width':'thin', 'border-color':'darkgray'})
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
        }
        div.show()
    }

    async clearContent() {
        var content = $('#content')
        content.find('div:not(#options)').remove()
    }

    async renderGames() {
        if ($('#gameList').length != 0)
        {
            $('#gameList').remove()
            return
        }
        else if (main.App.userdata[1] != 0)
            return

        main.clearContent()

        $('#options').after('<div id="gameList"></div>')
        var div = $('#gameList')
        div.hide()
        div.css({'padding':'10px', 'text-align':'center', 'width':'50%', 'margin-top':'10px', 'margin-left':'25%', 'margin-right':'25%', 'border-style': 'solid', 'border-width':'thin', 'border-color':'darkgray'})
        // suzinom ar turi kazkiek zaidimu
        if (main.App.userdata[2].toNumber() > 0)
        {
            div.append('<table id="gamesTable" style="width:100%"></table>')
            var table = $('#gamesTable')

            table.css({'width': '60%','margin-left': '20%', 'margin-right': '20%'})

            table.append('<tr></tr>')
            table.find('tr').append('<td><b>ID</b></td>')
            table.find('tr').append('<td><b>Name</b></td>')
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
                var year = bought.getFullYear()
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
                row.append('<td>' + game[1] + '</td>')
                row.append('<td>' + '<a href="game.html?id=' + game[1] + '">' + name + '</a></td>')
                row.append('<td>' + year +'-'+ month + '-' + day + ' ' + h + ':' + min + ':' + sec + '</td>')
            }
            $('#gamesTable, th, td').css({'border': '1px solid black', 'border-collapse':'collapse'})
        }
        else
        {
            div.append('yuo own no games lmaoo=D')
        }
        div.show()
    }
}

let main = new Main()

$(() => {
    $(window).load(() => {
        main.render()
    })
})
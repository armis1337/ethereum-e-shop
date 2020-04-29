import Loader from './loader.js'
export class Main extends Loader {
    async render() {
        main.setLoading(true)
        await main.load()

        if(web3.toBigNumber(main.App.account) == 0 || main.App.account == 'undefined')
            main.goBack()

        main.renderOptions()
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
        div.append('<button type="button" id="2" class="option">Change my info</button>')
        $('#2').on('click', main.renderUpdateForm)
        if (main.App.userdata[1] == 0) // tik normal useris sitam puslapy gali paziuret savo geimus,
        {                              // jei adminas/selleris, turi eit i savo valdymo puslapi
            div.append('<button type="button" id="3" class="option">View my games</button>')
            $('#3').on('click', main.renderGames)
        }


        $('.option').css({'width':'140px','heigth':'50px','margin':'5px'})

        var style = $('<style>.info { padding:2%; text-align:center; width:50%; margin-top:2%; margin-left:25%; margin-right:25%; border-style:solid; border-width:thin; border-color:darkgray;}</style>')
        style.appendTo('head')

    }

    renderUpdateForm () {
        if($('#changeInfo').length != 0)
        {
            $('#changeInfo').remove()
            return
        }
        main.clearContent()
        $('#options').after('<div id="changeInfo" class="info"></div>')
        var div = $('#changeInfo')
        div.hide()
        div.append('<h3>Change info</h3>')
        div.append('<form id="changeInfoForm"></form>')
        var form = $('#changeInfoForm')
        var name = main.App.userdata[0]
        var desc = main.App.userdata[6]
        var year = main.App.userdata[7]
        var email = main.App.userdata[8]
        if(year == 0)
            year = ''
        form.append('<label for="newName">Name:</label>')
        form.append('<br>')
        form.append('<input type="text" id="newName" value="' + name + '" placeholder="Username" maxlength="20"></input>')
        form.append('<hr>')
        form.append('<label for="newYear">Year:</label>')
        form.append('<br>')
        form.append('<input type="number" id="newYear" min="0" max="9999" value="' + year + '" placeholder="Year"></input>')
        form.append('<hr>')
        form.append('<label for="email">E-Mail:</label>')
        form.append('<br>')
        form.append('<input id="newEmail" type="email" placeholder="post@example.com" value="' + email +'"></input>')
        form.append('<hr>')
        form.append('<label for="newDesc">Description:</label>')
        form.append('<br>')
        form.append('<textarea id="newDesc" rows="10" maxlength="500" style="width:75%" placeholder="Description">' + desc + '</textarea>')
        form.append('<br>')
        form.append('<button type="submit" style="margin:1%">Submit</button>')

        $('#newDesc').css({'padding':'1%', 'resize':'none', 'width':'75%'})
        $('#changeInfoForm *').css({'margin-top':'1%','margin-bottom':'1%'})
        $('#newName,#newYear,#newEmail').css('width', '50%')
        $('hr').css('width', '80%')

        form.submit(main.changeInfo)
        div.show()
    }

    async changeInfo (e) {
        e.preventDefault()
        var name = $('#newName').val()
        var desc = $('#newDesc').val()
        var year = $('#newYear').val()
        var email = $('#newEmail').val()
        main.setLoading(true)
        window.alert('confirm the transaction to change your Info')
        await main.App.shop.ChangeInfo(name, desc, year, email)
        main.clearContent()
        window.location.reload()
        //main.setLoading(false)
    }

    renderInfo() {
        if ($('#userinfo').length != 0)
        {
            $('#userinfo').remove()
            return
        }

        main.clearContent()

        //$('#content').append('<div id="userinfo"></div>')
        $('#options').after('<div id="userinfo" class="info"></div>')
        var div = $('#userinfo')
        div.hide()
        div.append('<h3>View info</h3>')
        div.append('<p>Address: ' + main.App.account + '</p>')
        var name = main.App.userdata[0]
        var desc = main.App.userdata[6]
        var year = main.App.userdata[7]
        var email = main.App.userdata[8]

        if(name.length == 0)
            name = '-'
        if(desc.length == 0)
            desc = 'No description'
        if(year == 0)
            year = '-'
        if(email.length == 0)
            email = '-'
        
        div.append('<p>Name: ' + name + '</p>')
        div.append('<p>Year: ' + year + '</p>')
        div.append('<p>E-Mail: ' + email + '</p>')
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
        div.append('<textarea id="description" rows="10" readonly>' + desc + '</textarea>')
        if (desc == 'No description')
            $('#description').css({'font-style':'italic', 'color':'grey'})

        $('#description').css({'padding':'1%', 'resize':'none', 'width':'75%'})
        

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

        $('#options').after('<div id="gameList" class="info"></div>')
        var div = $('#gameList')
        div.hide()
        //div.css({'padding':'10px', 'text-align':'center', 'width':'50%', 'margin-top':'10px', 'margin-left':'25%', 'margin-right':'25%', 'border-style': 'solid', 'border-width':'thin', 'border-color':'darkgray'})
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
            console.log(gamedata[1])
            for (var i = 0; i<gamedata[0].length; i++)
            {
                var game = await main.App.shop.games(web3.toBigNumber(gamedata[0][i]).toNumber())
                var name = game[3]
                var bought = web3.toBigNumber(gamedata[1][i]).toNumber()
                console.log(bought)
                bought = main.makeDate(bought)
                /*bought = new Date(bought * 1000)
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
                    sec = '0' + sec*/
                // add values to table
                table.append('<tr></tr>')
                var row = table.find('tr').last()
                row.append('<td>' + game[1] + '</td>')
                if (game[0])
                    row.append('<td>' + '<a href="game.html?id=' + game[1] + '">' + name + '</a></td>')
                else
                    row.append('<td>' + name + '</td>')
                row.append('<td>' + bought + '</td>')
            }
            $('#gamesTable, th, td').css({'border': '1px solid black', 'border-collapse':'collapse'})
        }
        else
        {
            div.append('You dont own any games')
        }
        div.show()
    }
}

let main = new Main()
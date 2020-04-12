import {Main} from './seller.js'

class Admin extends Main {
    async render (){
        main.setLoading(true)
        await main.load()

        if (main.App.userdata[1].toNumber() != 2)
        {
            main.goBack()
            return false
        }
        
        await main.renderOptions()
        main.setLoading(false)
    }

    async renderOptions() {
        super.renderOptions()
        var options = $('#options')
        options.find('#2').html('All games')
        options.find('#2').unbind()
        options.find('#2').on('click', main.renderAllGames)
        options.find('#3').unbind()
        options.find('#3').on('click', main.renderUpdateGame)
        options.append('<br>')
        options.append('<button type="button" id="4">Manage admin group</button>')
        options.append('<button type="button" id="5">Manage sellers group</button>')
        options.append('<button type="button" id="6">Remove user\'s rights</button>')
        options.find('#4').on('click', main.renderAdmins)
        options.find('#5').on('click', main.renderSellers)
        options.find('#6').on('click', main.renderRemoveGroups)
        $('#4, #5, #6').css({'width':'140px','heigth':'50px','margin':'5px'})
    }

    async renderRemoveGroups () {
        if($('#remove').length != 0)
        {
            main.clearContent()
            return
        }
        main.clearContent()

        $('#options').after('<div id="removeGroups"></div>')
        var div = $('#removeGroups')
        div.hide()

        div.css({'padding':'10px', 'text-align':'center', 'width':'50%', 'margin-top':'10px', 'margin-left':'25%', 'margin-right':'25%', 'border-style': 'solid', 'border-width':'thin', 'border-color':'darkgray'})
        
        div.append('<form id="normal">')
        var form = $('#normal')
        form.append('<p>Remove users groups</p>')
        form.append('<label for="userAddress">Users address: </label>')
        form.append('<input id="userAddress" type="text" placeholder="0x000..." required>')
        form.append('<input type="submit" value="Remove"></input>')
        form.submit(main.makeNormal)
        
        div.show()
    }

    async renderSellers () {
        if($('#sellers').length != 0)
        {
            main.clearContent()
            return
        }
        main.clearContent()

        $('#options').after('<div id="sellers"></div>')
        var div = $('#sellers')
        div.hide()

        div.css({'text-align':'center', 'width':'50%', 'margin-top':'10px', 'margin-left':'25%', 'margin-right':'25%', 'border-style': 'solid', 'border-width':'thin', 'border-color':'darkgray'})
        
        // add seller
        div.append('<form id="addSeller"></form>')
        var form = $('#addSeller')
        form.append('<p>Add user to "Seller" group</p>')
        form.append('<label for="sellerAddress">Users address: </label>')
        form.append('<input id="sellerAddress" type="text" placeholder="0x000..." required>')
        form.append('&nbsp;<input type="submit" value="Add"></input>')
        form.submit(main.makeSeller)

        // list sellers
        div.append('<h4>List of all shop\'s sellers</h4>')
        var slen = await main.App.shop.GetSellersLength()
        if (slen > 0)
        {
            div.append('<ol id="sellerList"></ol>')
            var ol = $('#sellerList')
            ol.css({'list-style-position':'inside'})
            for (var i = 0; i<slen; i++)
            {   
                var adr = await main.App.shop.Sellers(i)
                if(web3.toBigNumber(adr) != 0 )
                    ol.append('<li>' + adr + '</li>')
            }
        }
        else{
            div.append('<p>There are no sellers at the moment</p>')
        }
        div.show()
    }

    async renderAdmins () {
        if($('#admins').length != 0)
        {
            main.clearContent()
            return
        }
        main.clearContent()

        $('#options').after('<div id="admins"></div>')
        var div = $('#admins')
        div.hide()

        div.css({'text-align':'center', 'width':'50%', 'margin-top':'10px', 'margin-left':'25%', 'margin-right':'25%', 'border-style': 'solid', 'border-width':'thin', 'border-color':'darkgray'})
        
        // add admin
        div.append('<form id="addAdmin"></form>')
        var form = $('#addAdmin')
        form.append('<p>Add user to "Administrator" group</p>')
        form.append('<label for="adminAddress">Users address: </label>')
        form.append('<input id="adminAddress" type="text" placeholder="0x000..." required>')
        form.append('&nbsp;<input type="submit" value="Add"></input>')
        form.submit(main.makeAdmin)

        // admin list
        div.append('<h4>List of all shop\'s administrators</h4>')
        var alen = await main.App.shop.GetAdminsLength()
        if (alen > 0)
        {
            div.append('<ol id="adminList"></ol>')
            var ol = $('#adminList')
            ol.css({'list-style-position':'inside'})
            for (var i = 0; i<alen; i++)
            {   
                var adr = await main.App.shop.Admins(i)
                if(web3.toBigNumber(adr) != 0 )
                    ol.append('<li>' + adr + '</li>')
            }
        }
        else{
            div.append('<p>There are no administrators of the shop at the moment</p>')
        }
        div.show()
    }

    async makeNormal(e) {
        e.preventDefault()
        var adr = $('#userAddress').val()
        //
        // tlikrinimooo
        //
        main.setLoading(true)
        window.alert('confirm the transaction to move user \n' + adr + '\nto Normal group')
        await main.App.shop.MakeNormal(adr)
        main.clearContent()
        main.setLoading(false)
    }

    async makeAdmin(e) {
        e.preventDefault()
        var adr = $('#adminAddress').val()
        //
        // irgi tikrinimo reik
        //
        main.setLoading(true)
        window.alert('confirm the transaction to make user\n' + adr + '\nAdmin')
        await main.App.shop.MakeAdmin(adr)
        main.clearContent()
        await main.renderAdmins()
        main.setLoading(false)
        //window.location.reload()
    }

    async makeSeller(e) {
        e.preventDefault()
        var adr = $('#sellerAddress').val()
        //
        // tikrinimo reik
        //
        main.setLoading(true)
        window.alert('confirm the transaction to make user\n' + adr + '\nSeller')
        await main.App.shop.MakeSeller(adr)
        main.clearContent()
        await main.renderSellers()
        main.setLoading(false)
        //window.location.reload()
    }

    async renderAllGames() {
        if ($('#myGames').length != 0)
        {
            main.clearContent()
            return
        }
        main.clearContent()

        $('#options').after('<div id="myGames"></div>')
        
        var div = $('#myGames')
        div.hide()
        div.css('text-align', 'center')
        div.append('<center><h4>List of all shop\'s games</h4></center>')

        //var createdGames = await main.App.shop.GetSellersGames(main.App.account)
        var gameCount = await main.App.shop.gameCount()
        if (gameCount > 0)
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
            table.find('tr').append('<td><b>Created</b></td>')
            table.find('tr').append('<td><b>Seller</b></td>')
            //var gamesLength = await main.App.shop.GetGamesLength().then(function(result){return result.toNumber()})
            var gamesLength = await main.App.shop.GetGamesLength()
            for (var i = 0; i<gamesLength; i++)
            {
                var game = await main.App.shop.games(i)

                if(!game[0]) // jei zaidimas istrintas, neirasinejam niekur
                    continue

                // get values
                //var id = web3.toBigNumber(createdGames[i]).toNumber()
                var name = game[3]
                var price = game[5]
                if (game[8])
                    var status = "For sale"
                else
                    var status = "Not for sale"
                var sold = game[7].toNumber()
                var seller = game[2]
                
                var date = new Date(game[9].toNumber() * 1000)
                var year = date.getFullYear()
                var month = date.getMonth() + 1
                if(month < 10)
                    month = '0' + month
                var day = date.getDate()
                if(day < 10)
                    day = '0' + day
                var hour = date.getHours()
                if(hour < 10)
                    hour = '0' + hour
                var min = date.getMinutes()
                if(min < 10)
                    min = '0' + min
                var sec = date.getSeconds()
                if(sec < 10)
                    sec = '0' + sec
                var date = year+'-'+month+'-'+day+' '+hour+':'+min+':'+sec

                // add values to table
                table.append('<tr></tr>')
                var row = table.find('tr').last()
                row.append('<td>' + i + '</td>')
                row.append('<td>' + name + '</td>')
                row.append('<td>' + price + '</td>')
                row.append('<td>' + sold + '</td>')
                row.append('<td>' + status + '</td>')
                row.append('<td>' + date + '</td>')
                row.append('<td>' + seller + '</td>')
            }
            $('#gamesTable, th, td').css({'border': '1px solid black', 'border-collapse':'collapse'})

        }
        else{
            div.append('<p>There are no games in the shop yet</p>')
        }
        div.show()
    }

    async renderUpdateGame() {
        if ($('#edit').length !=0)
        {
            $('#edit').remove()
            return
        }
  
        main.clearContent()
  
        $('#options').after('<div id="edit"></div>')
        var div = $('#edit')
        div.hide()
        div.css({'padding':'10px','text-align':'center', 'width':'50%', 'margin-top':'10px', 'margin-left':'25%', 'margin-right':'25%', 'border-style': 'solid', 'border-width':'thin', 'border-color':'darkgray'})

        var gameCount = await main.App.shop.gameCount()
        if (gameCount > 0)
        {
            div.append('<form id="games"></form>')
            var form = $('#games')
            form.append('<label for="gameList">Choose a game to edit: </label>')
            form.append('<select id="gameList"></select>')
            var select = $('#gameList')
            //var gamesLen = await main.App.shop.GetGamesLength().then(function(result){return result.toNumber()})
            var gamesLen = await main.App.shop.GetGamesLength()
            for (var i = 0; i<gamesLen; i++)
            {
                var game = await main.App.shop.games(i) 
                if(!game[0]) // jei zaidimas istrintas, neirasinejam niekur
                    continue 
                select.append('<option value="' + i/*id*/ + '">' + game[3]/*name*/ + '</option>')
            }
            form.append('&nbsp;&nbsp;<button type="submit">OK</button>')
            form.submit(main.renderGameInfo)
        }
        else{
            div.append('<p>You havent added any games yet</p>')
        }
        div.show()
      }
}

let main = new Admin()

$(() => {
    $(window).load(() => {
        main.render()
    })
})
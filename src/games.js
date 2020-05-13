import Loader from './loader.js'
export class Main extends Loader {
    async render() {
        main.setLoading(true)
        await main.load()
        await main.loadGames()
        await main.renderGames()
        main.renderPages()
        main.setLoading(false)
    }

    async renderGames (page = 1) {
        if ($('#gameList').length != 0) {
            $('#gameList').empty()
        }

        $('#content').append('<div id="gameList"></div>')
        var div = $('#gameList')

        main.App.page = page

        var gameCount = main.App.games.length
        gameCount -= (page - 1) * 6

        if (gameCount > 0) {
            if (gameCount <= 6)
                var k = gameCount + 6 * (page - 1)
            else
                var k = 6 * page

            for (var i = (page - 1) * 6; i < k; i++) {
                if ($('.column').length%2 == 0)
                    $('#gameList').append('<div class="row"></div>')

                $('.row').last().append('<div class="column"></div>')

                var game = await main.App.games[i]
                var name = game[3]
                var desc = game[4]
                var seller = game[2]
                var sname = await main.App.shop.Users(seller).then(function(x){return x[0]})
                if(sname.length != 0)
                    seller = sname + ' (' + seller + ')'
                //console.log(pz + pz.length)
                var price = main.makeEth(game[5]) + ' eth'
                var soldCopies = game[7]
                var releaseYear = game[6]
                var url = window.location.origin + '/game.html?id=' + game[1]
                if (game[8])
                    var state = 'For sale'
                else
                    var state = 'Not for sale' 
                
                var col = $('.column').last()
                col.append('<p>Name: ' + name + '</p>')
                col.append('<p>Seller: ' + seller + '</p>')
                col.append('<p>Price: ' + price + '</p>')
                col.append('<p>Release year: ' + releaseYear + '</p>')
                col.append('<p>Description: ' + desc + '</p>')
                col.append('<p>Total sold copies: ' + soldCopies + '</p>')
                col.append('<p>' + state + '</p>')
                col.append('<a href="' + url + '">Game page</a>')
            }
        }
        else {
            div.append('<p>There are no games at the moment</p>')
        }
    }

    async renderPages() {
        if (main.App.games.length < 6)
            return
        if ($('#pages').length != 0)
            $('#pages').remove()

        var maxpages = main.App.games.length / 6 + 1
        maxpages = Math.floor(maxpages)
        
        $('#content').append('<div id="pages"></div>')
        var div = $('#pages')
        div.css('text-align', 'center')
        
        var i
        if (main.App.page == maxpages && maxpages > 2)
            i = maxpages - 2
        else if (main.App.page > 1)
            i = main.App.page - 1
        else
            i = 1
        for (var j = i; j <= i + 2; j++) {
            if (j > maxpages)
                break
            if (j == main.App.page)
                div.append('<button type="button" disabled="true">' + j + '</button>')   
            else
                div.append('<button type="button" id="' + j +'">' + j + '</button>')

            $('#pages #' + j).on('click', {i: j}, async function (e) {
                main.setLoading(true)
                await main.renderGames(e.data.i);
                main.renderPages()
                $('body').scrollTop()
                main.setLoading(false)
            })
        }
        $('#pages :button').css({'padding-top':'1%', 'padding-bottom':'1%', 'padding-left':'3%',
                                    'padding-right':'3%', 'margin':'1%', 'text-align':'center'})
    }
};

let main = new Main()
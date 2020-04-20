import Loader from './loader.js'
export class Main extends Loader {
    async render() {
        main.setLoading(true)
        await main.load()

        //main
        var gameCount = await main.App.shop.gameCount()
        var gamesLen = await main.App.shop.GetGamesLength()
        gamesLen = gamesLen.toNumber()
          
        if (gameCount > 0)
        {
            $("#gameList").html()
            $("#gameList").empty()
            for (var i = 0; i < gamesLen; i++)
            {
                var game = await main.App.shop.games(i)
                if (!game[0])
                    continue
                
                if ($('.column').length%2 == 0)
                    $('#gameList').append('<div class="row"></div>')

                $('.row').last().append('<div class="column"></div>')


                var name = "<p>Name: " + game[3] +  "</p>"
                var desc = "<p>Description: " + game[4] + "</p>"
                var seller = "<p>Seller: " + game[2] + "</p>"
                var price = "<p>Price: " + game[5] + "</p>"
                var releaseYear = "<p>Year released: " + game[6] + "</p>"
                var soldCopies = "<p>Total sold copies: " + game[7] + "</p>"
                var url = "<a href=" + window.location.origin + "/game.html?id=" + i + ">Game's page</a>"
                if (game[8] == true)
                var state = "<p>For sale</p>"
                else
                var state = "<p>Not for sale</p>"
                $('.column').last().append(name, seller, price, releaseYear, desc, soldCopies, state,/* ii, id,*/ url)
            }      
        }

        main.setLoading(false)
    }
};

let main = new Main()
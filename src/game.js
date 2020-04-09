import Loader from './loader.js'
class Main extends Loader {
    async render() {
        main.setLoading(true)

        await main.load()

        //main 

        var id = location.search.substring(4)
        var gamesLen = await main.App.shop.GetGamesLength()
        gamesLen = gamesLen.toNumber()
        if (id > gamesLen || id < 0)
            main.goBack()

        var game = await main.App.shop.games(id)
        if (!game[0])
            main.goBack()

        $(".gameInfo #name").html(game[3]);
        $(".gameInfo #desc").html(game[4]);
        $(".gameInfo #year").html(game[6].toNumber());
        $(".gameInfo #price").html(game[5].toNumber());
        $(".gameInfo #seller").html(game[2]);
        $(".gameInfo #soldCount").html(game[7].toNumber())
        if (game[8] == true)
            var state = "For sale";
        else
            var state = "Not for sale";
        $(".gameInfo #state").html(state);

        if (game[2] == main.App.account)
        {
            $(".gameInfo").append("<p style='color:red'>You are seller of this item</p>")
            $("#buy").remove() 
        }
        else if (await main.App.shop.UserHasGame(main.App.account, id))
        {
            $('#buy').remove()
            $('.gameInfo').append("<p style='color:red'>You own this item</p>")
        }
        else if (await main.App.shop.Users(main.App.account).then(function(result){return result[1].toNumber()}))
        {
            $('#buy').remove()
        }
        else if (!game[8])
        {
            $('#buy').remove()
        }

        $('#buy').on('submit', {id: id, price: game[5].toFixed()}, main.buy)

        main.setLoading(false)
    }

    async buy (e) {
        e.preventDefault()
        main.setLoading(true)
        window.alert('confirm the transaction to buy game id:' + e.data.id)
        await main.App.shop.BuyGame(e.data.id, {from: main.App.account, value: e.data.price})
        main.render()
        main.setLoading(false)
        //window.location.reload()
    }
};

let main = new Main()

$(() => {
    $(window).load(() => {
        main.render()
    })
})
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

        $("#gameInfo #name").html(game[3]);
        $("#gameInfo #desc").html(game[4]);
        $("#gameInfo #year").html(game[6].toNumber());
        $("#gameInfo #price").html(game[5].toNumber());
        $("#gameInfo #seller").html(game[2]);
        $("#gameInfo #soldCount").html(game[7].toNumber())
        if (game[8] == true)
            var state = "For sale";
        else
            var state = "Not for sale";
        $("#gameInfo #state").html(state);

        if (game[2] == main.App.account)
        {
            $("#gameInfo").append("<p style='color:red'>You are seller of this item</p>")
            $("#buy").remove() 
        }
        else if (await main.App.shop.UserHasGame(main.App.account, id))
        {
            $('#buy').remove()
            $('#gameInfo').append("<p style='color:red'>You own this item</p>")
            if (! await main.App.shop.HasAskedRefund(main.App.account, id))
                main.renderOptions()
            else
                $('#gameInfo').append('<p>You have refund request pending</p>')
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

    renderOptions () {
        if ($('#options').length !=0)
            return
        $('#gameInfo').after('<div id="options"></div>')
        var div = $('#options')
        div.css('text-align', 'center')
        div.append('<button type="Button" id="refundbtn">Ask for a refund</button>')
        $('#refundbtn').on('click', main.renderRefundForm)
    }

    renderRefundForm () {
        if ($('#refund').length != 0)
        {
            $('#refund').remove()
            return
        }
        $('#options').after('<form id="refund"></form>')
        var form = $('#refund')
        form.css({'padding':'10px','text-align':'center', 'width':'40%', 'margin-top':'10px', 'margin-left':'30%', 'margin-right':'30%', 'border-style': 'solid', 'border-width':'thin', 'border-color':'darkgray'})
        form.append('<label for="reason">Reason for refund</label><br>')
        form.append('<textarea id="reason" rows="4" cols="50" maxlength="100" required></textarea>')
        form.append('<br><button type="submit">Submit request</button>')
        form.submit(main.submitRefundRequest)
    }

    async submitRefundRequest (e) {
        e.preventDefault()

        var id = location.search.substring(4)
        var msg = $('#reason').val()
        main.setLoading(true)
        window.alert('confirm the transaction to submit refund request')
        await main.App.shop.AskRefund(id, msg)
        window.location.reload()
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
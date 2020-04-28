import Loader from './loader.js'
export class Main extends Loader {
    async render() {
        main.setLoading(true)
        await main.load()

        var id = location.search.substring(4)
        var gamesLen = await main.App.shop.GetGamesLength()       
        gamesLen = gamesLen.toNumber()
        if (id > gamesLen || id < 0 || isNaN(id))
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
        else if (await main.App.shop.UserHasGame(main.App.account, id)) // cia cj beda
        {
            $('#buy').remove()
            $('#gameInfo').append("<p style='color:red'>You own this item</p>")
            /*if (! await main.App.shop.HasAskedRefund(main.App.account, id))
                main.renderOptions()
            else
                $('#gameInfo').append('<p>You have refund request pending</p>')*/
        }
        else if (await main.App.shop.Users(main.App.account).then(function(result){return result[1].toNumber()}))
        {
            //console.log('!!!')
            $('#buy').remove()
        }
        else if (!game[8])
        {
            $('#buy').remove()
        }

        $('#buy').on('submit', {id: id, price: game[5].toFixed()}, main.buy)
        
        main.renderOptions()
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

        div.append('<button type="button" id="reviewBtn">Leave review</button>')
        $('#reviewBtn').on('click', main.renderReviewForm)

        div.append('<button type="button" id="viewReviews">View all reviews</button>')
        $('#viewReviews').on('click', main.renderReviews)
    }

    renderRefundForm () {
        if ($('#refund').length != 0)
        {
            main.clearContent()
            return
        }
        else main.clearContent()
        $('#options').after('<div id="refundForm"></div>')
        var div = $('#refundForm')
        div.append('<form id="refund"></form>')
        var form = $('#refund')
        div.css({'padding':'10px','text-align':'center', 'width':'40%', 'margin-top':'10px', 'margin-left':'30%', 'margin-right':'30%', 'border-style': 'solid', 'border-width':'thin', 'border-color':'darkgray'})
        form.append('<label for="reason">Reason for refund</label><br>')
        form.append('<textarea id="reason" rows="4" cols="50" maxlength="100" required></textarea>')
        form.append('<br><button type="submit">Submit request</button>')
        form.submit(main.submitRefundRequest)
    }

    renderReviewForm () {
        if ($('#reviewForm').length != 0)
        {
            main.clearContent()
            return
        }
        else main.clearContent()

        $('#options').after('<div id="reviewForm"></div>')
        var div = $('#reviewForm')
        div.css({'padding':'10px','text-align':'center', 'width':'40%', 'margin-top':'10px', 'margin-left':'30%', 'margin-right':'30%', 'border-style': 'solid', 'border-width':'thin', 'border-color':'darkgray'})
        div.append('<form id="review"></form>')
        var form = $('#review')
        form.append('<p>Rating</p>')
        form.append('<input type="radio" id="1" value="1" name="rating">')
        form.append('<label for="1">1</label>')
        form.append('<input type="radio" id="2" value="2" name="rating">')
        form.append('<label for="2">2</label>')
        form.append('<input type="radio" id="3" value="3" name="rating">')
        form.append('<label for="3">3</label>')
        form.append('<input type="radio" id="4" value="4" name="rating">')
        form.append('<label for="4">4</label>')
        form.append('<input type="radio" id="5" value="5" name="rating">')
        form.append('<label for="5">5</label>')
        form.append('<input type="radio" id="6" value="6" name="rating">')
        form.append('<label for="6">6</label>')
        form.append('<input type="radio" id="7" value="7" name="rating">')
        form.append('<label for="7">7</label>')
        form.append('<input type="radio" id="8" value="8" name="rating">')
        form.append('<label for="8">8</label>')
        form.append('<input type="radio" id="9" value="9" name="rating">')
        form.append('<label for="9">9</label>')
        form.append('<input type="radio" id="10" value="10" name="rating">')
        form.append('<label for="10">10</label>')
        form.append('<hr style="width:80%">')
        form.append('<label for="msg">Review</label><br>')
        form.append('<textarea id="msg" rows="4" cols="50" maxlength="100" required></textarea>')
        form.append('<br><button type="submit">Submit</button>')
        form.submit(main.submitReview)
    }

    async renderReviews () {
        if ($('#reviews').length != 0)
        {
            main.clearContent()
            return
        }
        else main.clearContent()

        $('#options').after('<div id="reviews"></div>')
        var div = $('#reviews')
        div.hide()
        div.css({'padding':'10px','text-align':'center', 'width':'40%', 'margin-top':'10px', 'margin-left':'30%', 'margin-right':'30%', 'border-style': 'solid', 'border-width':'thin', 'border-color':'darkgray'})
        var id = location.search.substring(4)
        var reviewIds = await main.App.shop.GetReviews(id)
        if (reviewIds.length != 0) {
            div.append('<h3>Reviews for game id: ' + id + '</h3>')
            for (var i = 0; i < reviewIds.length; i++) {
                if (i > 0)
                    div.append('<hr style="width:80%">')
                var reviewID = web3.toBigNumber(reviewIds[i]).toNumber()
                var review = await main.App.shop.reviews(reviewID)
                div.append('<p style="text-align:left;margin-left:10%">By: ' + review[1] + '</p>')
                div.append('<p style="text-align:left;margin-left:10%">' + main.makeDate(review[4]) + '</p>')
                div.append('<p style="text-align:left;margin-left:10%">' + review[2].toNumber() + '/10')
                div.append('<textarea readonly style="resize:none; width:80%">' + review[3] + '</textarea>')              
            }
        }
        else {
            div.append('<p>This game has no reviews at the time</p>')
        }
        div.show()
        
    }

    clearContent() {//except options ir game info
        var content = $('#content')
        content.find('div:not(#options, #gameInfo)').remove()
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

    async submitReview (e) {
        e.preventDefault()

        var id = location.search.substring(4)
        var msg = $('#msg').val()
        var rating = $('input[name="rating"]:checked').val()
        main.setLoading(true)
        window.alert('confirm the transaction to submit review')
        await main.App.shop.AddReview(id, msg, rating)
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
}

let main = new Main()
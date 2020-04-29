import Loader from './loader.js'
export class Main extends Loader {
    async render() {
        main.setLoading(true)
        await main.load()

        $('#content').css({'heigth': $(window).height()})

        var id = location.search.substring(4)
        var gamesLen = await main.App.shop.GetGamesLength()       
        gamesLen = gamesLen.toNumber()
        if (id > gamesLen || id < 0 || isNaN(id))
            main.goBack()

        await main.loadGame(id)
        document.title = main.App.game[3]

        if (!main.App.game[0])
            main.goBack()

        await main.renderGameInfo()        
        await main.renderOptions()
        main.setLoading(false)
    }

    async renderGameInfo () {
        if ($('#gameInfo').length != 0)
            return
        
        $('#content').append('<div id="gameInfo"></div>')
        var div = $('#gameInfo')
        div.hide()
        div.css({'text-align':'center', 'width':'50%', 'margin-bottom':'1%' , 
                'margin-top':'1%', 'margin-left':'25%', 'margin-right':'25%', 
                'border-style': 'solid', 'border-width':'thin', 'border-color':'darkgray',
                'padding-top': '1%', 'padding-bottom': '1%', /*'heigth': heigth*/})

        div.append('<h1>' + main.App.game[3] + '</h1>')
        div.append('<hr>')
        div.append('<textarea readonly id="gdesc">' + main.App.game[4] + '</textarea>')
        div.append('<p>Year: ' + main.App.game[6]  + '</p>')
        div.append('<p>Added to shop: ' + main.makeDate(main.App.game[9]) + '</p>')
        div.append('<p>Sold copies: ' + main.App.game[7] + '</p>')
        //style="text-align:left;margin-left:20%"
        div.append('<p>Price: ' + main.App.game[5] + '</p>')
        if (main.App.game[8])
            div.append('<p style="color:green">For sale<p>')
        else
            div.append('<p style="color:red">Not for sale</p>')
        div.append('<p>Seller: ' + main.App.game[2] + '</p>')
        
        div.append('<button type="button" id="showseller">Show sellers info</button>')
        main.App.seller = await main.App.shop.Users(main.App.game[2])
        $('#showseller').on('click', function () {
            if($('#sellerInfo').length != 0)
            {
                $('#sellerInfo').remove()
                return
            }
            div.append('<div id="sellerInfo"></div>')
            var div2 = $('#sellerInfo')
            div2.append('<hr style="width:80%">')
            if (main.App.seller[0].length != 0)
                div2.append('<h3>' + main.App.seller[0] + '</h3>')
            if (main.App.seller[7] != 0)
                div2.append('<p>Year: ' + main.App.seller[7]  + '</p>')
            if (main.App.seller[8].length != 0)
                div2.append('<p>Email: ' + main.App.seller[8] + '<p>')
            
            div2.append('<textarea readonly id="sdesc">' + main.App.seller[6] + '</textarea>')

            $('#sdesc').css({'resize': 'none', 'width': '80%', 'text-align': 'center'})
            $('#sdesc').prop('rows', 10)
            console.log('sellers desc: ' + main.App.seller[6])
        })


        div.find('hr').css({'width': '80%'})
        $('#gdesc').css({'resize': 'none', 'width': '80%', 'text-align': 'center'})
        $('#gdesc').prop('rows', 6)
        div.find('p').css({'text-align': 'left', 'margin-left':'20%'})

        div.show()
    }

    async renderOptions () {
        if ($('#options').length !=0)
            return
        $('#gameInfo').after('<div id="options"></div>')
        var div = $('#options')
        var heigth = $(window).height() * 0.1 + 'px'
        div.css({'text-align': 'center', 'heigth': heigth})

        div.append('<button type="button" class="option" id="viewReviews">View all reviews</button>')
        $('#viewReviews').on('click', main.renderReviews)
        if (main.App.userdata[1] == 0)
        {
            if (! await main.App.shop.UserHasGame(main.App.account, main.App.game[1]))
            {
                div.append('<button type="button" class="option" id="buyBtn">Buy</button>')
                $('#buyBtn').on('click', {price:main.App.game[5]}, main.buy)
            }
            else 
            {
                div.append('<button type="Button" class="option" id="refundbtn" disabled="true">Ask for a refund</button>')
                div.append('<button type="button" class="option" id="reviewBtn" disabled="true">Leave review</button>')
                if (! await main.App.shop.GetRefundState(main.App.game[1])){
                    
                    $('#refundbtn').on('click', main.renderRefundForm)
                    $('#refundbtn').prop('disabled', false)
                }
                if (! await main.App.shop.GetReviewState(main.App.game[1])){
                    $('#reviewBtn').on('click', main.renderReviewForm)
                    $('#reviewBtn').prop('disabled', false)
                }
                div.append('<button type="button" class="option" id="bugbtn">Report bug</button>')
                $('#bugbtn').on('click', main.renderBugForm)
            }
        }
        else if (main.App.userdata[1] == 1 || main.App.userdata[1] == 2)
        {
            div.append('<button type="button" class="option" id="viewbugs">View bugs</button>')
            $('#viewbugs').on('click', main.renderBugs)
        }

        $('.option').css({'width':'11%', 'heigth':'85%', 'margin':'0.5%'})
        //$('#reviewBtn').css('heigth', '80%')
    }

    renderBugForm () {
        if ($('#bug').length != 0){
            main.clearContent()
            return
        }
        else main.clearContent()
        $('#options').after('<div id="bug"></div>')
        var div = $('#bug')
        div.css({'padding':'10px','text-align':'center', 'width':'40%', 'margin-top':'10px', 'margin-left':'30%', 'margin-right':'30%', 'border-style': 'solid', 'border-width':'thin', 'border-color':'darkgray'})
        div.append('<form id="bugForm"></form>')
        var form = $('#bugForm')
        form.append('<label for="msg">Report a bug</label><br>')
        form.append('<textarea id="msg" rows="4" cols="50" maxlength="100" required></textarea>')
        form.append('<br><button type="submit">Submit</button>')
        form.submit(main.submitBug)
        
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
        div.css({'padding':'10px','text-align':'center', 'width':'40%', 'margin-bottom':'2%', 'margin-top':'10px', 'margin-left':'30%', 'margin-right':'30%', 'border-style': 'solid', 'border-width':'thin', 'border-color':'darkgray'})
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

    async renderBugs () {
        if ($('#bugList').length != 0)
        {
            main.clearContent()
            return
        }
        else main.clearContent()

        $('#options').after('<div id="bugList"></div>')
        var div = $('#bugList')
        div.hide()
        div.css({'padding':'10px','text-align':'center', 'width':'40%', 'margin-bottom':'2%', 'margin-top':'10px', 'margin-left':'30%', 'margin-right':'30%', 'border-style': 'solid', 'border-width':'thin', 'border-color':'darkgray'})
        if (main.App.game[11] > 0)
        {
            div.append('<h2>Reported bugs</h2>')
            var bugIds = await main.App.shop.GetBugs(main.App.game[1])
            console.log(bugIds)
            for (var i = 0; i < main.App.game[11]; i++)
            {
                if (i > 0)
                    div.append('<hr style="width:80%">')
                
                bugIds[i] = web3.toBigNumber(bugIds[i]).toNumber()
                var bug = await main.App.shop.bugs(bugIds[i])
                //console.log('bug id: ' + bugIds[i])
                div.append('<p>reported on: ' + main.makeDate(bug[2]) + '</p>')
                div.append('<p>by: ' + bug[1] + '</p>')
                div.append('<p>fixed: ' + bug[4] + '</p>')
                div.append('<p>description:</p>')
                div.append('<textarea readonly style="resize:none;width:80%">' + bug[3] + '</textarea>')
                div.append('<button type="button" id="fixbug' + bugIds[i] + '"></button>')
                if (!bug[4])
                    $('#fixbug' + bugIds[i]).html('Mark bug as fixed')
                else
                    $('#fixbug' + bugIds[i]).html('Mark bug as unfixed')
                $('#fixbug' + bugIds[i]).on('click', {id: bugIds[i]}, main.fixBug)

            }
        }
        else {
            div.append('<p>This game doesnt have any reported bugs</p>')
        }

        div.show()
    }

    clearContent() {//except options ir game info
        var content = $('#content')
        content.find('div:not(#options, #gameInfo, #sellerInfo)').remove()
    }

    async fixBug (e) {
        e.preventDefault()
        //main.setLoading(true)
        window.alert('confirm the transaction to report a bug')
        await main.App.shop.FixBug(e.data.id)
        main.clearContent()
        main.renderBugs()
        //main.setLoading(false)
        //window.location.reload()
    }

    async submitBug (e) {
        e.preventDefault()
        var msg = $('#msg').val()
        main.setLoading(true)
        window.alert('confirm the transaction to report a bug')
        await main.App.shop.AddBug(main.App.game[1], msg)
        window.location.reload()
    }

    async submitRefundRequest (e) {
        e.preventDefault()
        var msg = $('#reason').val()
        main.setLoading(true)
        window.alert('confirm the transaction to submit refund request')
        await main.App.shop.AskRefund(main.App.game[1], msg)
        window.location.reload()
    }

    async submitReview (e) {
        e.preventDefault()
        var msg = $('#msg').val()
        var rating = $('input[name="rating"]:checked').val()
        main.setLoading(true)
        window.alert('confirm the transaction to submit review')
        await main.App.shop.AddReview(main.App.game[1], msg, rating)
        window.location.reload()
    }

    async buy (e) {
        e.preventDefault()
        main.setLoading(true)
        window.alert('confirm the transaction to buy game id:' + main.App.game[1])
        await main.App.shop.BuyGame(main.App.game[1], {from: main.App.account, value: e.data.price})
        main.render()
        main.setLoading(false)
        window.location.reload()
    }
}

let main = new Main()
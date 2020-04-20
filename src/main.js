import {Main as seller} from './seller.js'
import {Admin as admin} from './admin.js'
import {Main as game} from './game.js'
import {Main as games} from './games.js'
import {Main as index} from './index.js'
import {Main as profile} from './profile.js'

var url = window.location.pathname
switch (url) {
    case '/index.html':
    case '/':
        var main = new index()
        break
    case '/admin.html':
        var main = new admin()
        break
    case '/seller.html':
        var main = new seller()
        break
    case '/game.html':
        var main = new game()
        break
    case '/games.html':
        var main = new games()
        break
    case '/profile.html':
        var main = new profile()
        break
    default:
        window.alert('errrrrrrror')
        var main = new index()
        break
}

$(() => {
    $(window).load(() => {
        main.render()
    })
})
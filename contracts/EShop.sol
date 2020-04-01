pragma solidity ^0.6;

contract EShop {

    uint256 public gameCount; // skirtingi esantys zaidimai shope
    uint256 public totalSoldCopies; // parduotu kopiju skaicius

    struct Game {
        bool initialized;
        uint256 id;
        address payable seller;
        string name;
        string short_desc;
        uint256 price;
        uint256 releaseYear;
        uint256 soldCopies;
        bool state; //0(false) - not for sale; 1(true) - for sale
    }

    Game[] public games; // parduodami zaidimai

    struct User {
        //address addr;
        string name;
        Groups group;
        uint256 ownedGames;
        mapping (uint256 => Game) myGames;
    }

    enum Groups { Normal, Seller, Admin }

    mapping (address => User) public Users;

    constructor() public {
        Users[msg.sender].name = "Armis1337";
        Users[msg.sender].group = Groups.Admin;
    }

    modifier onlyAdmin() {
        require(Users[msg.sender].group == Groups.Admin, "only admin can do this");
        _;
    }

    modifier onlyNormal() {
        require(Users[msg.sender].group == Groups.Normal, "only normal user can do this");
        _;
    }

    modifier onlySeller() { // or admin XD
        require(Users[msg.sender].group == Groups.Seller || Users[msg.sender].group == Groups.Admin, "you cant do this");
        _;
    }

    modifier notSeller() {
        require(Users[msg.sender].group != Groups.Seller, "Sellers cant buy games!");
        _;
    }

    function CreateGame (string memory _name, string memory _sh_desc, uint256 _price, uint256 _year, bool _state)
        public
        onlySeller
    {
        games.push(Game(
            {
                id: gameCount,
                seller: msg.sender,
                name: _name,
                short_desc: _sh_desc,
                price: _price,
                releaseYear: _year,
                soldCopies: 0,
                state: _state,
                initialized: true
            }));
        gameCount ++;
    }

    function UpdateGame (uint256 _id, string memory _name, string memory _sh_desc, uint256 _price, uint256 _year, bool _state)
        public
        onlyAdmin
    {
        games[_id].name = _name;
        games[_id].short_desc = _sh_desc;
        games[_id].price = _price;
        games[_id].releaseYear = _year;
        games[_id].state = _state;
    }

    function DeleteGame (uint256 _id)
        public
        onlyAdmin
    {
        delete games[_id];
        gameCount--;
    }

    function BuyGame (uint256 _id)
        public
        payable
        notSeller
    {
        require(games[_id].state == true, "this game is not for sale");
        require(msg.value >= games[_id].price, "not enough ether");
        require(Users[msg.sender].myGames[_id].initialized == false, "you own this game");
        require(msg.sender != games[_id].seller, "You cant buy your own game");
        games[_id].seller.transfer(games[_id].price);
        //msg.sender.transfer(address(this).balance); //duodam pirkejui grazos, jei per daug pervede
        Users[msg.sender].myGames[_id] = games[_id];
        Users[msg.sender].ownedGames ++;
        games[_id].soldCopies ++;
        totalSoldCopies ++;
    }

    function GetGamesLength()
        public
        view
        returns (uint256)
    {
        return games.length;
    }

    function UserHasGame (address _addr, uint256 _id) public view returns (bool)
    {
        return Users[_addr].myGames[_id].initialized;
    }

    function ChangeGroup (address _addr, Groups _gr) // pakeisti userio grupe, tik adminui
        public
        onlyAdmin
    {
        //require(Users[_addr].group != _gr, "user is already in this group");
        Users[_addr].group = _gr;
    }

    function ChangeName (string memory _new) // pasikeisti savo varda
        public
    {
        //require reiktu pridet, kad belekokio sudo neprivestu, bet kol kas bus ok
        Users[msg.sender].name = _new;
    }

    function ChangeName (string memory _new, address _addr) // pakeisti bet kokio userio varda, bet tik adminui
        public
        onlyAdmin
    {
        Users[_addr].name = _new;
    }

}
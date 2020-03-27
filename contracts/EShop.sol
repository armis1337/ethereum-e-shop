pragma solidity ^0.6;

contract EShop {

    uint256 public gameCount; // skirtingi esantys zaidimai shope
    uint256 public totalSoldCopies; // parduotu kopiju skaicius

    struct Game {
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
        address _address;
        string name;
        Groups group;
    }

    enum Groups { Normal, Seller, Admin }

    mapping (address => User) public Users;

    constructor() public {
        Users[msg.sender] = User(msg.sender, "Armis1337", Groups.Admin);
    }

    modifier onlyAdmin() {
        require(Users[msg.sender].group == Groups.Admin, "only admin can do this");
        _;
    }

    function CreateGame(string memory _name, string memory _sh_desc, uint256 _price, uint256 _year, bool _state)
        public
        onlyAdmin
    {
        games.push(Game(
            {
                seller: msg.sender,
                name: _name,
                short_desc: _sh_desc,
                price: _price,
                releaseYear: _year,
                soldCopies: 0,
                state: _state
            }));
        gameCount ++;
    }

}
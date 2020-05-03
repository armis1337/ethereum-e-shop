pragma solidity ^0.6;

contract EShop {

    uint256 public gameCount; // skirtingi esantys zaidimai shope
    uint256 public totalSoldCopies; // parduotu kopiju skaicius
    address payable wallet;

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
        uint256 creationDate;
        uint256 reviewCount;
        uint256 bugCount;
        mapping (uint256 => uint256) reviews; //zaidimo review nr -> review nr bendram masyve
        mapping (uint256 => uint256) bugs; //zaidimo bugo numeris -> bendras bugo nr visam shope
    }

    Game[] public games; // parduodami zaidimai

    struct User {
        string name;
        Groups group;
        uint256 ownedGames; //  createdGames jei adminas arba selleris
        uint256 groupid; // =0 jei normal, >0 jei seller arba admin
        uint256 debt;
        address payable debtTo;
        string description;
        uint256 year;
        string email;
        mapping (uint256 => Game) myGames; // zaidimo id -> zaido obj
        mapping (uint256 => uint256) buyDates; // zaido id -> pirkimo data
        mapping (uint256 => bool) myRequests; // zaidimo id -> ar jau requestino refundo
        mapping (uint256 => bool) myReviews; // zaidimo id -> ar reviewino
    }

    enum Groups { Normal, Seller, Admin }

    mapping (address => User) public Users; // all
    address[] public Admins;
    address[] public Sellers;

    struct RefundReq {
        uint256 gameId;
        address payable owner;
        uint256 price;
        string reason;
        RequestState state;
    }

    enum RequestState { Waiting, Denied, Refunded }

    RefundReq[] public refunds;// all requests
    uint256 public waitingRefunds;

    struct Review {
        uint256 gameId;
        address by;
        uint256 rating;
        string text;
        uint256 date;
    }

    Review[] public reviews;

    struct Bug {
        uint256 gameId;
        address by;
        uint256 date;
        string text;
        bool isFixed;
    }

    Bug[] public bugs;

    constructor() public {
        wallet = msg.sender;
        Users[msg.sender].name = "Admin";
        Users[msg.sender].group = Groups.Admin;
        Admins.push(msg.sender);
        Users[msg.sender].groupid = Admins.length;
        //CreateGame("nfs", "desc", 1337, 1998, true);
    }

    modifier onlyAdmin() {
        require(Users[msg.sender].group == Groups.Admin, "only admin can do this");
        _;
    }

    modifier onlySeller() { // or admin XD
        require(Users[msg.sender].group == Groups.Seller || Users[msg.sender].group == Groups.Admin, "only seller can do this");
        _;
    }

    modifier onlyNormal() {
        require(Users[msg.sender].group == Groups.Normal, "only normal user can do this");
        _;
    }

    modifier ifGameExists(uint256 _id) {
        require(_id < games.length && games[_id].initialized, "game doesnt exist");
        _;
    }

    modifier notSeller() {
        require(Users[msg.sender].group != Groups.Seller, "sellers cant do this");
        _;
    }

    modifier onlyCreator(uint256 _id) { // or admin
        require(games[_id].seller == msg.sender || Users[msg.sender].group == Groups.Admin, "only creator of the game can do this");
        _;
    }

    modifier onlyOwner(uint256 _id) {
        require(UserHasGame(msg.sender, _id), "only owner of the game can do this");
        _;
    }

    function CreateGame (string memory _name, string memory _sh_desc, uint256 _price, uint256 _year, bool _state)
        public
        onlySeller
    {
        games.push(Game(
            {
                id: games.length,
                seller: msg.sender,
                name: _name,
                short_desc: _sh_desc,
                price: _price + _price * 1/5,
                releaseYear: _year,
                soldCopies: 0,
                state: _state,
                initialized: true,
                creationDate: now,
                reviewCount: 0,
                bugCount: 0
            }));
        gameCount ++;
        Users[msg.sender].ownedGames ++;
    }

    function UpdateGame (uint256 _id, string memory _name, string memory _sh_desc, uint256 _price, uint256 _year, bool _state)
        public
        onlyCreator(_id)
    {
        games[_id].name = _name;
        games[_id].short_desc = _sh_desc;
        games[_id].price = _price;
        games[_id].releaseYear = _year;
        games[_id].state = _state;
    }

    function DeleteGame (uint256 _id)
        public
        onlyCreator(_id)
    {
        Users[games[_id].seller].ownedGames--;
        //delete games[_id]; // pakeista i \i/
        games[_id].initialized = false;
        gameCount--;
    }

    function AddDebt(address _adr, uint256 _amount)
        public // reiktu gal i internal paskui pakeist
        onlyAdmin
    {
        require(Users[_adr].group != Groups.Normal, "user cannot be in normal group");
        require(_amount > 0, "wrong input");
        Users[_adr].debt += _amount;
        Users[_adr].debtTo = msg.sender; //
    }

    function ReturnDebt()
        public
        payable
    {
        require(Users[msg.sender].debt > 0, "wrong input");
        //wallet.transfer(msg.value);
        Users[msg.sender].debtTo.transfer(msg.value); //
        Users[msg.sender].debt -= msg.value;
    }

    function BuyGame (uint256 _id)
        public
        payable
        onlyNormal
    {
        require(games[_id].state == true, "game is not for sale");
        require(msg.value >= games[_id].price, "wrong amount");
        require(Users[msg.sender].myGames[_id].initialized == false, "game is deleted");
        wallet.transfer(games[_id].price / 6);//20% shopui
        if (Users[games[_id].seller].debt > 0) // jei skolingas
        {
            if(Users[games[_id].seller].debt > games[_id].price - games[_id].price / 6)// jei skoloj daugiau nei kainuoja zaidimas
            {
                wallet.transfer(games[_id].price - games[_id].price / 6);
                Users[games[_id].seller].debt -= (games[_id].price - games[_id].price / 6);
            }
            else // jei skolingas maziau, nei kainuoja geimas
            {
                wallet.transfer(Users[games[_id].seller].debt);//pervedam skola shopui
                games[_id].seller.transfer(games[_id].price - games[_id].price / 6 - Users[games[_id].seller].debt); // likuti selleriui
                Users[games[_id].seller].debt = 0;
            }
        }
        else
            games[_id].seller.transfer(games[_id].price - games[_id].price / 6);

        Users[msg.sender].myGames[_id] = games[_id];
        Users[msg.sender].buyDates[_id] = now;
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

    function GetSellersLength()
        public
        view
        returns (uint256)
    {
        return Sellers.length;
    }

    function GetAdminsLength()
        public
        view
        returns (uint256)
    {
        return Admins.length;
    }

    function UserHasGame (address _addr, uint256 _id) public view returns (bool)
    {
        require(Users[_addr].group == Groups.Normal, "");
        return Users[_addr].myGames[_id].initialized;
    }

    function MakeSeller (address _adr)
        public
        onlyAdmin
    {
        require(_adr != wallet, "main admin cannot be removed from admin group");
        require((Users[_adr].group == Groups.Normal && Users[_adr].ownedGames == 0) ||
                Users[_adr].group == Groups.Admin, "user cannot become seller");

        if (Users[_adr].group == Groups.Admin)
            delete Admins[Users[_adr].groupid - 1];

        Users[_adr].group = Groups.Seller;
        Sellers.push(_adr);
        Users[_adr].groupid = Sellers.length;
    }

    function MakeAdmin (address _adr)
        public
        onlyAdmin
    {
        require((Users[_adr].group == Groups.Normal && Users[_adr].ownedGames == 0) ||
                Users[_adr].group == Groups.Seller, "user cannot become admin");
        if (Users[_adr].group == Groups.Seller)
            delete Sellers[Users[_adr].groupid - 1];

        Users[_adr].group = Groups.Admin;
        Admins.push(_adr);
        Users[_adr].groupid = Admins.length; // trinant -1 butinai
    }

    function MakeNormal (address _adr)
        public
        onlyAdmin
    {
        require(_adr != wallet, "you cannot remove main admin from admin group");
        require(Users[_adr].group != Groups.Normal, "user is in normal group already");
        require(Users[_adr].ownedGames == 0, "user cannot become normal user - delete games first");
        require(Users[_adr].debt == 0, "user has to return debt first");
        if (Users[_adr].group == Groups.Admin)
        {
            Users[_adr].group = Groups.Normal;
            delete Admins[Users[_adr].groupid - 1];
            Users[_adr].groupid = 0;
        }
        else if (Users[_adr].group == Groups.Seller)
        {
            Users[_adr].group = Groups.Normal;
            delete Sellers[Users[_adr].groupid - 1];
            Users[_adr].groupid = 0;
        }
    }

    function ChangeName (string memory _new) // pasikeisti savo varda
        public
    {
        //require reiktu pridet, kad belekokio sudo neprivestu, bet kol kas bus ok
        Users[msg.sender].name = _new;
    }

    function ChangeDescription (string memory _desc)
        public
    {
        //tikrininmo cj
        Users[msg.sender].description = _desc;
    }

    function ChangeYear (uint256 _year)
        public
    {
        require(_year >= 1 && _year <= 9999, "wrong input");
        Users[msg.sender].year = _year;
    }

    function ChangeMail (string memory _mail)
        public
    {
        Users[msg.sender].email = _mail;
    }

    function ChangeInfo (string memory _name, string memory _desc, uint256 _year, string memory _email)
        public
    {
        Users[msg.sender].name = _name;
        Users[msg.sender].description = _desc;
        Users[msg.sender].year = _year;
        Users[msg.sender].email = _email;
    }

    function GetSellersGames(address _adr) // id + sukurimo data
        public
        view
        returns (bytes32[] memory)
    {
        bytes32[] memory arr = new bytes32[](Users[_adr].ownedGames);
        uint256 k = 0;
        for (uint256 i = 0; i<games.length; i++)
        {
            if (k == Users[_adr].ownedGames)
                break;

            if (games[i].seller == _adr && games[i].initialized)
            {
                arr[k] = bytes32(games[i].id); // zaidimo id
                k++;
            }
        }
        return arr;
    }
    function GetUsersGames(address _adr) // id + pirkimo data
        public
        view
        returns (bytes32[] memory, bytes32[] memory)
    {
        require(Users[_adr].ownedGames > 0, "user doesnt have any games");
        bytes32[] memory arr = new bytes32[](Users[_adr].ownedGames);
        bytes32[] memory dates = new bytes32[](Users[_adr].ownedGames);
        uint256 k;
        for (uint256 i = 0; i<games.length; i++)
        {
            if (k == Users[msg.sender].ownedGames)
                break;

            if (UserHasGame(msg.sender, i))
            {
                arr[k] = bytes32(i);
                dates[k] = bytes32(Users[_adr].buyDates[i]);
                k++;
            }
        }
        return (arr, dates);
    }

    function GetRefundState(uint256 _id)
        public
        view
        returns (bool)
    {
        return Users[msg.sender].myRequests[_id];
    }

    function GetReviewState(uint256 _id)
        public
        view
        returns (bool)
    {
        return Users[msg.sender].myReviews[_id];
    }

    function GetPriceBought(uint256 _id)
        public
        view
        returns (uint256 price)
    {
        return Users[msg.sender].myGames[_id].price;
    }

    function AskRefund(uint256 _id, string memory _reason)
        public
    {
        //require(Users[msg.sender].myGames[_id].initialized, "you dont own this game");
        require(UserHasGame(msg.sender, _id), "you dont own this game");
        require(!HasAskedRefund(msg.sender, _id), "you cannot ask for refund twice");
        refunds.push(RefundReq({
            gameId: _id,
            owner: msg.sender,
            reason: _reason,
            price: GetPriceBought(_id),
            state: RequestState.Waiting
        }));
        Users[msg.sender].myRequests[_id] = true;
        waitingRefunds ++;
    }

    function HasAskedRefund (address _adr, uint256 _id)
        public
        view
        returns (bool)
    {
        return Users[_adr].myRequests[_id];
    }

    function GetRefundsLength ()
        public
        view
        returns (uint256)
    {
        return refunds.length;
    }

    function ConfirmRefund (uint256 _id)
        public
        payable
        onlyAdmin
    {
        require(refunds[_id].state == RequestState.Waiting, "");
        if (games[refunds[_id].gameId].seller != msg.sender)
            AddDebt(games[refunds[_id].gameId].seller, refunds[_id].price);
        refunds[_id].owner.transfer(refunds[_id].price);
        delete Users[refunds[_id].owner].myGames[refunds[_id].gameId];
        delete Users[refunds[_id].owner].buyDates[refunds[_id].gameId];
        Users[refunds[_id].owner].ownedGames--;
        games[refunds[_id].gameId].soldCopies--; //
        delete Users[refunds[_id].owner].myRequests[refunds[_id].gameId]; //
        refunds[_id].state = RequestState.Refunded;
        waitingRefunds--;
    }

    function DenyRefund (uint256 _id)
        public
        onlyAdmin
    {
        require(refunds[_id].state == RequestState.Waiting, "request is already confirmed");
        refunds[_id].state = RequestState.Denied;
        waitingRefunds--;
    }

    function AddReview (uint256 _id, string memory _msg, uint256 _rating)
        public
        onlyOwner(_id)
    {
        require(!Users[msg.sender].myReviews[_id], "you have alrady written a review for this game");
        require(_rating >= 1 && _rating <= 10, "wrong input");
        reviews.push(Review({
            gameId: _id,
            by: msg.sender,
            rating: _rating,
            text: _msg,
            date: now
        }));
        games[_id].reviews[games[_id].reviewCount] = reviews.length - 1;
        games[_id].reviewCount ++;
        Users[msg.sender].myReviews[_id] = true;
    }

    function GetReviews (uint256 _id)
        public
        view
        returns (bytes32[] memory)
    {
        bytes32[] memory arr = new bytes32[](games[_id].reviewCount);

        for (uint256 i = 0; i < games[_id].reviewCount; i++)
        {
            arr[i] = bytes32(games[_id].reviews[i]);
        }
        return arr;
    }

    function AddBug (uint256 _id, string memory _msg)
        public
        onlyOwner(_id)
    {
        bugs.push(Bug({
            gameId: _id,
            text: _msg,
            by: msg.sender,
            date: now,
            isFixed: false
        }));
        games[_id].bugs[games[_id].bugCount] = bugs.length - 1;
        games[_id].bugCount ++;
    }

    function GetBugs (uint256 _id)
        public
        view
        returns (bytes32[] memory)
    {
        bytes32[] memory arr = new bytes32[](games[_id].bugCount);
        for (uint256 i = 0; i < games[_id].bugCount; i++)
        {
            arr[i] = bytes32(games[_id].bugs[i]);
        }
        return arr;
    }

    function FixBug (uint256 _id) // bug id
        public
        onlyCreator(bugs[_id].gameId)
    {
        bugs[_id].isFixed = !bugs[_id].isFixed;
    }
}
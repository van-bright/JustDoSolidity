// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Employee {

    enum EmployType { FORMAL, INFORMAL }

    struct Employor {
        address wallet;
        uint8 age;
        uint256 salary;
        string department;
        uint256 start;
        uint256 end;
        EmployType typ;
    }

    mapping(address => bool) public payRecords;
    mapping(address => uint) public posIndexes;

    Employor[] public employers;

    address owner;

    // define an event
    event EmployerAdded(address indexed employee, string department, uint256 start, uint256 end);

    // define a modifier
    modifier onlyOwner() {
        require(msg.sender == owner, "only owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    receive() payable external {
        // to receive ETH
    }

    function isWalletValid(address _wallet) public pure returns(bool) {
        return _wallet != address(0);
    }

    function addEmployor(Employor memory employer) external onlyOwner {
        uint idx = posIndexes[employer.wallet];
        require(idx == 0, "wallet exist");

        employers.push(employer);

        posIndexes[employer.wallet] = employers.length;

        emit EmployerAdded(employer.wallet, employer.department, employer.start, employer.end);
    }

    function pay(address payable wallet) external onlyOwner {
        require(!payRecords[wallet], "paied already");

        wallet.transfer(0.1 ether);

        payRecords[wallet] = true;
    }

    function incoming() external payable {
        require(msg.value == 1.0 ether, "incoming value invalid");
    }

    function getEmployor(address wallet) public view returns(Employor memory) {
        uint256 pos = posIndexes[wallet];

        return employers[pos - 1];
    }
}
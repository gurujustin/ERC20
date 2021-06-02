pragma solidity >=0.4.22 <0.9.0;

contract DappToken {
    //  Name
    string public name = "DApp Token";

    //  Symbol
    string public symbol = "DAPP";

    //  Standard
    string public standard = "DApp Token v1.0";

    uint256 public totalSupply;
    
    mapping(address => uint256) public balanceOf;

    constructor (uint256 _initialSupply) public {
        totalSupply = _initialSupply;
        balanceOf[msg.sender] = _initialSupply;
    }
}
pragma solidity >=0.4.22 <0.9.0;

contract DappToken {
    //  Name
    string public name = "DApp Token";

    //  Symbol
    string public symbol = "DAPP";

    //  Standard
    string public standard = "DApp Token v1.0";

    // totalSupply
    uint256 public totalSupply;
    
    //  balanceOf
    mapping(address => uint256) public balanceOf;

    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

    constructor (uint256 _initialSupply) public {
        totalSupply = _initialSupply;
        balanceOf[msg.sender] = _initialSupply;
    }

    //  Transfer
    //  Exception if account doesnt have enough
    //  Return bool
    //  transfer event
    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value);

        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;

        emit Transfer(msg.sender, _to, _value);

        return true;
    }
}
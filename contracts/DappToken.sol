// SPDX-License-Identifier: MIT
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
    //  allowance
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    constructor (uint256 _initialSupply) {
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

    // approve
    function approve(address _spender, uint256 _value) public returns (bool success) {
        // allowance
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    //  transferFrom
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        //  Require _from has enough token
        require(_value <= balanceOf[_from]);
        //  Require allowance is big eough token
        require(_value <= allowance[_from][msg.sender]);
        //  change the balance
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        //  update allowance
        allowance[_from][msg.sender] -= _value;
        //  Transfer event
        emit Transfer(_from, _to, _value);
        //  return bool
        return true;
    }
}

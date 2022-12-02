// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract BasicDataType {
    // 对于没有public的数据类型, 默认是private的.

    bool paused = true;
    // 对于int类型来说, 每加8位都支持, 走到256
    uint8 _u8;
    int8 _i8;

    uint144 _u144;
    uint256 _u256;
    // bytes类型, 一个byte是8bit
    bytes1 _bytes1;
    bytes2 _bytes2;
    bytes32 _bytes32;

    string _symbol;

    // 对于public的数据成员, 编译时会默认生成get方法
    // private的数据成员, 不会生成get方法

    // 针对下面这个成员, 编译器会生成get方法:  function totalSupply() public view returns(uint256) { return totalSupply; }
    uint256 public totalSupply;

    // 可以用constant声明常量, 常量在编译时会自动被替换, 不占用存储空间
    uint256 public constant TOKEN_DECIMAL = 18;

    // 可以用immutable声明一个可以初始化的常量, 在constructor中被初始化之后, 行为类似于常量
    address public immutable owner;

    constructor() {
        owner = msg.sender;
    }

    function globalVariables() public payable returns(bool) {
        // 时间单位
        uint256 aDay = 1 days;
        uint256 anHour = 1 hours;

        // 货币单位
        uint256 aEth  = 1 ether;
        uint256 aGwei = 1 gwei;
        uint256 aWei  = 1 wei;

        // block信息
        uint256 timestamp = block.timestamp;
        uint256 number = block.number;
        address coinbase = block.coinbase;
        // 还有很多......

        // msg信息
        uint256 value     = msg.value;
        address sender    = msg.sender;
        bytes4  selector  = msg.sig;   // bytes4(keccak256("globalVariables()"))
        bytes memory data = msg.data;

        // tx
        address origin = tx.origin;
        uint256 gasPrice = tx.gasprice;

        return block.timestamp == 0;
    }
}
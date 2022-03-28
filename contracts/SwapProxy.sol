// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "hardhat/console.sol";

import "./../interfaces/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract SwapProxy is Ownable {
    address public daiAddress;
    address public inchAddress;

    struct SwapDescription {
        IERC20 srcToken;
        IERC20 dstToken;
        address srcReceiver;
        address dstReceiver;
        uint256 amount;
        uint256 minReturnAmount;
        uint256 flags;
        bytes permit;
    }

    address immutable AGGREGATION_ROUTER_V4;
    IERC20 daiToken;
    IERC20 inchToken;
    constructor(address router, address _daiAddress, address _inchAddress){
        AGGREGATION_ROUTER_V4 = router;
        daiAddress = _daiAddress;
        inchAddress = _inchAddress;
        daiToken = IERC20(daiAddress);
        inchToken = IERC20(inchAddress);
        
    }
    function approve(uint256 _amount) public {
        daiToken.approve(msg.sender, _amount);
        daiToken.approve(daiAddress, _amount);
    }
    function getDaiBalance() public view returns(uint) {
        return daiToken.balanceOf(msg.sender);
    }
    function get1InchBalance() public view returns(uint) {
        return inchToken.balanceOf(msg.sender);
    }

    function swap(uint minOut, bytes calldata _data)  external onlyOwner {
        console.log("SwapProxy::swap");
        (address _c, SwapDescription memory desc, bytes memory _d) = abi.decode(_data[4:], (address, SwapDescription, bytes));
        
        IERC20(desc.srcToken).transferFrom(msg.sender, address(this), desc.amount);
        IERC20(desc.srcToken).approve(AGGREGATION_ROUTER_V4, desc.amount);

        (bool succ, bytes memory _data) = address(AGGREGATION_ROUTER_V4).call(_data);
        console.log("SwapProxy::swap5");
        if (succ) {
            (uint returnAmount, uint gasLeft) = abi.decode(_data, (uint, uint));
            require(returnAmount >= minOut);
        } else {
            revert("Failed to swap -_-");
        }
    }
}

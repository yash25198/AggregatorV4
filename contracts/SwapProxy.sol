// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "hardhat/console.sol";

import "./../interfaces/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract SwapProxy is Ownable {
    address public daiAddress= 0x6B175474E89094C44Da98b954EedeAC495271d0F;
    address public inchAddress = 0x111111111117dC0aa78b770fA6A738034120C302 ;

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

    address immutable AGGREGATION_ROUTER_V3;
    IERC20 daiToken = IERC20(daiAddress);
    IERC20 inchToken = IERC20(inchAddress);
    constructor(address router) {
        AGGREGATION_ROUTER_V3 = router;
        
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
        IERC20(desc.srcToken).approve(AGGREGATION_ROUTER_V3, desc.amount);

        (bool succ, bytes memory _data) = address(AGGREGATION_ROUTER_V3).call(_data);
        console.log("SwapProxy::swap5");
        if (succ) {
            (uint returnAmount, uint gasLeft) = abi.decode(_data, (uint, uint));
            require(returnAmount >= minOut);
        } else {
            revert("Failed to swap -_-");
        }
    }
}
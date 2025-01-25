// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./container.sol";

contract Receiver {
    
    Container private containerContract;

    constructor(address _containerContract){
        containerContract = Container(_containerContract);
    }

    function confirmDelivery(string memory _id) public {
        containerContract.updateStatus(_id, "Delivered");
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./container.sol";

contract Sender {
    Container private containerContract;

    constructor(address _containerContract) {
        containerContract = Container(_containerContract);
    }

    function sendContainer(string memory _id, address _transporter) public {
        containerContract.registerContainer(_id, msg.sender);
        containerContract.transferOwnership(_id, _transporter);
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract Container {
    struct ContainerDetails {
        string id;
        address currentOwner;
        string currentStatus;
        uint256 timestamp;
    }

    mapping(string => ContainerDetails) public containers;

    event ContainerRegistered(string containerId, address owner);
    event StatusUpdated(string containerId, string newStatus);

    function registerContainer(string memory _id, address _owner) public {
        require(bytes(_id).length > 0, "Container ID cannot be empty");
        containers[_id] = ContainerDetails(_id, _owner, "Registered", block.timestamp);
        emit ContainerRegistered(_id, _owner);
    }

    function updateStatus(string memory _id, string memory _newStatus) public {
        require(msg.sender == containers[_id].currentOwner, "Not authorized");
        containers[_id].currentStatus = _newStatus;
        containers[_id].timestamp = block.timestamp;
        emit StatusUpdated(_id, _newStatus);
    }

    function transferOwnership(string memory _id, address _newOwner) public {
        require(msg.sender == containers[_id].currentOwner, "Not authorized");
        containers[_id].currentOwner = _newOwner;
    }
}

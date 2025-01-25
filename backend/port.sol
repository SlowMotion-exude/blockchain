// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


contract Port {
    struct PortLog {
        string containerId;
        string status;
        uint256 timestamp;
    }

    mapping(string => PortLog[]) public portLogs;

    event ContainerLogged(string containerId, string status);

    function logContainer(string memory _id, string memory _status) public {
        PortLog memory newLog = PortLog(_id, _status, block.timestamp);
        portLogs[_id].push(newLog);
        emit ContainerLogged(_id, _status);
    }

    function getLogs(string memory _id) public view returns (PortLog[] memory) {
        return portLogs[_id];
    }
}

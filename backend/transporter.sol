// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Transporter {
    struct TransportRecord {
        string containerId;
        address transporter;
        string status;
        uint256 timestamp;
    }

    mapping(string => TransportRecord) public transportRecords;

    event TransportAssigned(string containerId, address transporter);
    event TransportStatusUpdated(string containerId, string status);

    modifier onlyTransporter(string memory _id) {
        require(transportRecords[_id].transporter == msg.sender, "Not authorized");
        _;
    }

    function assignTransport(string memory _id, address _transporter) public {
        require(transportRecords[_id].transporter == address(0), "Transport already assigned");
        transportRecords[_id] = TransportRecord(_id, _transporter, "Assigned", block.timestamp);
        emit TransportAssigned(_id, _transporter);
    }

    function updateTransportStatus(string memory _id, string memory _status) public onlyTransporter(_id) {
        require(bytes(transportRecords[_id].status).length > 0, "No transport record found");
        transportRecords[_id].status = _status;
        transportRecords[_id].timestamp = block.timestamp;
        emit TransportStatusUpdated(_id, _status);
    }
}

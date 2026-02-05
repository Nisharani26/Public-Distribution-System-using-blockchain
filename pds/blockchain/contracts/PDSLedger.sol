// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract PDSLedger {

    address public authority;

    constructor() {
        authority = msg.sender;
    }

    modifier onlyAuthority() {
        require(msg.sender == authority, "Not authority");
        _;
    }

    struct TransactionRecord {
        string txType;        // USER / SHOP
        string mongoId;       // MongoDB _id
        string dataHash;      // Hash of transaction JSON
        uint256 timestamp;
    }

    TransactionRecord[] public transactions;

    event TransactionAdded(
        string txType,
        string mongoId,
        string dataHash,
        uint256 timestamp
    );

    function addTransaction(
        string memory _txType,
        string memory _mongoId,
        string memory _dataHash
    ) public onlyAuthority {
        transactions.push(
            TransactionRecord(
                _txType,
                _mongoId,
                _dataHash,
                block.timestamp
            )
        );

        emit TransactionAdded(_txType, _mongoId, _dataHash, block.timestamp);
    }

    function getTransactionCount() public view returns (uint256) {
        return transactions.length;
    }

    function getTransaction(uint256 index)
        public
        view
        returns (TransactionRecord memory)
    {
        return transactions[index];
    }
}

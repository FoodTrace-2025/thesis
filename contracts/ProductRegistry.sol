// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract ProductRegistry is AccessControl {
    bytes32 public constant PRODUCER_ROLE = keccak256("PRODUCER_ROLE");

    struct Product {
        uint256 id;
        string name;
        string origin;
        uint256 harvestDate;
        address producer;
        uint256 timestamp;
        bool exists;
    }

    uint256 public productCount;
    mapping(uint256 => Product) public products;

    event ProductRegistered(
        uint256 indexed productId,
        address indexed producer,
        string name,
        uint256 timestamp
    );

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function registerProduct(
        string memory name,
        string memory origin,
        uint256 harvestDate
    ) public onlyRole(PRODUCER_ROLE) returns (uint256) {
        require(bytes(name).length > 0, "Name required");
        require(harvestDate <= block.timestamp, "Future date not allowed");

        productCount++;
        products[productCount] = Product({
            id: productCount,
            name: name,
            origin: origin,
            harvestDate: harvestDate,
            producer: msg.sender,
            timestamp: block.timestamp,
            exists: true
        });

        emit ProductRegistered(productCount, msg.sender, name, block.timestamp);
        return productCount;
    }

    function getProduct(uint256 productId) public view returns (Product memory) {
        require(products[productId].exists, "Product does not exist");
        return products[productId];
    }

    function productExists(uint256 productId) public view returns (bool) {
        return products[productId].exists;
    }

    function getProductCount() public view returns (uint256) {
        return productCount;
    }

    function grantProducerRole(address account) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(PRODUCER_ROLE, account);
    }

    function revokeProducerRole(address account) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _revokeRole(PRODUCER_ROLE, account);
    }

    function hasProducerRole(address account) public view returns (bool) {
        return hasRole(PRODUCER_ROLE, account);
    }
}

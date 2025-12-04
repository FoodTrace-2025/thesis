// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract ProductRegistry is AccessControl {
    bytes32 public constant PRODUCER_ROLE = keccak256("PRODUCER_ROLE");
    bytes32 public constant DISTRIBUTOR_ROLE = keccak256("DISTRIBUTOR_ROLE");
    bytes32 public constant RETAILER_ROLE = keccak256("RETAILER_ROLE");

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

    /// @notice Represents a single trace record in the supply chain
    struct TraceRecord {
        uint256 productId;
        address actor;      // msg.sender (producer/distributor/retailer wallet)
        string action;      // "RECEIVED", "QUALITY_CHECK", "SHIPPED", "STOCKED", "SOLD"
        string location;    // "Helsinki Distribution Center"
        string notes;       // Optional quality notes
        uint256 timestamp;  // block.timestamp (automatic, immutable)
    }

    /// @notice Maps productId to array of trace records
    mapping(uint256 => TraceRecord[]) public productTraceHistory;

    event ProductRegistered(
        uint256 indexed productId,
        address indexed producer,
        string name,
        uint256 timestamp
    );

    event TraceRecordAdded(
        uint256 indexed productId,
        address indexed actor,
        string action,
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

    /// @notice Add a trace record to a product's supply chain history
    /// @param productId The ID of the product
    /// @param action The action taken (e.g., "RECEIVED", "QUALITY_CHECK", "SHIPPED", "STOCKED", "SOLD")
    /// @param location The location where the action took place
    /// @param notes Optional notes about the action
    /// @return The index of the new trace record in the product's history array
    function addTraceRecord(
        uint256 productId,
        string memory action,
        string memory location,
        string memory notes
    ) public returns (uint256) {
        // Tri-role access control: PRODUCER OR DISTRIBUTOR OR RETAILER
        require(
            hasRole(PRODUCER_ROLE, msg.sender) ||
            hasRole(DISTRIBUTOR_ROLE, msg.sender) ||
            hasRole(RETAILER_ROLE, msg.sender),
            "Caller must be producer, distributor, or retailer"
        );

        // Product existence validation
        require(products[productId].exists, "Product not found");

        // Create and store trace record
        productTraceHistory[productId].push(TraceRecord({
            productId: productId,
            actor: msg.sender,
            action: action,
            location: location,
            notes: notes,
            timestamp: block.timestamp
        }));

        // Emit event for off-chain indexing
        emit TraceRecordAdded(productId, msg.sender, action, block.timestamp);

        // Return index for database storage
        return productTraceHistory[productId].length - 1;
    }

    /// @notice Get complete trace history for a product
    /// @param productId The ID of the product
    /// @return Array of all trace records for the product
    function getTraceHistory(uint256 productId) public view returns (TraceRecord[] memory) {
        return productTraceHistory[productId];
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

    // Distributor role management
    function grantDistributorRole(address account) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(DISTRIBUTOR_ROLE, account);
    }

    function revokeDistributorRole(address account) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _revokeRole(DISTRIBUTOR_ROLE, account);
    }

    function hasDistributorRole(address account) public view returns (bool) {
        return hasRole(DISTRIBUTOR_ROLE, account);
    }

    // Retailer role management
    function grantRetailerRole(address account) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(RETAILER_ROLE, account);
    }

    function revokeRetailerRole(address account) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _revokeRole(RETAILER_ROLE, account);
    }

    function hasRetailerRole(address account) public view returns (bool) {
        return hasRole(RETAILER_ROLE, account);
    }
}

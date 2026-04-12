// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title KKIKDAMarketplace
 * @author KKIKDA Team
 * @notice A simple NFT marketplace on BSC that supports listing, buying, and
 *         cancelling NFTs with a configurable platform fee.
 */
contract KKIKDAMarketplace is Ownable, ReentrancyGuard {
    // -------------------------------------------------------------------------
    // Types
    // -------------------------------------------------------------------------

    /// @notice Represents a single NFT listing.
    struct Listing {
        address seller;
        uint256 price;
        bool active;
    }

    // -------------------------------------------------------------------------
    // State
    // -------------------------------------------------------------------------

    /// @notice Platform fee in basis points (default 250 = 2.5 %).
    uint256 public platformFeeBps = 250;

    /// @notice Maximum allowed platform fee (10 %).
    uint256 public constant MAX_FEE_BPS = 1000;

    /// @notice Accumulated platform fees available for withdrawal.
    uint256 public accumulatedFees;

    /// @dev nftContract => tokenId => Listing
    mapping(address => mapping(uint256 => Listing)) private _listings;

    // -------------------------------------------------------------------------
    // Events
    // -------------------------------------------------------------------------

    event ItemListed(
        address indexed nftContract,
        uint256 indexed tokenId,
        address indexed seller,
        uint256 price
    );

    event ItemBought(
        address indexed nftContract,
        uint256 indexed tokenId,
        address indexed buyer,
        address seller,
        uint256 price
    );

    event ItemCancelled(
        address indexed nftContract,
        uint256 indexed tokenId,
        address indexed seller
    );

    event ItemPriceUpdated(
        address indexed nftContract,
        uint256 indexed tokenId,
        uint256 oldPrice,
        uint256 newPrice
    );

    event PlatformFeeUpdated(uint256 oldFeeBps, uint256 newFeeBps);

    event FeesWithdrawn(address indexed to, uint256 amount);

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    /**
     * @param initialOwner Address that owns the marketplace and receives fees.
     */
    constructor(address initialOwner) Ownable(initialOwner) {}

    // -------------------------------------------------------------------------
    // Listing management
    // -------------------------------------------------------------------------

    /**
     * @notice Lists an NFT for sale. The caller must own the token and have
     *         approved this contract.
     * @param nftContract Address of the ERC-721 contract.
     * @param tokenId     ID of the token to list.
     * @param price       Sale price in wei (BNB).
     */
    function listItem(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) external {
        require(price > 0, "Marketplace: price must be > 0");

        IERC721 nft = IERC721(nftContract);
        require(nft.ownerOf(tokenId) == msg.sender, "Marketplace: not token owner");
        require(
            nft.getApproved(tokenId) == address(this) ||
                nft.isApprovedForAll(msg.sender, address(this)),
            "Marketplace: not approved"
        );

        _listings[nftContract][tokenId] = Listing({
            seller: msg.sender,
            price: price,
            active: true
        });

        emit ItemListed(nftContract, tokenId, msg.sender, price);
    }

    /**
     * @notice Buys a listed NFT. The caller must send exactly the listing price.
     * @param nftContract Address of the ERC-721 contract.
     * @param tokenId     ID of the token to buy.
     */
    function buyItem(
        address nftContract,
        uint256 tokenId
    ) external payable nonReentrant {
        Listing storage listing = _listings[nftContract][tokenId];
        require(listing.active, "Marketplace: not listed");
        require(msg.value == listing.price, "Marketplace: incorrect price");
        require(msg.sender != listing.seller, "Marketplace: seller cannot buy own item");

        listing.active = false;

        // Calculate platform fee
        uint256 fee = (listing.price * platformFeeBps) / 10_000;
        uint256 sellerProceeds = listing.price - fee;
        accumulatedFees += fee;

        // Transfer NFT to buyer
        IERC721(nftContract).safeTransferFrom(listing.seller, msg.sender, tokenId);

        // Transfer proceeds to seller
        (bool success, ) = payable(listing.seller).call{value: sellerProceeds}("");
        require(success, "Marketplace: payment to seller failed");

        emit ItemBought(nftContract, tokenId, msg.sender, listing.seller, listing.price);
    }

    /**
     * @notice Cancels an active listing. Only the original seller can cancel.
     * @param nftContract Address of the ERC-721 contract.
     * @param tokenId     ID of the listed token.
     */
    function cancelListing(
        address nftContract,
        uint256 tokenId
    ) external {
        Listing storage listing = _listings[nftContract][tokenId];
        require(listing.active, "Marketplace: not listed");
        require(listing.seller == msg.sender, "Marketplace: not seller");

        listing.active = false;

        emit ItemCancelled(nftContract, tokenId, msg.sender);
    }

    /**
     * @notice Updates the price of an active listing.
     * @param nftContract Address of the ERC-721 contract.
     * @param tokenId     ID of the listed token.
     * @param newPrice    New sale price in wei (BNB).
     */
    function updatePrice(
        address nftContract,
        uint256 tokenId,
        uint256 newPrice
    ) external {
        require(newPrice > 0, "Marketplace: price must be > 0");

        Listing storage listing = _listings[nftContract][tokenId];
        require(listing.active, "Marketplace: not listed");
        require(listing.seller == msg.sender, "Marketplace: not seller");

        uint256 oldPrice = listing.price;
        listing.price = newPrice;

        emit ItemPriceUpdated(nftContract, tokenId, oldPrice, newPrice);
    }

    // -------------------------------------------------------------------------
    // View helpers
    // -------------------------------------------------------------------------

    /**
     * @notice Returns the listing details for a given NFT.
     * @param nftContract Address of the ERC-721 contract.
     * @param tokenId     Token ID.
     */
    function getListing(
        address nftContract,
        uint256 tokenId
    ) external view returns (Listing memory) {
        return _listings[nftContract][tokenId];
    }

    // -------------------------------------------------------------------------
    // Admin
    // -------------------------------------------------------------------------

    /**
     * @notice Updates the platform fee. Cannot exceed MAX_FEE_BPS.
     * @param newFeeBps New fee in basis points.
     */
    function setPlatformFee(uint256 newFeeBps) external onlyOwner {
        require(newFeeBps <= MAX_FEE_BPS, "Marketplace: fee exceeds maximum");
        uint256 oldFeeBps = platformFeeBps;
        platformFeeBps = newFeeBps;
        emit PlatformFeeUpdated(oldFeeBps, newFeeBps);
    }

    /**
     * @notice Withdraws all accumulated platform fees to the owner.
     */
    function withdrawFees() external onlyOwner nonReentrant {
        uint256 amount = accumulatedFees;
        require(amount > 0, "Marketplace: no fees to withdraw");

        accumulatedFees = 0;

        (bool success, ) = payable(owner()).call{value: amount}("");
        require(success, "Marketplace: withdrawal failed");

        emit FeesWithdrawn(owner(), amount);
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title KKIKDANft
 * @author KKIKDA Team
 * @notice ERC-721 NFT collection for the KKIKDA exchange platform on BSC.
 *         Supports enumeration, per-token metadata URIs, pausable transfers,
 *         and ERC-2981 royalty info.
 */
contract KKIKDANft is
    ERC721,
    ERC721Enumerable,
    ERC721URIStorage,
    ERC721Pausable,
    ERC2981,
    Ownable,
    AccessControl
{
    /// @notice Role identifier for addresses allowed to mint new NFTs.
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    /// @dev Counter for the next token ID. Starts at 1 so that ID 0 is never used.
    uint256 private _nextTokenId = 1;

    /// @dev Total number of tokens ever minted (not reduced by burns).
    uint256 private _totalMinted;

    /**
     * @notice Deploys the KKIKDA NFT collection with a default 2.5 % royalty
     *         paid to `initialOwner`.
     * @param initialOwner Address that receives ownership, admin, and minter roles.
     */
    constructor(address initialOwner)
        ERC721("KKIKDA Collection", "KKIKDANFT")
        Ownable(initialOwner)
    {
        _grantRole(DEFAULT_ADMIN_ROLE, initialOwner);
        _grantRole(MINTER_ROLE, initialOwner);

        // Default royalty: 2.5 % (250 basis points out of 10 000)
        _setDefaultRoyalty(initialOwner, 250);
    }

    // -------------------------------------------------------------------------
    // Minting
    // -------------------------------------------------------------------------

    /**
     * @notice Mints a new NFT to `to` with the given metadata `uri`.
     * @param to  Recipient of the NFT.
     * @param uri Token metadata URI (typically an IPFS link).
     * @return tokenId The ID of the newly minted token.
     */
    function safeMint(address to, string memory uri)
        external
        onlyRole(MINTER_ROLE)
        returns (uint256 tokenId)
    {
        tokenId = _nextTokenId;
        _nextTokenId++;
        _totalMinted++;

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    // -------------------------------------------------------------------------
    // Burning
    // -------------------------------------------------------------------------

    /**
     * @notice Burns `tokenId`. Caller must be the token owner or an approved
     *         operator.
     * @param tokenId The token to burn.
     */
    function burn(uint256 tokenId) external {
        require(
            _isAuthorized(ownerOf(tokenId), msg.sender, tokenId),
            "KKIKDANft: caller is not owner or approved"
        );
        _burn(tokenId);
        _resetTokenRoyalty(tokenId);
    }

    // -------------------------------------------------------------------------
    // Pause / Unpause
    // -------------------------------------------------------------------------

    /**
     * @notice Pauses all token transfers.
     */
    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    /**
     * @notice Unpauses token transfers.
     */
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    // -------------------------------------------------------------------------
    // Royalty management
    // -------------------------------------------------------------------------

    /**
     * @notice Sets the default royalty for all tokens.
     * @param receiver       Address to receive royalty payments.
     * @param feeNumerator   Royalty fee in basis points (e.g., 250 = 2.5 %).
     */
    function setRoyalty(address receiver, uint96 feeNumerator)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        _setDefaultRoyalty(receiver, feeNumerator);
    }

    // -------------------------------------------------------------------------
    // View helpers
    // -------------------------------------------------------------------------

    /**
     * @notice Returns the total number of tokens ever minted (unaffected by burns).
     */
    function totalMinted() external view returns (uint256) {
        return _totalMinted;
    }

    // -------------------------------------------------------------------------
    // Overrides required by Solidity for multiple inheritance
    // -------------------------------------------------------------------------

    /// @dev Hook called before every transfer. Enforces pause + enumerable logic.
    function _update(
        address to,
        uint256 tokenId,
        address auth
    )
        internal
        override(ERC721, ERC721Enumerable, ERC721Pausable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    /// @dev Increases the balance counter (Enumerable override).
    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    /// @dev Returns the token URI from URIStorage.
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    /// @dev Resolves supportsInterface across all parent contracts.
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage, ERC2981, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}

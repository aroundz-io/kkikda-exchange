// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title RWAToken
 * @author KKIKDA Team
 * @notice ERC-20 Real-World Asset token representing tokenised physical assets
 *         (e.g., Pu'er tea, aged tea, ceramics) on BSC.
 * @dev Each deployment represents one asset class. Name, symbol, and max supply
 *      are set at construction time.
 */
contract RWAToken is ERC20, ERC20Burnable, ERC20Pausable, Ownable, AccessControl {
    /// @notice Role identifier for addresses allowed to mint new tokens.
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    /// @notice Role identifier for addresses allowed to pause/unpause transfers.
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    /// @notice Maximum total supply for this RWA token (set at deployment).
    uint256 public immutable maxSupply;

    /// @notice IPFS or HTTPS URI pointing to real-world asset documentation.
    string public assetURI;

    /// @notice Whether holders can redeem tokens for the underlying physical asset.
    bool public redeemable;

    /**
     * @notice Emitted when a user redeems tokens for the underlying physical asset.
     * @param user      Address of the redeemer.
     * @param amount    Number of tokens burned in the redemption.
     * @param timestamp Block timestamp at which the redemption occurred.
     */
    event Redeemed(address indexed user, uint256 amount, uint256 timestamp);

    /**
     * @notice Emitted when the asset documentation URI is updated.
     * @param newURI The new asset documentation URI.
     */
    event AssetURIUpdated(string newURI);

    /**
     * @notice Emitted when the redeemable flag is toggled.
     * @param redeemable New value of the redeemable flag.
     */
    event RedeemableUpdated(bool redeemable);

    /**
     * @notice Deploys a new RWA token.
     * @param name_         Human-readable token name (e.g., "KKIKDA Pu'er Token").
     * @param symbol_       Token ticker (e.g., "PUER").
     * @param maxSupply_    Hard cap on total supply (in wei, 18 decimals).
     * @param initialOwner  Address receiving initial roles. No tokens are pre-minted.
     */
    constructor(
        string memory name_,
        string memory symbol_,
        uint256 maxSupply_,
        address initialOwner
    )
        ERC20(name_, symbol_)
        Ownable(initialOwner)
    {
        require(maxSupply_ > 0, "RWAToken: max supply must be > 0");

        maxSupply = maxSupply_;

        _grantRole(DEFAULT_ADMIN_ROLE, initialOwner);
        _grantRole(MINTER_ROLE, initialOwner);
        _grantRole(PAUSER_ROLE, initialOwner);
    }

    // -------------------------------------------------------------------------
    // Minting
    // -------------------------------------------------------------------------

    /**
     * @notice Mints `amount` tokens to `to`. Reverts if the resulting total
     *         supply would exceed `maxSupply`.
     * @param to     Recipient of the newly minted tokens.
     * @param amount Number of tokens to mint (in wei units, 18 decimals).
     */
    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) {
        require(totalSupply() + amount <= maxSupply, "RWAToken: max supply exceeded");
        _mint(to, amount);
    }

    // -------------------------------------------------------------------------
    // Pause / Unpause
    // -------------------------------------------------------------------------

    /**
     * @notice Pauses all token transfers.
     */
    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    /**
     * @notice Unpauses token transfers.
     */
    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    // -------------------------------------------------------------------------
    // Asset metadata
    // -------------------------------------------------------------------------

    /**
     * @notice Updates the URI pointing to real-world asset documentation.
     * @param uri New IPFS or HTTPS URI.
     */
    function setAssetURI(string memory uri) external onlyRole(DEFAULT_ADMIN_ROLE) {
        assetURI = uri;
        emit AssetURIUpdated(uri);
    }

    /**
     * @notice Toggles whether token holders can redeem for the physical asset.
     * @param _redeemable New redeemable flag value.
     */
    function setRedeemable(bool _redeemable) external onlyRole(DEFAULT_ADMIN_ROLE) {
        redeemable = _redeemable;
        emit RedeemableUpdated(_redeemable);
    }

    // -------------------------------------------------------------------------
    // Redemption
    // -------------------------------------------------------------------------

    /**
     * @notice Burns `amount` of the caller's tokens as part of a physical asset
     *         redemption. Emits a {Redeemed} event that off-chain systems monitor
     *         to fulfil the physical claim.
     * @param amount Number of tokens to burn/redeem.
     */
    function redeem(uint256 amount) external {
        require(redeemable, "RWAToken: redemption not active");
        require(amount > 0, "RWAToken: amount must be > 0");
        require(balanceOf(msg.sender) >= amount, "RWAToken: insufficient balance");

        _burn(msg.sender, amount);

        emit Redeemed(msg.sender, amount, block.timestamp);
    }

    // -------------------------------------------------------------------------
    // Overrides required by Solidity for multiple inheritance
    // -------------------------------------------------------------------------

    /**
     * @dev Hook called before every transfer. Enforces pause logic.
     */
    function _update(
        address from,
        address to,
        uint256 value
    ) internal override(ERC20, ERC20Pausable) {
        super._update(from, to, value);
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title KKDToken
 * @author KKIKDA Team
 * @notice ERC-20 governance and utility token for the KKIKDA exchange platform on BSC.
 * @dev Implements role-based access for minting and pausing, with a hard cap of 100M tokens.
 */
contract KKDToken is ERC20, ERC20Burnable, ERC20Pausable, Ownable, AccessControl {
    /// @notice Role identifier for addresses allowed to mint new tokens.
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    /// @notice Role identifier for addresses allowed to pause/unpause transfers.
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    /// @notice Maximum total supply: 100,000,000 KKD (18 decimals).
    uint256 public constant MAX_SUPPLY = 100_000_000 * 10 ** 18;

    /// @notice Initial supply minted to deployer: 17,142,857 KKD.
    uint256 public constant INITIAL_SUPPLY = 17_142_857 * 10 ** 18;

    /**
     * @notice Deploys the KKD token, mints initial supply to `initialOwner`, and
     *         grants all administrative roles to that address.
     * @param initialOwner The address that receives initial supply and all roles.
     */
    constructor(address initialOwner)
        ERC20("KKIKDA Token", "KKD")
        Ownable(initialOwner)
    {
        _grantRole(DEFAULT_ADMIN_ROLE, initialOwner);
        _grantRole(MINTER_ROLE, initialOwner);
        _grantRole(PAUSER_ROLE, initialOwner);

        _mint(initialOwner, INITIAL_SUPPLY);
    }

    /**
     * @notice Mints `amount` tokens to `to`. Reverts if the resulting total supply
     *         would exceed MAX_SUPPLY.
     * @param to     Recipient of the newly minted tokens.
     * @param amount Number of tokens to mint (in wei units, 18 decimals).
     */
    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) {
        require(totalSupply() + amount <= MAX_SUPPLY, "KKDToken: max supply exceeded");
        _mint(to, amount);
    }

    /**
     * @notice Pauses all token transfers. Only callable by PAUSER_ROLE holders.
     */
    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    /**
     * @notice Unpauses token transfers. Only callable by PAUSER_ROLE holders.
     */
    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    // -------------------------------------------------------------------------
    // Overrides required by Solidity for multiple inheritance
    // -------------------------------------------------------------------------

    /**
     * @dev Hook that is called before every token transfer. Enforces pause logic.
     */
    function _update(
        address from,
        address to,
        uint256 value
    ) internal override(ERC20, ERC20Pausable) {
        super._update(from, to, value);
    }

    /**
     * @dev See {IERC165-supportsInterface}. Resolves conflict between AccessControl.
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

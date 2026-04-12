// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title KKIKDAStaking
 * @author KKIKDA Team
 * @notice Staking contract that lets users stake KKD tokens and earn rewards
 *         based on a configurable APY. Rewards are distributed from a reward
 *         pool that must be funded by the owner.
 * @dev Reward calculation uses a per-second model:
 *          pending = staked * apy * elapsed / (365 days * 10000)
 *      where `apy` is in basis points (e.g., 1200 = 12 %).
 */
contract KKIKDAStaking is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // -------------------------------------------------------------------------
    // Types
    // -------------------------------------------------------------------------

    struct StakeInfo {
        uint256 amount;          // Total staked amount
        uint256 rewardDebt;      // Already-accounted rewards (claimed or recorded)
        uint256 lastStakedAt;    // Timestamp of the most recent stake or re-stake
        uint256 pendingReward;   // Accumulated but unclaimed rewards
    }

    // -------------------------------------------------------------------------
    // State
    // -------------------------------------------------------------------------

    /// @notice The KKD token contract.
    IERC20 public immutable kkdToken;

    /// @notice Annual percentage yield in basis points (e.g., 1200 = 12 %).
    uint256 public apyBps = 1200;

    /// @notice Minimum amount that can be staked at once.
    uint256 public minStakeAmount = 100 * 10 ** 18; // 100 KKD

    /// @notice Lock period in seconds after staking during which unstaking is blocked.
    uint256 public lockPeriod = 7 days;

    /// @notice Total KKD currently staked across all users.
    uint256 public totalStaked;

    /// @notice Per-user staking information.
    mapping(address => StakeInfo) public stakes;

    // -------------------------------------------------------------------------
    // Events
    // -------------------------------------------------------------------------

    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event RewardsClaimed(address indexed user, uint256 amount);
    event APYUpdated(uint256 oldApy, uint256 newApy);
    event MinStakeUpdated(uint256 oldMin, uint256 newMin);
    event LockPeriodUpdated(uint256 oldPeriod, uint256 newPeriod);
    event RewardPoolFunded(address indexed funder, uint256 amount);

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    /**
     * @param kkdToken_     Address of the KKD ERC-20 token.
     * @param initialOwner  Address that owns the staking contract and can
     *                      configure parameters.
     */
    constructor(
        address kkdToken_,
        address initialOwner
    ) Ownable(initialOwner) {
        require(kkdToken_ != address(0), "Staking: zero token address");
        kkdToken = IERC20(kkdToken_);
    }

    // -------------------------------------------------------------------------
    // Staking
    // -------------------------------------------------------------------------

    /**
     * @notice Stakes `amount` of KKD tokens. The caller must have approved this
     *         contract for at least `amount`.
     * @param amount Number of KKD tokens to stake (18 decimals).
     */
    function stake(uint256 amount) external nonReentrant {
        require(amount >= minStakeAmount, "Staking: below minimum stake");

        StakeInfo storage info = stakes[msg.sender];

        // Settle any pending rewards before modifying the stake
        if (info.amount > 0) {
            info.pendingReward += _calculateReward(msg.sender);
        }

        kkdToken.safeTransferFrom(msg.sender, address(this), amount);

        info.amount += amount;
        info.lastStakedAt = block.timestamp;
        totalStaked += amount;

        emit Staked(msg.sender, amount);
    }

    /**
     * @notice Unstakes `amount` of KKD tokens. Reverts if the lock period has
     *         not elapsed since the last stake action.
     * @param amount Number of KKD tokens to unstake.
     */
    function unstake(uint256 amount) external nonReentrant {
        StakeInfo storage info = stakes[msg.sender];
        require(info.amount >= amount, "Staking: insufficient staked balance");
        require(amount > 0, "Staking: amount must be > 0");
        require(
            block.timestamp >= info.lastStakedAt + lockPeriod,
            "Staking: lock period not elapsed"
        );

        // Settle pending rewards before modifying the stake
        info.pendingReward += _calculateReward(msg.sender);

        info.amount -= amount;
        info.lastStakedAt = block.timestamp;
        totalStaked -= amount;

        kkdToken.safeTransfer(msg.sender, amount);

        emit Unstaked(msg.sender, amount);
    }

    // -------------------------------------------------------------------------
    // Rewards
    // -------------------------------------------------------------------------

    /**
     * @notice Claims all accumulated rewards for the caller.
     */
    function claimRewards() external nonReentrant {
        StakeInfo storage info = stakes[msg.sender];

        uint256 reward = info.pendingReward + _calculateReward(msg.sender);
        require(reward > 0, "Staking: no rewards to claim");

        info.pendingReward = 0;
        info.lastStakedAt = block.timestamp;

        // Ensure contract has enough reward tokens
        uint256 rewardBalance = kkdToken.balanceOf(address(this)) - totalStaked;
        require(rewardBalance >= reward, "Staking: insufficient reward pool");

        kkdToken.safeTransfer(msg.sender, reward);

        emit RewardsClaimed(msg.sender, reward);
    }

    /**
     * @notice Returns the total pending (unclaimed) rewards for `user`.
     * @param user Address to query.
     * @return Total pending reward amount.
     */
    function pendingRewards(address user) external view returns (uint256) {
        StakeInfo storage info = stakes[user];
        return info.pendingReward + _calculateReward(user);
    }

    // -------------------------------------------------------------------------
    // Admin
    // -------------------------------------------------------------------------

    /**
     * @notice Funds the reward pool by transferring KKD tokens into this contract.
     *         Anyone may call this, but typically the owner funds it.
     * @param amount Number of KKD tokens to add to the reward pool.
     */
    function fundRewardPool(uint256 amount) external {
        require(amount > 0, "Staking: amount must be > 0");
        kkdToken.safeTransferFrom(msg.sender, address(this), amount);
        emit RewardPoolFunded(msg.sender, amount);
    }

    /**
     * @notice Updates the APY (in basis points).
     * @param newApyBps New APY value (e.g., 1200 = 12 %).
     */
    function setAPY(uint256 newApyBps) external onlyOwner {
        require(newApyBps <= 50_000, "Staking: APY too high"); // max 500 %
        uint256 oldApy = apyBps;
        apyBps = newApyBps;
        emit APYUpdated(oldApy, newApyBps);
    }

    /**
     * @notice Updates the minimum stake amount.
     * @param newMin New minimum in KKD (18 decimals).
     */
    function setMinStakeAmount(uint256 newMin) external onlyOwner {
        uint256 oldMin = minStakeAmount;
        minStakeAmount = newMin;
        emit MinStakeUpdated(oldMin, newMin);
    }

    /**
     * @notice Updates the lock period.
     * @param newPeriod New lock period in seconds.
     */
    function setLockPeriod(uint256 newPeriod) external onlyOwner {
        require(newPeriod <= 365 days, "Staking: lock period too long");
        uint256 oldPeriod = lockPeriod;
        lockPeriod = newPeriod;
        emit LockPeriodUpdated(oldPeriod, newPeriod);
    }

    /**
     * @notice Returns the available reward pool balance (contract balance minus
     *         total staked tokens).
     */
    function rewardPoolBalance() external view returns (uint256) {
        uint256 balance = kkdToken.balanceOf(address(this));
        if (balance <= totalStaked) return 0;
        return balance - totalStaked;
    }

    // -------------------------------------------------------------------------
    // Internal helpers
    // -------------------------------------------------------------------------

    /**
     * @dev Calculates the reward accrued since the user's last action based on
     *      a simple per-second APY model.
     */
    function _calculateReward(address user) internal view returns (uint256) {
        StakeInfo storage info = stakes[user];
        if (info.amount == 0) return 0;

        uint256 elapsed = block.timestamp - info.lastStakedAt;
        // reward = staked * apyBps / 10000 * elapsed / 365 days
        return (info.amount * apyBps * elapsed) / (10_000 * 365 days);
    }
}

- `KeeperCompatibleInterface`
  checkUpkeep function
  This function contains the logic that runs off-chain during every block as an eth_call(link) to determine if performUpkeep should be executed on-chain. To reduce on-chain gas usage, attempt to do your gas intensive calculations off-chain in checkUpkeep and pass the result to performUpkeep on-chain.

Gas limits for checkUpkeep

The checkUpkeep function is subject to the checkGasLimit in the registry configuration.

Because checkUpkeep is only off-chain in simulation it is best to treat this as a view function and not modify any state. This might not always be possible if you want to use more advanced Solidity features like DelegateCall(link). It is a best practice to import the KeeperCompatible.sol(link) contract and use the cannotExecute modifier to ensure that the method can be used only for simulation purposes.

```js
// check the balance on an specific address
// set the checkData to abi encode of the address
function checkUpkeep(bytes calldata checkData) public view returns(bool, bytes memory) {
  address wallet = abi.decode(checkData, (address));
  return (wallet.balance < 1 ether, bytes(""));
}
```

Managing unbounded upkeeps: Limit the problem set of your on-chain execution by creating a range bound for your Upkeep to check and perform. This allows you to keep within predefined gas limits, which creates a predictable upper bound gas cost on your transactions. Break apart your problem into multiple Upkeep registrations to limit the scope of work.

Example: You could create an Upkeep for each subset of addresses that you want to service. The ranges could be 0 to 49, 50 to 99, and 100 to 149.

Managing code paths: Pass in data to your checkUpkeep to make your contract logic go down different code paths. This can be used in creative ways based on your use case needs.

Example: You could support multiple types of Upkeep within a single contract and pass a function selector through the checkData function.

performUpkeep function

- Ensure that your performUpkeep is idempotent. Your performUpkeep function should change state such that checkUpkeep will not return true for the same subset of work once said work is complete. Otherwise the Upkeep will remain eligible and result in multiple performances by the Keeper Network on the exactly same subset of work. As a best practice, always revalidate conditions for your Upkeep at the start of your performUpkeep function.

Identify a list of addresses that require work: You might have a number of addresses that you are validating for conditions before your contract takes an action. Doing this on-chain can be expensive. Filter the list of addresses by validating the necessary conditions within your checkUpkeep function. Then, pass the addresses that meets the condition through the performData function.

For example, if you have a "top up" contract that ensures several hundred account balances never decrease below a threshold, pass the list of accounts that meet the conditions so that the performUpkeep function validates and tops up only a small subset of the accounts.

Identify the subset of states that must be updated: If your contract maintains complicated objects such as arrays and structs, or stores a lot of data, you should read through your storage objects within your checkUpkeep and run your proprietary logic to determine if they require updates or maintenance. After that is complete, you can pass the known list of objects that require updates through the performData function.

## Best practices

- Revalidate performUpkeep

We recommend that you revalidate the conditions and data in performUpkeep before work is performed. By default the performUpkeep is external and thus any party can call it, so revalidation is recommended. If you send data from your checkUpkeep to your performUpkeep and this data drives a critical function, please ensure you put adequate checks in place.

- Trigger ONLY when conditions are met

Some actions must be performed only when specific conditions are met. Check all of the preconditions within performUpkeep to ensure that state change occurs only when necessary.

In this pattern, it is undesirable for the state change to occur until the next time the Upkeep is checked by the network and the conditions are met. It is a best practice to stop any state change or effects by performing the same checks or similar checks that you use in checkUpkeep. These checks validate the conditions before doing the work.

For example, if you have a contract where you create a timer in checkUpkeep that is designed to start a game at a specific time, validate the condition to ensure third-party calls to your performUpkeep function do not start the game at a different time.

- Trigger ONLY when data is verified

Some actions must be performed using data you intend to use. Revalidate that the performData is allowed before execution.

For example, if you have a performUpkeep that funds a wallet and the address of the wallet is received via the performData parameter, ensure you have a list of permissable addresses to compare against to prevent third-party calling your function to send money to their address.

- When triggering is not harmful

Sometimes actions must be performed when conditions are met, but performing actions when conditions are not met is still acceptable. Condition checks within performUpkeep might not be required, but it can still be a good practice to short circuit expensive and unnecessary on-chain processing when it is not required.

It might be desirable to call performUpkeep when the checkUpkeep conditions haven't yet been tested by Chainlink Keepers, so any specific checks that you perform are entirely use case specific.

- Test your contract

As with all smart contract testing, it is important to test the boundaries of your smart contract in order to ensure it operates as intended. Similarly, it is important to make sure your Keepers-compatible contract operates within the parameters of the KeeperRegistry.

Test all of your mission-critical contracts, and stress-test the contract to confirm the performance and correct operation of your use case under load and adversarial conditions. The Chainlink Keeper Network will continue to operate under stress, but so should your contract. For a list of supported Testnet blockchains, please review the supported networks page.

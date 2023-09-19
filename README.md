# evm-address-exporter
Use the address exporter to save evm addressess on most chains by querying from the present moment, back to an anchor address on a contract (poap / erc721 / erc1155) and on a chain.

## poap / erc721 example

```js
import { AddressExporter } from './lib';

(() => {
    const anchorAddress = '0x'
    const description = 'Game Development in Web3: Real Use Cases, Challenges, and Solutions 🎮 🛠️'
    const ae = new AddressExporter('https://gnosis-indexer.sequence.app', '0x22C1f6050E56d2876009903609a2cC3fEf83B415')
    ae.run(anchorAddress, description)
})()
```

# community note
please avoid spam
build applications with clear messaging about intent of address use
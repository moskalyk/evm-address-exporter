import { SequenceIndexerClient } from '@0xsequence/indexer'
import fs from 'fs'

const csvHeader = "Address";
const filePath = 'addresses.csv';

class AddressExporter {
    indexer
    contractAddress

    constructor(indexerRPC: string, contractAddress: string){
        this.indexer = new SequenceIndexerClient(indexerRPC);
        this.contractAddress = contractAddress
    }

    private async fullIndexer (indexer: any, anchorAddress: string, contractAddress: string) {
        const txs: any = []
    
        const filter = {
            contractAddress: contractAddress,
        }
      
        // query Sequence Indexer for all token transaction history on Polygon
        let txHistory = await indexer.getTransactionHistory({
            filter: filter,
            includeMetadata: true
        })
      
        txs.push(...txHistory.transactions)
      
        // if there are more transactions to log, proceed to paginate
        while(txHistory.page.more){  
            txHistory = await indexer.getTransactionHistory({
                filter: filter,
                includeMetadata: true,
                page: { 
                    pageSize: 100, 
                    // use the after cursor from the previous indexer call
                    after: txHistory!.page!.after! 
                }
            })
            let anchor = false;
            txHistory.transactions.map((tx: any) => {
                console.log(tx)
                tx.transfers.map((transfer: any) => {
                    if(transfer.to == anchorAddress){
                        anchor = true;
                    }
                })
            })
            if(anchor) break;
            txs.push(...txHistory.transactions)
        }
      
        console.log(txs)
        return txs
    }
    
    async run(anchorAddress: string, description: string){
        // query Sequence Indexer for all token transaction history on Polygon
        const transactionHistory = await this.fullIndexer(this.indexer, anchorAddress, this.contractAddress)

        const exportList: any = []
        transactionHistory.map((tx: any) => {
            tx.transfers.map((transfer: any) => {
                if(transfer.tokenMetadata[transfer.tokenIds[0]].name == description){
                    exportList.push(transfer.to)
                }
            })
        })

        console.log(exportList)
        const csvData = [csvHeader, ...exportList.map((address: any) => address.split(', ').join(','))].join('\n');
        console.log('export history count:', exportList.length)

        // Write the CSV data to the file
        fs.writeFile(filePath, csvData, (err: any) => {
            if (err) {
            console.error(`Error writing to ${filePath}: ${err}`);
            } else {
            console.log(`Addresses have been exported to ${filePath}`);
            }
        });
    }
}

export {
    AddressExporter
}
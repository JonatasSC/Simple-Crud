import { Injectable } from "@nestjs/common";
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class transactionService {
    generateTransactionId(): string {
        return uuidv4()
    }
}
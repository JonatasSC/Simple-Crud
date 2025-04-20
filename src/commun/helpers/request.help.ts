import { Request } from "express";


export function generateTransactionId(req: Request): string {
    return (req as any).transactionId || 'unknown-tx'
}
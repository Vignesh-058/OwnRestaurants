import type { Table } from '@/types/dinein.types';

const MOCK_TABLES: Table[] = [
  { _id: 't1', tableName: 'Table 1', tableNumber: '1', status: 'AVAILABLE', capacity: 2 },
  { _id: 't2', tableName: 'Table 2', tableNumber: '2', status: 'OCCUPIED', capacity: 4 },
  { _id: 't3', tableName: 'Table 3', tableNumber: '3', status: 'AVAILABLE', capacity: 4 },
  { _id: 't4', tableName: 'Table 4', tableNumber: '4', status: 'AVAILABLE', capacity: 6 },
  { _id: 't5', tableName: 'Table 5', tableNumber: '5', status: 'RESERVED', capacity: 2 },
  { _id: 't6', tableName: 'Table 6 (VIP)', tableNumber: '6', status: 'AVAILABLE', capacity: 8 },
];

export const dineInService = {
  async getTables(outletId: string): Promise<Table[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // In a real scenario, it would fetch based on outletId
    return MOCK_TABLES;
  },

  async validateTable(outletId: string, tableNumber: string): Promise<Table> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const table = MOCK_TABLES.find(t => t.tableNumber === tableNumber);
    
    if (!table) {
      throw new Error('Table not found');
    }
    
    if (table.status !== 'AVAILABLE') {
      throw new Error(`Table is currently ${table.status.toLowerCase()}`);
    }
    
    return table;
  }
};

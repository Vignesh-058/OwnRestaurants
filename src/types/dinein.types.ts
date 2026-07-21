export interface Table {
  _id: string;
  tableName: string;
  tableNumber: string;
  capacity?: number;
  status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED';
}

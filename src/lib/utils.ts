import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Timestamp } from "firebase/firestore";
import { format } from "date-fns";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function fromFirestore<T>(data: any): T {
  if (data === null || typeof data !== 'object') {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(item => fromFirestore(item)) as any;
  }

  if (data instanceof Timestamp) {
    return format(data.toDate(), 'yyyy-MM-dd HH:mm:ss');
  }

  const newData: { [key: string]: any } = {};
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      newData[key] = fromFirestore(data[key]);
    }
  }

  return newData as T;
}
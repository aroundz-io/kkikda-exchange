/**
 * Physical pickup points where redeemed Vintage Pu'er can be collected
 * in person. KKIKDAGEO does NOT ship physical inventory — buyers must
 * appear at one of these vault-grade locations with a valid ID.
 */
export interface PickupPoint {
  id: string;
  name: string;
  region: string;
  address: string;
  hoursWeekday: string;
  hoursWeekend: string;
  contact: string;
}

export const PICKUP_POINTS: PickupPoint[] = [
  {
    id: "seoul-flagship",
    name: "KKIKDAGEO Seoul Flagship",
    region: "Seoul, Republic of Korea",
    address: "27, Apgujeong-ro 60-gil, Gangnam-gu",
    hoursWeekday: "11:00 – 19:00 KST",
    hoursWeekend: "12:00 – 17:00 KST (appt. only)",
    contact: "+82-2-555-0188",
  },
  {
    id: "hk-kura",
    name: "Hong Kong Heritage Kura",
    region: "Sheung Wan, Hong Kong SAR",
    address: "12/F, Wing On Centre, 111 Connaught Rd Central",
    hoursWeekday: "10:00 – 18:00 HKT",
    hoursWeekend: "By appointment only",
    contact: "+852-2580-0188",
  },
];

export function findPickupPoint(id: string): PickupPoint | undefined {
  return PICKUP_POINTS.find((p) => p.id === id);
}

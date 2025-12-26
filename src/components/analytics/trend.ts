export type TrendRange = '7d' | '30d' | '1y';

export type TrendPoint = { label: string; value: number; raw: string };

type ProductLike = { createdAt: string };

function isSameDay(d1: Date, d2: Date) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

function isSameMonth(d1: Date, d2: Date) {
  return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth();
}

export function buildTrendData(products: ProductLike[], range: TrendRange): TrendPoint[] {
  const now = new Date();

  const filterByRange = (items: ProductLike[]) => {
    const rangeDays = range === '7d' ? 7 : range === '30d' ? 30 : 365;
    const start = new Date(now);
    start.setDate(now.getDate() - (rangeDays - 1));

    return items.filter((p) => {
      const created = new Date(p.createdAt);
      return created >= start && created <= now;
    });
  };

  const scopedProducts = filterByRange(products);

  if (range === '7d') {
    const days: TrendPoint[] = [];
    for (let i = 6; i >= 0; i--) {
      const day = new Date(now);
      day.setDate(now.getDate() - i);
      const raw = day.toISOString().split('T')[0];
      const count = scopedProducts.filter((p) => isSameDay(new Date(p.createdAt), day)).length;
      days.push({ label: raw, value: count, raw });
    }
    return days;
  }

  if (range === '30d') {
    const days: TrendPoint[] = [];
    for (let i = 29; i >= 0; i--) {
      const day = new Date(now);
      day.setDate(now.getDate() - i);
      const raw = day.toISOString().split('T')[0];
      const count = scopedProducts.filter((p) => isSameDay(new Date(p.createdAt), day)).length;
      days.push({ label: raw, value: count, raw });
    }
    return days;
  }

  // 1 year -> 12 months
  const months: TrendPoint[] = [];
  for (let i = 11; i >= 0; i--) {
    const month = new Date(now);
    month.setMonth(now.getMonth() - i);
    const raw = new Date(Date.UTC(month.getFullYear(), month.getMonth(), 1))
      .toISOString()
      .split('T')[0];
    const count = scopedProducts.filter((p) => isSameMonth(new Date(p.createdAt), month)).length;
    months.push({ label: raw, value: count, raw });
  }
  return months;
}

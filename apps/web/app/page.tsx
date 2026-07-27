import { api, type Headline, type AdRow } from '@/lib/api';

// The dashboard is deliberately one number and one table. The headline is cost
// per delivered order — the metric Meta cannot show a COD seller. Everything
// else is a drill-down.

export const dynamic = 'force-dynamic';

function taka(n: number | null | undefined): string {
  if (n === null || n === undefined) return '—';
  return `৳${Number(n).toLocaleString('en-BD')}`;
}

async function safe<T>(p: Promise<T>, fallback: T): Promise<T> {
  try {
    return await p;
  } catch {
    return fallback;
  }
}

export default async function Dashboard() {
  const headline = await safe<Headline>(api<Headline>('/reporting/headline'), {
    spend: 0,
    delivered: 0,
    cost_per_delivered_order: null,
  });
  const ads = await safe<AdRow[]>(api<AdRow[]>('/reporting/ads'), []);

  return (
    <main className="wrap">
      <h1>OrderPilot</h1>
      <p className="sub">Cost per delivered order, by ad creative.</p>

      <div className="headline">
        <div className="label">Cost per delivered order</div>
        <div className="num">{taka(headline.cost_per_delivered_order)}</div>
        <div className="label" style={{ marginTop: 8 }}>
          {headline.delivered} delivered · {taka(headline.spend)} spent
        </div>
      </div>

      <div className="section-title">Ad performance</div>
      {ads.length === 0 ? (
        <p className="empty">
          No ad spend synced yet. The nightly Marketing Insights job fills{' '}
          <code>ad_spend</code>; delivered orders are attributed from the Messenger
          referral payload.
        </p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Ad</th>
              <th>Spend</th>
              <th>Delivered</th>
              <th>Returned</th>
              <th>Cost / delivered</th>
              <th>Return rate</th>
            </tr>
          </thead>
          <tbody>
            {ads.map((a) => (
              <tr key={a.ad_id}>
                <td>{a.ad_name ?? a.ad_id}</td>
                <td>{taka(a.spend)}</td>
                <td>{a.delivered}</td>
                <td>{a.returned}</td>
                <td className={a.cost_per_delivered_order && a.cost_per_delivered_order > 0 ? '' : ''}>
                  {taka(a.cost_per_delivered_order)}
                </td>
                <td className={a.return_rate && a.return_rate > 0.25 ? 'bad' : 'good'}>
                  {a.return_rate === null ? '—' : `${Math.round(a.return_rate * 100)}%`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}

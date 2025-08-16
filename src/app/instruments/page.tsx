import { AnomalyDetector } from "@/components/anomaly-detector";

export default function InstrumentsPage() {
  return (
    <div>
        <h1 className="text-3xl font-bold tracking-tight mb-1">Instrument Integration</h1>
        <p className="text-muted-foreground mb-6">Use machine learning to detect outliers and anomalies in experimental data.</p>
        <AnomalyDetector />
    </div>
  )
}

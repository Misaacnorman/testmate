import { ReportGenerator } from "@/components/report-generator";

export default function ReportsPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">Automated Report Generation</h1>
            <p className="text-muted-foreground mb-6">Implement AI to automatically generate preliminary reports.</p>
            <ReportGenerator />
        </div>
    )
}
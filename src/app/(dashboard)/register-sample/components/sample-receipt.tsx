
"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FormData } from "@/types/form";
import { format } from "date-fns";

type SampleReceiptProps = {
  data: FormData;
  onBack: () => void;
};

export function SampleReceipt({ data, onBack }: SampleReceiptProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4 sm:p-8 bg-background text-foreground flex flex-col items-center">
      <div className="w-full max-w-4xl p-8 bg-white text-black shadow-lg rounded-lg print:shadow-none print:rounded-none" id="receipt">
        <header className="text-center mb-8">
          <p className="text-sm">Serial: 00001</p>
          <h1 className="text-4xl font-bold text-primary" style={{color: '#3F51B5'}}>Sample Receipt</h1>
        </header>

        <section className="mb-6 grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
          <div><strong>Client Name:</strong> {data.step1.clientName}</div>
          <div><strong>Project Title:</strong> {data.step1.projectTitle}</div>
          <div><strong>Date of Receipt:</strong> {data.step1.receiptDate}</div>
          <div><strong>Time of Receipt:</strong> {data.step1.receiptTime}</div>
          <div><strong>Received By:</strong> Admin</div>
          <div><strong>Delivered By:</strong> {data.step1.deliveredBy} ({data.step1.deliveryContact})</div>
        </section>

        <Separator className="my-4 bg-gray-400" />

        <section>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-400">
                <th className="p-2 text-left font-bold">Date of Receipt</th>
                <th className="p-2 text-left font-bold">Material Category (Units)</th>
                <th className="p-2 text-left font-bold">Material Tests (Units)</th>
                <th className="p-2 text-left font-bold">Test Method(s)</th>
                <th className="p-2 text-left font-bold">Concrete Details</th>
              </tr>
            </thead>
            <tbody>
              {data.step2.map((category, index) => {
                const categoryData = data.step3[category];
                const specialData = data.step4[category];
                const selectedTests = Object.keys(categoryData.selectedTests)
                  .filter(id => categoryData.selectedTests[id])
                  .map(id => data.allTests.find(t => t.id === id));

                return (
                  <tr key={category} className="border-b border-gray-300 align-top">
                    <td className="p-2">{index === 0 ? data.step1.receiptDate : ""}</td>
                    <td className="p-2">{category} ({categoryData.quantity})</td>
                    <td className="p-2">
                      {selectedTests.map(test => (
                        <div key={test?.id}>{test?.materialTest} ({categoryData.testQuantities[test!.id]})</div>
                      ))}
                    </td>
                    <td className="p-2">
                       {selectedTests.map(test => (
                        <div key={test?.id}>{test?.testMethods}</div>
                      ))}
                    </td>
                    <td className="p-2">
                        {specialData && specialData.sets.map((set, setIndex) => (
                           <div key={setIndex} className="mb-2">
                               <div><strong>Set {setIndex + 1}:</strong></div>
                               <div>Casting: {format(set.castingDate, 'yyyy-MM-dd')}</div>
                               <div>Testing: {format(set.testingDate, 'yyyy-MM-dd')}</div>
                               <div>Age: {set.age}</div>
                               {set.areaOfUse && <div>Area: {set.areaOfUse}</div>}
                               {set.class && <div>Class: {set.class}</div>}
                               <div>Serials: {set.serials}</div>
                           </div>
                        ))}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        <section className="mt-6 text-sm">
            <h2 className="font-bold">Notes:</h2>
            {data.step2.map(category => {
                if(data.step3[category].notes) {
                    return <p key={category}><strong>{category.toUpperCase()}:</strong> {data.step3[category].notes}</p>
                }
                return null;
            })}
        </section>
      </div>
      <div className="mt-8 flex gap-4 print:hidden">
        <Button variant="outline" onClick={onBack}>Back to Form</Button>
        <Button onClick={handlePrint}>Print Receipt</Button>
      </div>
       <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #receipt, #receipt * {
            visibility: visible;
          }
          #receipt {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

    
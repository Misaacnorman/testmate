
export type Project = {
    id: string;
    date: string;
    projectId: {
        big: string;
        small: string;
    };
    client: string;
    project: string;
    engineerInCharge: string;
    fieldWork: {
        details: string;
        technician: string;
        startDate: string;
        endDate: string;
        remarks: string;
    };
    labWork: {
        details: string;
        technician: string;
        startDate: string;
        agreedDeliveryDate: string;
        signatureAgreed: string;
        actualDeliveryDate: string;
        signatureActual: string;
        remarks: string;
    };
    dispatch: {
        acknowledgement: string;
        issuedBy: string;
        deliveredTo: string;
        contact: string;
        dateTime: string;
    };
};
